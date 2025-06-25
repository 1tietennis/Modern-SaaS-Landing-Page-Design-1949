import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { marketingPackages } from '../../lib/stripe'
import PaymentModal from '../payment/PaymentModal'
import stripePromise from '../../lib/stripe'

const { FiCheck, FiStar, FiZap, FiCreditCard, FiArrowRight } = FiIcons

const MarketingPackages = () => {
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg)
    setShowPaymentModal(true)
  }

  const handleClosePayment = () => {
    setShowPaymentModal(false)
    setSelectedPackage(null)
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Marketing Packages
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Comprehensive digital marketing solutions designed to grow your business. 
          Choose the package that fits your needs and budget.
        </p>
      </motion.div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {marketingPackages.map((pkg, index) => (
          <motion.div
            key={pkg.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className={`relative bg-gray-800 rounded-2xl p-8 border-2 transition-all ${
              pkg.popular 
                ? 'border-primary-500 scale-105' 
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            {/* Popular Badge */}
            {pkg.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                  <SafeIcon icon={FiStar} className="w-4 h-4 mr-1" />
                  Most Popular
                </div>
              </div>
            )}

            {/* Package Header */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
              <p className="text-gray-400 mb-6">{pkg.description}</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">${pkg.price}</span>
                <span className="text-gray-400 ml-2">/month</span>
              </div>

              <motion.button
                onClick={() => handleSelectPackage(pkg)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2 inline" />
                Get Started
              </motion.button>
            </div>

            {/* Features List */}
            <div className="space-y-4">
              <h4 className="font-semibold text-white text-lg mb-4">What's included:</h4>
              {pkg.features.map((feature, idx) => (
                <div key={idx} className="flex items-start">
                  <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Background Glow for Popular */}
            {pkg.popular && (
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl pointer-events-none"></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Add-ons Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-2xl p-8 border border-gray-600"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Popular Add-ons</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Landing Page Design', price: 497, icon: FiZap },
            { name: 'Logo & Brand Package', price: 297, icon: FiStar },
            { name: 'Video Marketing', price: 797, icon: FiZap },
            { name: 'E-commerce Setup', price: 997, icon: FiStar }
          ].map((addon, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 rounded-xl p-6 text-center border border-gray-600 hover:border-gray-500 transition-all"
            >
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <SafeIcon icon={addon.icon} className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-white mb-2">{addon.name}</h4>
              <p className="text-2xl font-bold text-primary-400">${addon.price}</p>
              <button className="mt-4 w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors">
                Add to Package
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Custom Package CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-center text-white"
      >
        <h3 className="text-3xl font-bold mb-4">Need a Custom Package?</h3>
        <p className="text-primary-100 mb-6 max-w-2xl mx-auto text-lg">
          Every business is unique. Let us create a custom marketing package tailored 
          specifically to your industry, goals, and budget.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-50 transition-colors inline-flex items-center"
        >
          Request Custom Quote
          <SafeIcon icon={FiArrowRight} className="w-5 h-5 ml-2" />
        </motion.button>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePayment}
        packageInfo={selectedPackage}
        stripePromise={stripePromise}
      />
    </div>
  )
}

export default MarketingPackages