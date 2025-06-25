import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiDollarSign, FiUsers, FiTrendingUp, FiTarget, FiArrowUp, FiArrowDown } = FiIcons;

const MetricsCards = () => {
  const metrics = [
    {
      title: 'Monthly Revenue',
      value: '$247,890',
      change: '+12.5%',
      trending: 'up',
      icon: FiDollarSign,
      color: 'from-green-400 to-emerald-500'
    },
    {
      title: 'Active Customers',
      value: '1,847',
      change: '+8.2%',
      trending: 'up',
      icon: FiUsers,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      title: 'Conversion Rate',
      value: '24.8%',
      change: '+3.1%',
      trending: 'up',
      icon: FiTarget,
      color: 'from-purple-400 to-pink-500'
    },
    {
      title: 'Pipeline Value',
      value: '$892,340',
      change: '-2.4%',
      trending: 'down',
      icon: FiTrendingUp,
      color: 'from-orange-400 to-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + (index * 0.1) }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600 hover:border-gray-500 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl`}>
              <SafeIcon icon={metric.icon} className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              metric.trending === 'up' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}>
              <SafeIcon 
                icon={metric.trending === 'up' ? FiArrowUp : FiArrowDown} 
                className="w-3 h-3" 
              />
              <span>{metric.change}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.title}</h3>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MetricsCards;