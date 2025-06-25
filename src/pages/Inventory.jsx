import React from 'react';
import { motion } from 'framer-motion';

const Inventory = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Inventory Management</h1>
        <p className="text-gray-400">Real-time tracking and automated reordering</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <p className="text-gray-300">Inventory features coming soon...</p>
      </motion.div>
    </div>
  );
};

export default Inventory;