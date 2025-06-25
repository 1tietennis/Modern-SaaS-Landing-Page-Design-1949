import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiBrain, FiTrendingUp, FiAlertCircle, FiTarget } = FiIcons;

const AIInsights = () => {
  const insights = [
    {
      type: 'opportunity',
      icon: FiTarget,
      title: 'High-Value Lead Detected',
      message: 'TechCorp Inc. shows 89% conversion probability based on engagement patterns',
      action: 'Schedule Call',
      color: 'from-green-400 to-emerald-500',
      priority: 'high'
    },
    {
      type: 'risk',
      icon: FiAlertCircle,
      title: 'Churn Risk Alert',
      message: 'DataFlow Solutions has decreased activity by 45% in the last 30 days',
      action: 'Send Re-engagement',
      color: 'from-red-400 to-pink-500',
      priority: 'urgent'
    },
    {
      type: 'upsell',
      icon: FiTrendingUp,
      title: 'Upsell Opportunity',
      message: 'ScaleUp Co. is ready for premium features based on usage patterns',
      action: 'Create Proposal',
      color: 'from-blue-400 to-purple-500',
      priority: 'medium'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <SafeIcon icon={FiBrain} className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Insights</h2>
          <p className="text-gray-400 text-sm">Smart recommendations for your business</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-600 hover:border-gray-500 transition-all duration-200"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 bg-gradient-to-r ${insight.color} rounded-lg flex-shrink-0`}>
                <SafeIcon icon={insight.icon} className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-white text-sm">{insight.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    insight.priority === 'urgent' ? 'bg-red-500/20 text-red-400' :
                    insight.priority === 'high' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {insight.priority}
                  </span>
                </div>
                <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                  {insight.message}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-2 px-3 bg-gradient-to-r ${insight.color} text-white text-xs font-medium rounded-lg`}
                >
                  {insight.action}
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIInsights;