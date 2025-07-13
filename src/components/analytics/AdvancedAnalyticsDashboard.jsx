import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import analyticsService from '../../lib/analytics'

const {
  FiTrendingUp, FiUsers, FiEye, FiMousePointer, FiDollarSign, FiTarget,
  FiActivity, FiPieChart, FiBarChart3, FiCalendar, FiDownload, FiRefreshCw,
  FiFilter, FiSettings, FiZap, FiArrowUp, FiArrowDown, FiMinus
} = FiIcons

const AdvancedAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('30d')
  const [analyticsData, setAnalyticsData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [customDateRange, setCustomDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  })

  useEffect(() => {
    loadAnalyticsData()
  }, [dateRange, customDateRange])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const data = await analyticsService.getAdvancedAnalytics(dateRange, customDateRange)
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const MetricCard = ({ title, value, change, icon, color, format: valueFormat = 'number' }) => {
    const formatValue = (val) => {
      if (valueFormat === 'currency') return `$${val?.toLocaleString() || 0}`
      if (valueFormat === 'percentage') return `${val || 0}%`
      if (valueFormat === 'duration') return `${Math.floor(val / 60)}m ${val % 60}s`
      return val?.toLocaleString() || 0
    }

    const getChangeIcon = () => {
      if (change > 0) return FiArrowUp
      if (change < 0) return FiArrowDown
      return FiMinus
    }

    const getChangeColor = () => {
      if (change > 0) return 'text-green-400'
      if (change < 0) return 'text-red-400'
      return 'text-gray-400'
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-r ${color} rounded-xl`}>
            <SafeIcon icon={icon} className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center space-x-1 text-sm ${getChangeColor()}`}>
            <SafeIcon icon={getChangeIcon()} className="w-4 h-4" />
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
          <p className="text-2xl font-bold text-white">{formatValue(value)}</p>
        </div>
      </motion.div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={analyticsData.overview?.revenue}
          change={12.5}
          icon={FiDollarSign}
          color="from-green-400 to-emerald-500"
          format="currency"
        />
        <MetricCard
          title="Website Visitors"
          value={analyticsData.overview?.visitors}
          change={8.3}
          icon={FiUsers}
          color="from-blue-400 to-cyan-500"
        />
        <MetricCard
          title="Conversion Rate"
          value={analyticsData.overview?.conversionRate}
          change={-2.1}
          icon={FiTarget}
          color="from-purple-400 to-indigo-500"
          format="percentage"
        />
        <MetricCard
          title="Avg Session Duration"
          value={analyticsData.overview?.avgSessionDuration}
          change={15.7}
          icon={FiClock}
          color="from-orange-400 to-red-500"
          format="duration"
        />
      </div>

      {/* Revenue Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Revenue Trend</h3>
          <div className="flex space-x-2">
            <select className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Last Year</option>
            </select>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between space-x-2">
          {analyticsData.revenueChart?.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg mb-2 transition-all hover:opacity-80"
                style={{
                  height: `${Math.max((day.revenue / Math.max(...analyticsData.revenueChart.map(d => d.revenue))) * 200, 10)}px`
                }}
                title={`$${day.revenue.toLocaleString()} on ${format(new Date(day.date), 'MMM d')}`}
              />
              <span className="text-xs text-gray-400 text-center">
                {format(new Date(day.date), 'MMM d')}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Traffic Sources & Top Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Traffic Sources</h3>
          <div className="space-y-3">
            {analyticsData.trafficSources?.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                  <span className="text-gray-300">{source.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{source.visitors.toLocaleString()}</span>
                  <span className="text-gray-400 text-sm ml-2">({source.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Top Performing Pages</h3>
          <div className="space-y-3">
            {analyticsData.topPages?.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm">{page.title}</p>
                  <p className="text-gray-400 text-xs">{page.path}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{page.views.toLocaleString()}</p>
                  <p className="text-gray-400 text-xs">views</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )

  const renderCustomReports = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Custom Reports</h2>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Report
        </button>
      </div>

      {/* Report Builder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-bold text-white mb-4">Report Builder</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Metrics</label>
            <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600">
              <option>Revenue</option>
              <option>Visitors</option>
              <option>Conversions</option>
              <option>Page Views</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Dimensions</label>
            <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600">
              <option>Date</option>
              <option>Traffic Source</option>
              <option>Page</option>
              <option>Device Type</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Filters</label>
            <select className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600">
              <option>All Traffic</option>
              <option>Organic Only</option>
              <option>Paid Only</option>
              <option>Mobile Only</option>
            </select>
          </div>
        </div>
        <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
          Generate Report
        </button>
      </motion.div>

      {/* Saved Reports */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-bold text-white mb-4">Saved Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analyticsData.savedReports?.map((report, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{report.name}</h4>
                <SafeIcon icon={FiDownload} className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer" />
              </div>
              <p className="text-gray-400 text-sm mb-3">{report.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Last run: {report.lastRun}</span>
                <span>{report.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderRealTime = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Real-Time Analytics</h2>
        <div className="flex items-center space-x-2 text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm">Live</span>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Active Users"
          value={analyticsData.realTime?.activeUsers}
          change={0}
          icon={FiActivity}
          color="from-green-400 to-emerald-500"
        />
        <MetricCard
          title="Page Views (Last Hour)"
          value={analyticsData.realTime?.pageViewsLastHour}
          change={0}
          icon={FiEye}
          color="from-blue-400 to-cyan-500"
        />
        <MetricCard
          title="Events (Last Hour)"
          value={analyticsData.realTime?.eventsLastHour}
          change={0}
          icon={FiMousePointer}
          color="from-purple-400 to-indigo-500"
        />
        <MetricCard
          title="Conversions Today"
          value={analyticsData.realTime?.conversionsToday}
          change={0}
          icon={FiTarget}
          color="from-orange-400 to-red-500"
        />
      </div>

      {/* Live Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-bold text-white mb-4">Live Activity Feed</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analyticsData.liveActivity?.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg"
            >
              <div className={`w-2 h-2 rounded-full ${activity.type === 'pageview' ? 'bg-blue-400' : activity.type === 'conversion' ? 'bg-green-400' : 'bg-purple-400'}`}></div>
              <div className="flex-1">
                <p className="text-white text-sm">{activity.description}</p>
                <p className="text-gray-400 text-xs">{activity.location} • {activity.timeAgo}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Geographic Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-bold text-white mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-3">Top Countries</h4>
            <div className="space-y-2">
              {analyticsData.geographic?.countries?.map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{country.name}</span>
                  <span className="text-white font-medium">{country.visitors}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white mb-3">Top Cities</h4>
            <div className="space-y-2">
              {analyticsData.geographic?.cities?.map((city, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-gray-300">{city.name}</span>
                  <span className="text-white font-medium">{city.visitors}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'traffic', label: 'Traffic Analysis', icon: FiUsers },
    { id: 'conversions', label: 'Conversions', icon: FiTarget },
    { id: 'reports', label: 'Custom Reports', icon: FiBarChart3 },
    { id: 'realtime', label: 'Real-Time', icon: FiActivity }
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
            <h1 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h1>
            <p className="text-gray-400">Comprehensive insights and performance tracking</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-400">Date Range:</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <button
              onClick={loadAnalyticsData}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {dateRange === 'custom' && (
          <div className="mt-4 flex items-center space-x-4">
            <input
              type="date"
              value={customDateRange.start}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
            />
            <span className="text-gray-400">to</span>
            <input
              type="date"
              value={customDateRange.end}
              onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
            />
          </div>
        )}
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
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
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'reports' && renderCustomReports()}
            {activeTab === 'realtime' && renderRealTime()}
            {(activeTab === 'traffic' || activeTab === 'conversions') && (
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeTab === 'traffic' ? 'Traffic Analysis' : 'Conversion Analytics'}
                </h3>
                <p className="text-gray-400">Advanced {activeTab} features coming soon...</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

export default AdvancedAnalyticsDashboard