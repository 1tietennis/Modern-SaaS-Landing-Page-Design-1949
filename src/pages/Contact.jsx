import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ContactForm from '../components/forms/ContactForm'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'

const { FiMail, FiPhone, FiMapPin, FiClock, FiMessageCircle } = FiIcons

const Contact = () => {
  const [leads, setLeads] = useState([])

  const handleFormSubmit = (leadData) => {
    // Add to leads state (in a real app, this would go to your CRM)
    setLeads(prev => [...prev, leadData])
    
    // Here you would typically:
    // 1. Send to your CRM system
    // 2. Trigger email notifications
    // 3. Update your database
    console.log('New lead captured:', leadData)
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Let's Grow Your Business Together
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to take your digital marketing to the next level? Our team is here to help 
            you achieve your business goals with proven strategies and cutting-edge technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <ContactForm onSubmit={handleFormSubmit} />
          </div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Contact Info Cards */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-600">
              <h3 className="text-2xl font-bold text-white mb-6">Get in Touch</h3>
              
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="bg-primary-500 p-3 rounded-lg mr-4">
                    <SafeIcon icon={FiMail} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Email Us</p>
                    <p className="text-gray-300">hello@cyborgcrm.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-secondary-500 p-3 rounded-lg mr-4">
                    <SafeIcon icon={FiPhone} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Call Us</p>
                    <p className="text-gray-300">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-green-500 p-3 rounded-lg mr-4">
                    <SafeIcon icon={FiMapPin} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Visit Us</p>
                    <p className="text-gray-300">123 Business Ave, Suite 100<br />San Francisco, CA 94105</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-yellow-500 p-3 rounded-lg mr-4">
                    <SafeIcon icon={FiClock} className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Business Hours</p>
                    <p className="text-gray-300">Mon - Fri: 9:00 AM - 6:00 PM PST<br />Sat: 10:00 AM - 4:00 PM PST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose CyborgCRM?</h3>
              
              <div className="space-y-4">
                {[
                  'Proven track record with 500+ successful campaigns',
                  '24/7 support and dedicated account management',
                  'Custom strategies tailored to your industry',
                  'Transparent reporting and real-time analytics',
                  'No long-term contracts, cancel anytime'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <SafeIcon icon={FiMessageCircle} className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Response Time Guarantee */}
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={FiClock} className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">24-Hour Response Guarantee</h4>
              <p className="text-gray-300">
                We'll respond to your inquiry within 24 hours, guaranteed. 
                Most inquiries are answered within 2-4 hours during business days.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Contact