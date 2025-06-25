import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'
import ticketingService from '../../lib/ticketing'

const { FiMessageCircle, FiSend, FiUser, FiBot, FiX, FiMinimize2, FiTicket } = FiIcons

const AIAgent = ({ isOpen, onToggle, onLeadCapture }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI marketing assistant. I can help you choose the perfect digital marketing package for your business. What's your name?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [conversationStage, setConversationStage] = useState('greeting')
  const [ticketCreated, setTicketCreated] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const aiResponses = {
    greeting: {
      patterns: [/.+/],
      responses: [
        "Nice to meet you, {name}! What type of business do you run? This will help me recommend the best marketing strategy for you."
      ],
      nextStage: 'business_type'
    },
    business_type: {
      patterns: [/.+/],
      responses: [
        "Great! {business} sounds interesting. What's your biggest marketing challenge right now? Are you looking to:\n\n• Increase website traffic\n• Generate more leads\n• Improve social media presence\n• Boost online sales\n• Build brand awareness"
      ],
      nextStage: 'challenges'
    },
    challenges: {
      patterns: [/.+/],
      responses: [
        "I understand your challenges with {challenge}. Based on what you've told me, I'd recommend our {recommendation} package. It includes everything you need to address these specific issues.\n\nWould you like me to show you the details and pricing?"
      ],
      nextStage: 'recommendation'
    },
    recommendation: {
      patterns: [/yes|sure|ok|show me|interested/i],
      responses: [
        "Perfect! Let me get your contact information so I can send you a detailed proposal with custom pricing for your {business}. What's your email address?"
      ],
      nextStage: 'email_capture'
    },
    email_capture: {
      patterns: [/\S+@\S+\.\S+/],
      responses: [
        "Thanks! And what's the best phone number to reach you at? Our team will call within 24 hours to discuss your custom marketing strategy."
      ],
      nextStage: 'phone_capture'
    },
    phone_capture: {
      patterns: [/.+/],
      responses: [
        "Excellent! I've captured all your information and created a support ticket for you:\n\n• Name: {name}\n• Business: {business}\n• Email: {email}\n• Phone: {phone}\n• Ticket #: {ticketNumber}\n\nOur marketing strategist will contact you within 24 hours with a custom proposal. You'll receive SMS and email notifications with updates!"
      ],
      nextStage: 'completed'
    }
  }

  const getAIRecommendation = (business, challenge) => {
    const businessLower = business.toLowerCase()
    const challengeLower = challenge.toLowerCase()
    
    if (businessLower.includes('startup') || businessLower.includes('small') || challengeLower.includes('budget')) {
      return 'Starter'
    } else if (businessLower.includes('enterprise') || businessLower.includes('large') || challengeLower.includes('scale')) {
      return 'Enterprise'
    }
    return 'Professional'
  }

  const processAIResponse = async (userMessage) => {
    const currentStage = aiResponses[conversationStage]
    if (!currentStage) return

    let responseText = currentStage.responses[0]
    let newUserInfo = { ...userInfo }

    // Extract and store user information based on conversation stage
    switch (conversationStage) {
      case 'greeting':
        newUserInfo.name = userMessage
        newUserInfo.firstName = userMessage.split(' ')[0]
        newUserInfo.lastName = userMessage.split(' ').slice(1).join(' ') || ''
        responseText = responseText.replace('{name}', userMessage)
        break
      case 'business_type':
        newUserInfo.business = userMessage
        responseText = responseText.replace('{business}', userMessage)
        break
      case 'challenges':
        newUserInfo.challenge = userMessage
        newUserInfo.recommendation = getAIRecommendation(userInfo.business || '', userMessage)
        responseText = responseText
          .replace('{challenge}', userMessage)
          .replace('{recommendation}', newUserInfo.recommendation)
        break
      case 'email_capture':
        const emailMatch = userMessage.match(/\S+@\S+\.\S+/)
        if (emailMatch) {
          newUserInfo.email = emailMatch[0]
          responseText = responseText.replace('{business}', userInfo.business || 'business')
        }
        break
      case 'phone_capture':
        newUserInfo.phone = userMessage
        
        // Create ticket when we have all information
        try {
          const ticket = await ticketingService.createTicket({
            firstName: newUserInfo.firstName,
            lastName: newUserInfo.lastName,
            email: newUserInfo.email,
            phone: newUserInfo.phone,
            service: 'AI Chat Consultation',
            message: `Business: ${newUserInfo.business}\nChallenge: ${newUserInfo.challenge}\nRecommendation: ${newUserInfo.recommendation}`,
            business: newUserInfo.business,
            challenge: newUserInfo.challenge,
            source: 'ai_chat'
          })
          
          setTicketCreated(ticket)
          newUserInfo.ticketNumber = ticket.ticketNumber
          
          responseText = responseText
            .replace('{name}', userInfo.name || 'there')
            .replace('{business}', userInfo.business || 'your business')
            .replace('{email}', userInfo.email || 'your email')
            .replace('{phone}', userMessage)
            .replace('{ticketNumber}', ticket.ticketNumber)
          
          // Trigger lead capture
          onLeadCapture?.(newUserInfo)
          toast.success(`Ticket #${ticket.ticketNumber} created! SMS notifications sent.`)
        } catch (error) {
          console.error('Error creating ticket:', error)
          toast.error('Error creating ticket. Please try again.')
        }
        break
    }

    setUserInfo(newUserInfo)
    setConversationStage(currentStage.nextStage)

    // Simulate AI typing delay
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1500)
  }

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    
    // Process AI response
    processAIResponse(inputText)
    
    setInputText('')
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <motion.button
        onClick={onToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 rounded-full shadow-2xl z-50 hover:shadow-3xl transition-all"
      >
        <SafeIcon icon={FiMessageCircle} className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiBot} className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold">AI Marketing Assistant</h3>
            <p className="text-xs opacity-90">
              {ticketCreated ? `Ticket #${ticketCreated.ticketNumber} created` : 'Online • Typically replies instantly'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          {ticketCreated && (
            <div className="flex items-center bg-white/20 px-2 py-1 rounded-lg">
              <SafeIcon icon={FiTicket} className="w-3 h-3 mr-1" />
              <span className="text-xs">#{ticketCreated.ticketNumber}</span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiMinimize2} className="w-4 h-4" />
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiX} className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.sender === 'user'
                ? 'bg-primary-500 text-white'
                : 'bg-white text-gray-800 shadow-sm'
            }`}>
              <div className="flex items-start space-x-2">
                {message.sender === 'ai' && (
                  <SafeIcon icon={FiBot} className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                )}
                <p className="text-sm whitespace-pre-line">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
            >
              <div className="bg-white text-gray-800 shadow-sm px-4 py-2 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiBot} className="w-4 h-4 text-primary-500" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        {conversationStage === 'completed' ? (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              Conversation complete! Check your email for next steps.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm"
            >
              Start New Conversation
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <SafeIcon icon={FiSend} className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default AIAgent