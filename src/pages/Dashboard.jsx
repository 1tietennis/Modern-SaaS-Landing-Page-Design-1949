import React from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import AIInsights from '../components/dashboard/AIInsights';
import MetricsCards from '../components/dashboard/MetricsCards';
import RecentActivity from '../components/dashboard/RecentActivity';
import SalesPipeline from '../components/dashboard/SalesPipeline';
import * as FiIcons from 'react-icons/fi';

const { FiTrendingUp, FiUsers, FiDollarSign, FiTarget } = FiIcons;

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-300">
              Here's what's happening with your business today
            </p>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium"
            >
              Quick Actions
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* AI Insights */}
      <AIInsights />

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Pipeline */}
        <div className="lg:col-span-2">
          <SalesPipeline />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;