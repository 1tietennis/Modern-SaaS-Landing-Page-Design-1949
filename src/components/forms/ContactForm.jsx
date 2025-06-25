import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'
import ticketingService from '../../lib/ticketing'

const { FiSend, FiUser, FiMail, FiPhone, FiMessageSquare, FiBriefcase, FiCheckCircle } = FiIcons

const ContactForm = ({ onSubmit, title = "Get Started Today", subtitle = "Tell us about your project and we'll get back to you within 24 hours." }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketCreated, setTicketCreated] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true)
    
    try {
      // Create ticket first
      const ticket = await ticketingService.createTicket({
        ...data,
        source: 'contact_form'
      })

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In a real app, you would send this to your CRM/database
      const leadData = {
        ...data,
        ticketNumber: ticket.ticketNumber,
        timestamp: new Date().toISOString(),
        source: 'contact_form',
        status: 'new'
      }
      
      console.log('Lead captured with ticket:', leadData)
      
      // Call parent component's onSubmit if provided
      onSubmit?.(leadData)
      
      setTicketCreated(ticket)
      toast.success(`Ticket #${ticket.ticketNumber} created! We'll contact you within 24 hours.`)
      reset()
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (ticketCreated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-8 shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <SafeIcon icon={FiCheckCircle} className="w-8 h-8 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h2>
        <p className="text-gray-600 text-lg mb-6">
          Your inquiry has been received and assigned ticket number:
        </p>
        
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <span className="text-2xl font-bold text-primary-600">#{ticketCreated.ticketNumber}</span>
        </div>
        
        <div className="text-left bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-3">Ticket Details:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Subject:</strong> {ticketCreated.subject}</p>
            <p><strong>Priority:</strong> {ticketCreated.priority.toUpperCase()}</p>
            <p><strong>Status:</strong> {ticketCreated.status.replace('_', ' ').toUpperCase()}</p>
            <p><strong>Created:</strong> {new Date(ticketCreated.createdAt).toLocaleString()}</p>
            {ticketCreated.customFields.leadScore && (
              <p><strong>Lead Score:</strong> {ticketCreated.customFields.leadScore}/100</p>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Our team will review your inquiry and contact you within 24 hours. 
          You'll receive SMS and email notifications with updates.
        </p>
        
        <button
          onClick={() => {
            setTicketCreated(null)
            window.location.reload()
          }}
          className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Submit Another Inquiry
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-8 shadow-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 text-lg">{subtitle}</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name *
            </label>
            <div className="relative">
              <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="firstName"
                {...register('firstName', { required: 'First name is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="John"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name *
            </label>
            <div className="relative">
              <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="lastName"
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Doe"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              id="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="john@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <SafeIcon icon={FiPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              id="phone"
              {...register('phone', { required: 'Phone number is required' })}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="(555) 123-4567"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company Name
          </label>
          <div className="relative">
            <SafeIcon icon={FiBriefcase} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              id="company"
              {...register('company')}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              placeholder="Acme Corporation"
            />
          </div>
        </div>

        {/* Service Interest */}
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
            Service of Interest *
          </label>
          <select
            id="service"
            {...register('service', { required: 'Please select a service' })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Select a service...</option>
            <option value="website-design">Website Design & Development</option>
            <option value="seo">Search Engine Optimization</option>
            <option value="social-media">Social Media Marketing</option>
            <option value="ppc">Pay-Per-Click Advertising</option>
            <option value="content-marketing">Content Marketing</option>
            <option value="email-marketing">Email Marketing</option>
            <option value="full-package">Complete Marketing Package</option>
            <option value="consultation">Free Consultation</option>
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
          )}
        </div>

        {/* Budget Range */}
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Marketing Budget
          </label>
          <select
            id="budget"
            {...register('budget')}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          >
            <option value="">Select budget range...</option>
            <option value="under-1k">Under $1,000</option>
            <option value="1k-5k">$1,000 - $5,000</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-plus">$25,000+</option>
          </select>
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Project Details
          </label>
          <div className="relative">
            <SafeIcon icon={FiMessageSquare} className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              id="message"
              {...register('message')}
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell us about your project goals, current challenges, and what success looks like for your business..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-top-transparent mr-3"></div>
              Creating Ticket...
            </>
          ) : (
            <>
              <SafeIcon icon={FiSend} className="w-5 h-5 mr-3" />
              Submit Inquiry & Create Ticket
            </>
          )}
        </motion.button>

        <p className="text-sm text-gray-500 text-center">
          By submitting this form, a support ticket will be created and you'll receive SMS/email notifications.
          We'll never share your information with third parties.
        </p>
      </form>
    </motion.div>
  )
}

export default ContactForm