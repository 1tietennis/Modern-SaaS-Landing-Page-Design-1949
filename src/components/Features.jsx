import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiShield, FiTrendingUp, FiUsers, FiCloud, FiLock } = FiIcons;

const features = [
  {
    icon: FiZap,
    title: 'Lightning Fast',
    description: 'Experience blazing-fast performance with our optimized infrastructure and cutting-edge technology stack.',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    icon: FiShield,
    title: 'Enterprise Security',
    description: 'Bank-level security with end-to-end encryption, SOC 2 compliance, and advanced threat protection.',
    color: 'from-green-400 to-emerald-500'
  },
  {
    icon: FiTrendingUp,
    title: 'Advanced Analytics',
    description: 'Make data-driven decisions with comprehensive analytics, real-time insights, and predictive modeling.',
    color: 'from-blue-400 to-primary-500'
  },
  {
    icon: FiUsers,
    title: 'Team Collaboration',
    description: 'Seamless collaboration tools that keep your team connected and productive across all projects.',
    color: 'from-purple-400 to-secondary-500'
  },
  {
    icon: FiCloud,
    title: 'Cloud Integration',
    description: 'Connect with 100+ popular tools and services through our robust API and integration ecosystem.',
    color: 'from-cyan-400 to-blue-500'
  },
  {
    icon: FiLock,
    title: 'Data Privacy',
    description: 'Your data stays yours. GDPR compliant with transparent privacy policies and secure data handling.',
    color: 'from-pink-400 to-rose-500'
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Modern Businesses
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to streamline operations, boost productivity, and scale your business to new heights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 h-full">
                <div className="relative">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <SafeIcon icon={feature.icon} className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-24 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 md:p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10k+</div>
              <div className="text-primary-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-primary-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">150+</div>
              <div className="text-primary-100">Integrations</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-primary-100">Support</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;