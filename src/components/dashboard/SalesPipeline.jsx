import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMoreVertical, FiUser, FiDollarSign } = FiIcons;

const SalesPipeline = () => {
  const pipelineStages = [
    {
      name: 'Prospects',
      count: 24,
      value: '$125,400',
      deals: [
        { company: 'TechCorp Inc.', contact: 'Sarah Johnson', value: '$45,000', probability: 85 },
        { company: 'DataFlow Solutions', contact: 'Mike Chen', value: '$32,000', probability: 65 },
        { company: 'InnovateLab', contact: 'Alex Kim', value: '$28,500', probability: 45 }
      ]
    },
    {
      name: 'Qualified',
      count: 18,
      value: '$287,600',
      deals: [
        { company: 'ScaleUp Co.', contact: 'Emily Rodriguez', value: '$67,800', probability: 75 },
        { company: 'GrowthCorp', contact: 'David Wilson', value: '$54,200', probability: 80 },
        { company: 'NextGen Systems', contact: 'Lisa Thompson', value: '$41,600', probability: 60 }
      ]
    },
    {
      name: 'Proposals',
      count: 12,
      value: '$456,800',
      deals: [
        { company: 'Enterprise Plus', contact: 'James Wilson', value: '$125,000', probability: 90 },
        { company: 'FutureTech', contact: 'Anna Davis', value: '$89,300', probability: 70 },
        { company: 'CloudFirst', contact: 'Tom Anderson', value: '$72,500', probability: 85 }
      ]
    },
    {
      name: 'Negotiation',
      count: 8,
      value: '$234,500',
      deals: [
        { company: 'MegaCorp Ltd.', contact: 'Robert Smith', value: '$156,000', probability: 95 },
        { company: 'TechStart Inc.', contact: 'Jennifer Brown', value: '$78,500', probability: 85 }
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Sales Pipeline</h2>
          <p className="text-gray-400 text-sm">Track deals through your sales process</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <SafeIcon icon={FiMoreVertical} className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {pipelineStages.map((stage, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + (index * 0.1) }}
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-600"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{stage.name}</h3>
                <span className="text-xs text-gray-400">{stage.count} deals</span>
              </div>
              <p className="text-lg font-bold text-green-400">{stage.value}</p>
            </div>

            <div className="space-y-3">
              {stage.deals.map((deal, dealIndex) => (
                <motion.div
                  key={dealIndex}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-600/50 rounded-lg p-3 cursor-pointer hover:bg-gray-600/70 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white text-sm">{deal.company}</h4>
                    <span className="text-xs text-green-400">{deal.probability}%</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-400">
                    <SafeIcon icon={FiUser} className="w-3 h-3" />
                    <span>{deal.contact}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-300 mt-1">
                    <SafeIcon icon={FiDollarSign} className="w-3 h-3" />
                    <span>{deal.value}</span>
                  </div>
                  <div className="mt-2 bg-gray-500 rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${deal.probability}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SalesPipeline;