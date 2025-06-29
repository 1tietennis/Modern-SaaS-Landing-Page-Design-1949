import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import websiteAnalyticsService from '../../lib/websiteAnalytics'

const { FiUsers, FiEye, FiClock, FiMousePointer, FiTrendingUp, FiActivity, FiGlobe, FiSmartphone, FiMonitor, FiRefreshCw } = FiIcons

const WebsiteAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('7d')
  const [analyticsData, setAnalyticsData] = useState({
    dailyVisitors: [],
    pageAnalytics: [],
    clickAnalytics: [],
    realtimeData: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    loadAnalyticsData()
    
    // Refresh realtime data every 30 seconds
    const interval = setInterval(() => {
      loadRealtimeData()
    }, 30000)

    return () => clearInterval(interval)
  }, [dateRange])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const endDate = new Date()
      const startDate = getStartDate(dateRange)

      const [dailyVisitors, pageAnalytics, clickAnalytics, realtimeData] = await Promise.all([
        websiteAnalyticsService.getDailyVisitors(startDate, endDate),
        websiteAnalyticsService.getPageAnalytics(startDate, endDate),
        websiteAnalyticsService.getClickAnalytics(startDate, endDate),
        websiteAnalyticsService.getRealtimeData()
      ])

      setAnalyticsData({
        dailyVisitors,
        pageAnalytics,
        clickAnalytics,
        realtimeData
      })
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading analytics data:', error)
      // Load mock data for demonstration
      loadMockData()
    } finally {
      setIsLoading(false)
    }
  }

  const loadRealtimeData = async () => {
    try {
      const realtimeData = await websiteAnalyticsService.getRealtimeData()
      setAnalyticsData(prev => ({ ...prev, realtimeData }))
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading realtime data:', error)
    }
  }

  const getStartDate = (range) => {
    const now = new Date()
    switch (range) {
      case '1d': return subDays(now, 1)
      case '7d': return subDays(now, 7)
      case '30d': return subDays(now, 30)
      case '90d': return subDays(now, 90)
      default: return subDays(now, 7)
    }
  }

  const loadMockData = () => {
    const mockData = {
      dailyVisitors: [
        { date: '2024-01-15', unique_visitors: 45, total_visits: 67, new_visitors: 23, returning_visitors: 22 },
        { date: '2024-01-16', unique_visitors: 52, total_visits: 78, new_visitors: 31, returning_visitors: 21 },
        { date: '2024-01-17', unique_visitors: 61, total_visits: 89, new_visitors: 38, returning_visitors: 23 },
        { date: '2024-01-18', unique_visitors: 48, total_visits: 71, new_visitors: 29, returning_visitors: 19 },
        { date: '2024-01-19', unique_visitors: 73, total_visits: 104, new_visitors: 45, returning_visitors: 28 },
        { date: '2024-01-20', unique_visitors: 68, total_visits: 97, new_visitors: 41, returning_visitors: 27 },
        { date: '2024-01-21', unique_visitors: 79, total_visits: 118, new_visitors: 52, returning_visitors: 27 }
      ],
      pageAnalytics: [
        { page_path: '/', page_title: 'Home', views: 234, unique_visitors: 156, average_time_spent: 145 },
        { page_path: '/about', page_title: 'About Us', views: 89, unique_visitors: 67, average_time_spent: 203 },
        { page_path: '/services', page_title: 'Services', views: 156, unique_visitors: 98, average_time_spent: 178 },
        { page_path: '/contact', page_title: 'Contact', views: 67, unique_visitors: 45, average_time_spent: 89 },
        { page_path: '/blog', page_title: 'Blog', views: 123, unique_visitors: 78, average_time_spent: 267 }
      ],
      clickAnalytics: [
        { page_path: '/', element_type: 'button', element_text: 'Get Started', click_count: 45, unique_clickers: 34 },
        { page_path: '/', element_type: 'a', element_text: 'Learn More', click_count: 38, unique_clickers: 29 },
        { page_path: '/services', element_type: 'button', element_text: 'Contact Us', click_count: 29, unique_clickers: 23 },
        { page_path: '/about', element_type: 'a', element_text: 'Our Team', click_count: 21, unique_clickers: 18 },
        { page_path: '/', element_type: 'a', element_text: 'View Portfolio', click_count: 19, unique_clickers: 15 }
      ],
      realtimeData: {
        active_visitors: 12,
        total_visitors_last_hour: 23,
        top_pages: [
          { page_path: '/', page_title: 'Home', views: 8 },
          { page_path: '/services', page_title: 'Services', views: 5 },
          { page_path: '/about', page_title: 'About', views: 3 }
        ],
        recent_events: [
          { page_path: '/', element_text: 'Get Started', timestamp: new Date().toISOString() },
          { page_path: '/services', element_text: 'Learn More', timestamp: new Date(Date.now() - 120000).toISOString() }
        ]
      }
    }
    setAnalyticsData(mockData)
  }

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Realtime Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Visitors',
            value: analyticsData.realtimeData.active_visitors || 0,
            icon: FiActivity,
            color: 'from-green-400 to-emerald-500',
            description: 'Currently browsing'
          },
          {
            label: 'Visitors (Last Hour)',
            value: analyticsData.realtimeData.total_visitors_last_hour || 0,
            icon: FiUsers,
            color: 'from-blue-400 to-cyan-500',
            description: 'Past 60 minutes'
          },
          {
            label: 'Total Visitors',
            value: analyticsData.dailyVisitors.reduce((sum, day) => sum + day.unique_visitors, 0),
            icon: FiTrendingUp,
            color: 'from-purple-400 to-indigo-500',
            description: `Last ${dateRange}`
          },
          {
            label: 'Page Views',
            value: analyticsData.pageAnalytics.reduce((sum, page) => sum + page.views, 0),
            icon: FiEye,
            color: 'from-orange-400 to-red-500',
            description: `Last ${dateRange}`
          }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl`}>
                <SafeIcon icon={metric.icon} className="w-6 h-6 text-white" />
              </div>
              {index < 2 && (
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-gray-500 text-xs mt-1">{metric.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Daily Visitors Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-xl font-bold text-white mb-6">Daily Visitors Trend</h3>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analyticsData.dailyVisitors.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-cyan-500 to-purple-500 rounded-t-lg mb-2 transition-all hover:opacity-80"
                style={{ height: `${Math.max((day.unique_visitors / Math.max(...analyticsData.dailyVisitors.map(d => d.unique_visitors))) * 200, 10)}px` }}
                title={`${day.unique_visitors} visitors on ${format(new Date(day.date), 'MMM d')}`}
              />
              <span className="text-xs text-gray-400 text-center">
                {format(new Date(day.date), 'MMM d')}
              </span>
              <span className="text-xs text-white font-medium">
                {day.unique_visitors}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Pages & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analyticsData.pageAnalytics.slice(0, 5).map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm">{page.page_title}</p>
                  <p className="text-gray-400 text-xs">{page.page_path}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{page.views}</p>
                  <p className="text-gray-400 text-xs">views</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {analyticsData.realtimeData.recent_events?.slice(0, 5).map((event, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <SafeIcon icon={FiMousePointer} className="w-4 h-4 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-white text-sm">{event.element_text}</p>
                  <p className="text-gray-400 text-xs">{event.page_path}</p>
                </div>
                <span className="text-gray-500 text-xs">
                  {format(new Date(event.timestamp), 'HH:mm')}
                </span>
              </div>
            )) || (
              <p className="text-gray-400 text-center py-4">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )

  const renderPageAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Page Performance</h2>
      <div className="bg-gray-800 rounded-2xl border border-gray-600">
        <div className="p-6 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Page Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Page</th>
                <th className="text-left p-4 text-gray-300 font-medium">Views</th>
                <th className="text-left p-4 text-gray-300 font-medium">Unique Visitors</th>
                <th className="text-left p-4 text-gray-300 font-medium">Avg Time</th>
                <th className="text-left p-4 text-gray-300 font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.pageAnalytics.map((page, index) => (
                <tr key={index} className="border-t border-gray-600 hover:bg-gray-700/50">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{page.page_title}</p>
                      <p className="text-gray-400 text-sm">{page.page_path}</p>
                    </div>
                  </td>
                  <td className="p-4 text-white font-semibold">{page.views}</td>
                  <td className="p-4 text-gray-300">{page.unique_visitors}</td>
                  <td className="p-4 text-gray-300">{formatDuration(page.average_time_spent)}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-600 rounded-full h-2 mr-2">
                        <div 
                          className="bg-cyan-400 h-2 rounded-full"
                          style={{ width: `${Math.min((page.average_time_spent / 300) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm">
                        {Math.min(Math.round((page.average_time_spent / 300) * 100), 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderClickAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Click Tracking</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {analyticsData.clickAnalytics.map((click, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{click.element_text || click.element_id}</h3>
                <p className="text-gray-400 text-sm">{click.page_path}</p>
                <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs capitalize">
                  {click.element_type}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-white">{click.click_count}</p>
                <p className="text-gray-400 text-sm">Total Clicks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{click.unique_clickers}</p>
                <p className="text-gray-400 text-sm">Unique Users</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'pages', label: 'Pages', icon: FiEye },
    { id: 'clicks', label: 'Clicks', icon: FiMousePointer },
    { id: 'visitors', label: 'Visitors', icon: FiUsers }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Website Analytics</h1>
            <p className="text-gray-400">Track visitors, page views, and user interactions</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
              <span>Last updated: {format(lastUpdated, 'HH:mm:ss')}</span>
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <SafeIcon icon={tab.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'pages' && renderPageAnalytics()}
        {activeTab === 'clicks' && renderClickAnalytics()}
        {activeTab === 'visitors' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Visitor Details</h3>
            <p className="text-gray-400">Advanced visitor analytics coming soon...</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default WebsiteAnalyticsDashboard