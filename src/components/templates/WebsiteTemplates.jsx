import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiEye, FiDownload, FiStar, FiZap } = FiIcons

const WebsiteTemplates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const templates = [
    {
      id: 1,
      name: 'Modern Business',
      category: 'business',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Clean and professional template for modern businesses',
      features: ['Responsive Design', 'Contact Forms', 'SEO Optimized', 'Fast Loading'],
      price: 'Free',
      rating: 4.8,
      downloads: '12.5k'
    },
    {
      id: 2,
      name: 'E-commerce Store',
      category: 'ecommerce',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Complete online store with shopping cart and payment integration',
      features: ['Shopping Cart', 'Payment Gateway', 'Inventory Management', 'Order Tracking'],
      price: '$99',
      rating: 4.9,
      downloads: '8.2k',
      premium: true
    },
    {
      id: 3,
      name: 'Creative Portfolio',
      category: 'portfolio',
      image: 'https://images.unsplash.com/photo-1545670723-196ed0954986?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Showcase your creative work with this stunning portfolio template',
      features: ['Gallery Layouts', 'Lightbox Effects', 'Client Testimonials', 'Contact Forms'],
      price: '$49',
      rating: 4.7,
      downloads: '6.8k'
    },
    {
      id: 4,
      name: 'Restaurant & Cafe',
      category: 'restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Perfect for restaurants, cafes, and food businesses',
      features: ['Menu Display', 'Reservation System', 'Location Maps', 'Social Integration'],
      price: '$79',
      rating: 4.6,
      downloads: '4.3k'
    },
    {
      id: 5,
      name: 'SaaS Landing',
      category: 'saas',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Convert visitors with this high-converting SaaS landing page',
      features: ['A/B Testing Ready', 'Analytics Integration', 'Lead Capture', 'Pricing Tables'],
      price: '$129',
      rating: 4.9,
      downloads: '15.7k',
      premium: true
    },
    {
      id: 6,
      name: 'Medical Clinic',
      category: 'medical',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      description: 'Professional template for medical practices and clinics',
      features: ['Appointment Booking', 'Doctor Profiles', 'Service Pages', 'Insurance Info'],
      price: '$89',
      rating: 4.5,
      downloads: '3.1k'
    }
  ]

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'business', name: 'Business', count: templates.filter(t => t.category === 'business').length },
    { id: 'ecommerce', name: 'E-commerce', count: templates.filter(t => t.category === 'ecommerce').length },
    { id: 'portfolio', name: 'Portfolio', count: templates.filter(t => t.category === 'portfolio').length },
    { id: 'restaurant', name: 'Restaurant', count: templates.filter(t => t.category === 'restaurant').length },
    { id: 'saas', name: 'SaaS', count: templates.filter(t => t.category === 'saas').length },
    { id: 'medical', name: 'Medical', count: templates.filter(t => t.category === 'medical').length }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Website Templates
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Professional, responsive website templates designed to convert visitors into customers. 
          Choose from our collection of industry-specific designs.
        </p>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap justify-center gap-4"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </motion.div>

      {/* Templates Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5 }}
            className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-600 hover:border-gray-500 transition-all group"
          >
            {/* Template Image */}
            <div className="relative overflow-hidden">
              <img
                src={template.image}
                alt={template.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {template.premium && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                  <SafeIcon icon={FiZap} className="w-3 h-3 mr-1" />
                  Premium
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-4 left-4 right-4 flex space-x-2">
                  <button className="flex-1 bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center">
                    <SafeIcon icon={FiEye} className="w-4 h-4 mr-2" />
                    Preview
                  </button>
                  <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center">
                    <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
                    Get
                  </button>
                </div>
              </div>
            </div>

            {/* Template Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-white">{template.name}</h3>
                <span className={`font-bold ${template.price === 'Free' ? 'text-green-400' : 'text-primary-400'}`}>
                  {template.price}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-4">{template.description}</p>

              {/* Features */}
              <div className="flex flex-wrap gap-2 mb-4">
                {template.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-700 text-gray-300 px-2 py-1 rounded-lg text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center">
                  <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 mr-1" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiDownload} className="w-4 h-4 mr-1" />
                  <span>{template.downloads} downloads</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Custom Template CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-center text-white"
      >
        <h3 className="text-2xl font-bold mb-4">Need a Custom Template?</h3>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
          Can't find the perfect template? Our design team can create a custom website template 
          tailored specifically to your brand and business needs.
        </p>
        <button className="bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors">
          Request Custom Design
        </button>
      </motion.div>
    </div>
  )
}

export default WebsiteTemplates