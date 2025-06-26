import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'

const { FiMessageSquare, FiSend, FiBot, FiUser, FiX, FiMinimize2, FiFileText, FiClock, FiCheck, FiZap } = FiIcons

const DigitalAssistant = ({ isOpen, onToggle, clientData }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi ${clientData?.name || 'there'}! I'm your digital assistant. I can help you with:\n\n• Document status updates\n• Proposal questions\n• Contract clarifications\n• Project timelines\n• General support\n\nWhat can I help you with today?`,
      sender: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)

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
    
    // Process assistant response
    processAssistantResponse(inputText)
    setInputText('')
  }

  const processAssistantResponse = (userMessage) => {
    setIsTyping(true)

    // Simulate processing delay
    setTimeout(() => {
      const response = generateResponse(userMessage)
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: response,
        sender: 'assistant',
        timestamp: new Date()
      }])
      
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase()

    // Document status queries
    if (lowerMessage.includes('status') || lowerMessage.includes('document')) {
      return `I can see you have:\n\n📄 2 proposals pending review\n📋 1 contract awaiting signature\n✅ 3 documents approved\n\nWould you like me to show you the details of any specific document?`
    }

    // Proposal questions
    if (lowerMessage.includes('proposal')) {
      return `Your latest proposal "Digital Marketing Strategy 2024" was sent on ${new Date().toLocaleDateString()}. The proposal includes:\n\n• SEO optimization\n• Social media management\n• Content marketing\n• Monthly reporting\n\nExpected response time: 5-7 business days. Would you like to schedule a call to discuss any questions?`
    }

    // Contract questions
    if (lowerMessage.includes('contract')) {
      return `Your service contract is ready for review. Key details:\n\n• 12-month engagement\n• Monthly retainer: $4,999\n• Includes all proposed services\n• 30-day notice for changes\n\nYou can review and sign digitally in the Contracts section. Any questions about the terms?`
    }

    // Timeline questions
    if (lowerMessage.includes('timeline') || lowerMessage.includes('schedule')) {
      return `Here's your project timeline:\n\n📅 Week 1-2: Strategy & setup\n📅 Week 3-4: Campaign launch\n📅 Week 5-8: Optimization phase\n📅 Ongoing: Monthly reviews\n\nWe're currently on track with all milestones. Next review is scheduled for ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`
    }

    // Payment/billing questions
    if (lowerMessage.includes('payment') || lowerMessage.includes('billing') || lowerMessage.includes('invoice')) {
      return `Your billing information:\n\n💳 Next payment: $4,999 due ${new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString()}\n📧 Invoices sent monthly via email\n🔄 Auto-pay enabled\n\nAll payments are up to date. Need to update payment method or billing address?`
    }

    // Support/help
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return `I'm here to help! You can:\n\n🔍 Ask about document status\n📊 Request project updates\n📅 Schedule meetings\n💬 Get quick answers\n📞 Connect with your account manager\n\nFor urgent matters, call +1 (555) 123-4567 or email support@cyborgcrm.com`
    }

    // Meeting/call scheduling
    if (lowerMessage.includes('meeting') || lowerMessage.includes('call') || lowerMessage.includes('schedule')) {
      return `I'd be happy to help schedule a meeting! Available slots this week:\n\n📅 Tuesday 2:00 PM - 3:00 PM\n📅 Wednesday 10:00 AM - 11:00 AM\n📅 Friday 3:00 PM - 4:00 PM\n\nWhich time works best for you? I'll send a calendar invite with meeting details.`
    }

    // Default response
    return `I understand you're asking about "${message}". Let me connect you with the right information or team member. In the meantime, you can:\n\n• Check the Documents section for file updates\n• Review your project timeline in Dashboard\n• Send a message to your account manager\n\nIs there something specific I can help clarify?`
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
        <SafeIcon icon={FiBot} className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
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
            <h3 className="font-semibold">Digital Assistant</h3>
            <p className="text-xs opacity-90">Online • Ready to help</p>
          </div>
        </div>
        <div className="flex space-x-2">
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

      {/* Quick Actions */}
      <div className="p-3 border-b bg-gray-50">
        <div className="flex space-x-2">
          {[
            { label: 'Document Status', icon: FiFileText },
            { label: 'Schedule Call', icon: FiClock },
            { label: 'Project Update', icon: FiCheck }
          ].map((action, index) => (
            <button
              key={index}
              onClick={() => setInputText(action.label)}
              className="flex items-center space-x-1 bg-white px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors text-sm"
            >
              <SafeIcon icon={action.icon} className="w-3 h-3 text-gray-600" />
              <span className="text-gray-700">{action.label}</span>
            </button>
          ))}
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
                : 'bg-white text-gray-800 shadow-sm border'
            }`}>
              <div className="flex items-start space-x-2">
                {message.sender === 'assistant' && (
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
              <div className="bg-white text-gray-800 shadow-sm border px-4 py-2 rounded-2xl">
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
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
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
      </div>
    </motion.div>
  )
}

export default DigitalAssistant