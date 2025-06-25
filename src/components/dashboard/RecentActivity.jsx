import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPhone, FiMail, FiMessageSquare, FiCalendar, FiDollarSign, FiUser } = FiIcons;

const RecentActivity = () => {
  const activities = [
    {
      type: 'call',
      icon: FiPhone,
      title: 'Call completed',
      description: 'Called TechCorp Inc. - Sarah Johnson',
      time: '2 minutes ago',
      color: 'from-green-400 to-emerald-500'
    },
    {
      type: 'email',
      icon: FiMail,
      title: 'Email sent',
      description: 'Proposal sent to DataFlow Solutions',
      time: '15 minutes ago',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      type: 'meeting',
      icon: FiCalendar,
      title: 'Meeting scheduled',
      description: 'Demo with ScaleUp Co. tomorrow at 2 PM',
      time: '1 hour ago',
      color: 'from-purple-400 to-pink-500'
    },
    {
      type: 'deal',
      icon: FiDollarSign,
      title: 'Deal updated',
      description: 'Enterprise Plus moved to negotiation',
      time: '2 hours ago',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      type: 'message',
      icon: FiMessageSquare,
      title: 'Message received',
      description: 'New inquiry from CloudFirst',
      time: '3 hours ago',
      color: 'from-indigo-400 to-blue-500'
    },
    {
      type: 'contact',
      icon: FiUser,
      title: 'Contact added',
      description: 'New contact: Jennifer Brown at TechStart',
      time: '4 hours ago',
      color: 'from-pink-400 to-rose-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <p className="text-gray-400 text-sm">Latest updates from your team</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (index * 0.05) }}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-700/50 transition-all cursor-pointer"
          >
            <div className={`p-2 bg-gradient-to-r ${activity.color} rounded-lg flex-shrink-0`}>
              <SafeIcon icon={activity.icon} className="w-4 h-4 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white text-sm">{activity.title}</h3>
                <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
              </div>
              <p className="text-gray-300 text-xs mt-1">{activity.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2 text-center text-gray-400 hover:text-white text-sm transition-colors"
      >
        View all activity
      </motion.button>
    </motion.div>
  );
};

export default RecentActivity;