import React from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import SafeIcon from '../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'

const { FiHome, FiTrendingUp, FiMail, FiZap, FiPackage, FiBarChart3, FiSettings, FiMenu, FiX, FiGlobe, FiCreditCard, FiUsers, FiTicket, FiPlay, FiUserPlus, FiFolder, FiCheckSquare, FiTarget, FiLayers, FiFileText, FiEdit3, FiSend } = FiIcons

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation()

  const menuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard', color: 'text-cyan-400' },
    { path: '/get-started', icon: FiPlay, label: 'Get Started', color: 'text-green-400' },
    { path: '/outreach', icon: FiSend, label: 'B2B Outreach', color: 'text-purple-400' },
    { path: '/client-portal', icon: FiUsers, label: 'Client Portal', color: 'text-blue-400' },
    { path: '/proposals', icon: FiFileText, label: 'Proposals', color: 'text-purple-400' },
    { path: '/contacts', icon: FiUserPlus, label: 'Contact Manager', color: 'text-blue-400' },
    { path: '/projects', icon: FiFolder, label: 'Project Manager', color: 'text-purple-400' },
    { path: '/todos', icon: FiCheckSquare, label: 'Business To-Do', color: 'text-orange-400' },
    { path: '/goals', icon: FiTarget, label: 'Personal Goals', color: 'text-pink-400' },
    { path: '/multi-sites', icon: FiLayers, label: 'Multi-Site Manager', color: 'text-indigo-400' },
    { path: '/websites', icon: FiGlobe, label: 'Website Templates', color: 'text-blue-400' },
    { path: '/packages', icon: FiPackage, label: 'Marketing Packages', color: 'text-green-400' },
    { path: '/contact', icon: FiUsers, label: 'Lead Capture', color: 'text-purple-400' },
    { path: '/tickets', icon: FiTicket, label: 'Support Tickets', color: 'text-orange-400' },
    { path: '/sales', icon: FiTrendingUp, label: 'Sales Pipeline', color: 'text-green-400' },
    { path: '/marketing', icon: FiMail, label: 'Marketing Hub', color: 'text-pink-400' },
    { path: '/automation', icon: FiZap, label: 'Automation Hub', color: 'text-yellow-400' },
    { path: '/analytics', icon: FiBarChart3, label: 'Analytics', color: 'text-purple-400' },
    { path: '/settings', icon: FiSettings, label: 'Settings', color: 'text-gray-400' }
  ]

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="bg-gray-800 border-r border-gray-700 flex flex-col relative"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-white font-bold text-xl">CyborgCRM</span>
          </motion.div>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <SafeIcon icon={collapsed ? FiMenu : FiX} className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 group relative ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <SafeIcon icon={item.icon} className={`w-5 h-5 ${isActive ? item.color : ''}`} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-8 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-r"
                    />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">JD</span>
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-white font-medium text-sm">John Doe</p>
              <p className="text-gray-400 text-xs">Admin</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar