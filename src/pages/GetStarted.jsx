import React from 'react';
import { motion } from 'framer-motion';
import GetStartedComponent from '../components/quest/GetStartedComponent';

const GetStarted = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Get Started</h1>
          <p className="text-gray-400">Complete your onboarding journey with CyborgCRM</p>
        </div>
      </motion.div>

      {/* Quest GetStarted Component */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-2xl border border-gray-600 overflow-hidden"
      >
        <GetStartedComponent />
      </motion.div>
    </div>
  );
};

export default GetStarted;