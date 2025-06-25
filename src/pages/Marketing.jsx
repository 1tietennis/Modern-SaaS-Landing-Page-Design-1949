import React from 'react';
import { motion } from 'framer-motion';

const Marketing = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Marketing Hub</h1>
        <p className="text-gray-400">Hyper-personalized campaigns and automation</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <p className="text-gray-300">Marketing features coming soon...</p>
      </motion.div>
    </div>
  );
};

export default Marketing;