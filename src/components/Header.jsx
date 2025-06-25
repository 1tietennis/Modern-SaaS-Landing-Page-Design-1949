import React from 'react';
import {motion} from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {FiSearch,FiBell,FiMessageSquare,FiUser,FiGlobe} = FiIcons;

const Header = ({ onConnectWebsite }) => {
  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search customers, deals, campaigns..."
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions and Logo */}
        <div className="flex items-center space-x-4">
          {/* Connect Website Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConnectWebsite}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center hover:shadow-lg transition-all"
          >
            <SafeIcon icon={FiGlobe} className="w-4 h-4 mr-2" />
            Connect Website
          </motion.button>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-white transition-colors relative"
          >
            <SafeIcon icon={FiBell} className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-white transition-colors relative"
          >
            <SafeIcon icon={FiMessageSquare} className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SafeIcon icon={FiUser} className="w-5 h-5" />
          </motion.button>

          {/* Cyborg Logo - 70% Larger */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.15 }}
            className="ml-4 p-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all"
          >
            <img
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1750826481764-blob"
              alt="Cyborg Logo"
              className="w-14 h-14 object-contain"
            />
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;