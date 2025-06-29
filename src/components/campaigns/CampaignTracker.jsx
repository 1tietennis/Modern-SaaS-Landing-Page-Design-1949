import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import toast from 'react-hot-toast'
import campaignService from '../../lib/campaigns'

const { FiTarget, FiTrendingUp, FiDollarSign, FiUsers, FiEye, FiMousePointer, FiPlay, FiPause, FiEdit, FiPlus, FiBarChart3, FiCalendar, FiSettings, FiZap, FiAlertCircle } = FiIcons

const CampaignTracker = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [campaigns, setCampaigns] = useState([])
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const [dateRange, setDateRange] = useState('30d')
  const [performanceData, setPerformanceData] = useState({})
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)

  useEffect(() => {
    loadCampaignData()
  }, [dateRange])

  const loadCampaignData = async () => {
    try {
      const [campaignsList, performance] = await Promise.all([
        campaignService.getAllCampaigns(),
        campaignService.getPerformanceData(dateRange)
      ])
      setCampaigns(campaignsList)
      setPerformanceData(performance)
    } catch (error) {
      console.error('Error loading campaign data:', error)
    }
  }

  const handleCreateCampaign = async (campaignData) => {
    try {
      const newCampaign = await campaignService.createCampaign(campaignData)
      setCampaigns(prev => [newCampaign, ...prev])
      setShowCreateCampaign(false)
      toast.success('Campaign created successfully!')
    } catch (error) {
      toast.error('Failed to create campaign')
    }
  }

  const handleToggleCampaign = async (campaignId, active) => {
    try {
      const updatedCampaign = await campaignService.toggleCampaign(campaignId, active)
      setCampaigns(prev => prev.map(c => c.id === campaignId ? updatedCampaign : c))
      toast.success(active ? 'Campaign activated!' : 'Campaign paused!')
    } catch (error) {
      toast.error('Failed to update campaign')
    }
  }

  const CampaignForm = ({ campaign, onSave, onCancel }) => {
    const [formData, setFormData] = useState(campaign || {
      name: '',
      description: '',
      type: 'email',
      budget: '',
      start_date: '',
      end_date: '',
      target_audience: '',
      objectives: [],
      channels: []
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">
            {campaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="email">Email Marketing</option>
                  <option value="social">Social Media</option>
                  <option value="ppc">Pay-Per-Click</option>
                  <option value="content">Content Marketing</option>
                  <option value="influencer">Influencer</option>
                  <option value="event">Event Marketing</option>
                  <option value="affiliate">Affiliate</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Describe the campaign objectives and strategy..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Budget ($)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="5000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
              <input
                type="text"
                value={formData.target_audience}
                onChange={(e) => setFormData(prev => ({ ...prev, target_audience: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., Small business owners aged 25-45"
              />
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Campaign Objectives</h4>
              <div className="space-y-2">
                {[
                  'Increase brand awareness',
                  'Generate leads',
                  'Drive website traffic',
                  'Boost sales',
                  'Improve customer retention',
                  'Launch new product'
                ].map((objective) => (
                  <label key={objective} className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={formData.objectives?.includes(objective)}
                      onChange={(e) => {
                        const newObjectives = e.target.checked
                          ? [...(formData.objectives || []), objective]
                          : (formData.objectives || []).filter(o => o !== objective)
                        setFormData(prev => ({ ...prev, objectives: newObjectives }))
                      }}
                    />
                    <span className="text-gray-300">{objective}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {campaign ? 'Update' : 'Create'} Campaign
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const getCampaignTypeColor = (type) => {
    const colors = {
      email: 'bg-blue-500/20 text-blue-400',
      social: 'bg-pink-500/20 text-pink-400',
      ppc: 'bg-green-500/20 text-green-400',
      content: 'bg-purple-500/20 text-purple-400',
      influencer: 'bg-yellow-500/20 text-yellow-400',
      event: 'bg-indigo-500/20 text-indigo-400',
      affiliate: 'bg-orange-500/20 text-orange-400'
    }
    return colors[type] || colors.email
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400'
      case 'completed': return 'bg-blue-500/20 text-blue-400'
      case 'draft': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Campaigns', 
            value: campaigns.length, 
            icon: FiTarget, 
            color: 'from-blue-400 to-cyan-500',
            change: '+12%'
          },
          { 
            label: 'Active Campaigns', 
            value: campaigns.filter(c => c.status === 'active').length, 
            icon: FiPlay, 
            color: 'from-green-400 to-emerald-500',
            change: '+8%'
          },
          { 
            label: 'Total Spend', 
            value: `$${performanceData.totalSpend?.toLocaleString() || '0'}`, 
            icon: FiDollarSign, 
            color: 'from-orange-400 to-red-500',
            change: '+15%'
          },
          { 
            label: 'Total Conversions', 
            value: performanceData.totalConversions || 0, 
            icon: FiUsers, 
            color: 'from-purple-400 to-indigo-500',
            change: '+23%'
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
              <span className="text-sm text-green-400">{metric.change}</span>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Campaign Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Campaign Performance Trend</h3>
          <div className="flex space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {performanceData.dailyMetrics?.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-primary-500 to-secondary-400 rounded-t-lg mb-2 transition-all hover:opacity-80"
                style={{ 
                  height: `${Math.max((day.conversions / Math.max(...performanceData.dailyMetrics.map(d => d.conversions))) * 200, 10)}px` 
                }}
                title={`${day.conversions} conversions on ${format(new Date(day.date), 'MMM d')}`}
              />
              <span className="text-xs text-gray-400 text-center">
                {format(new Date(day.date), 'MMM d')}
              </span>
            </div>
          )) || Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gradient-to-t from-primary-500 to-secondary-400 rounded-t-lg mb-2 h-12" />
              <span className="text-xs text-gray-400">Day {i + 1}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Performing Campaigns */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-bold text-white mb-4">Top Performing Campaigns</h3>
        <div className="space-y-3">
          {campaigns.slice(0, 5).map((campaign, index) => (
            <div key={campaign.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400 text-sm">#{index + 1}</span>
                <div>
                  <p className="text-white font-medium text-sm">{campaign.name}</p>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getCampaignTypeColor(campaign.type)}`}>
                      {campaign.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{campaign.metrics?.conversions || 0}</p>
                <p className="text-gray-400 text-xs">conversions</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">All Campaigns</h2>
        <button
          onClick={() => setShowCreateCampaign(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer"
            onClick={() => setSelectedCampaign(campaign)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                <p className="text-gray-400 text-sm">{campaign.description}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleCampaign(campaign.id, campaign.status !== 'active')
                }}
                className={`p-2 rounded-lg transition-colors ${
                  campaign.status === 'active' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                <SafeIcon icon={campaign.status === 'active' ? FiPause : FiPlay} className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs ${getCampaignTypeColor(campaign.type)}`}>
                {campaign.type}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-sm mb-4">
              <div>
                <p className="text-white font-medium">{campaign.metrics?.impressions?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-xs">Impressions</p>
              </div>
              <div>
                <p className="text-white font-medium">{campaign.metrics?.clicks?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-xs">Clicks</p>
              </div>
              <div>
                <p className="text-white font-medium">{campaign.metrics?.conversions || '0'}</p>
                <p className="text-gray-400 text-xs">Conversions</p>
              </div>
              <div>
                <p className="text-white font-medium">${campaign.metrics?.spend?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-xs">Spend</p>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-400">
              <span>ROI: {campaign.metrics?.roi || '0'}%</span>
              <span>CTR: {campaign.metrics?.ctr || '0'}%</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Campaign Analytics</h2>
      
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Average CTR', value: `${performanceData.avgCTR || 0}%`, icon: FiMousePointer },
          { label: 'Average CPC', value: `$${performanceData.avgCPC || 0}`, icon: FiDollarSign },
          { label: 'Conversion Rate', value: `${performanceData.conversionRate || 0}%`, icon: FiTarget },
          { label: 'Average ROI', value: `${performanceData.avgROI || 0}%`, icon: FiTrendingUp }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
          >
            <div className="flex items-center space-x-3 mb-2">
              <SafeIcon icon={metric.icon} className="w-5 h-5 text-primary-400" />
              <h3 className="text-gray-400 text-sm font-medium">{metric.label}</h3>
            </div>
            <p className="text-2xl font-bold text-white">{metric.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Campaign Type Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-bold text-white mb-4">Performance by Campaign Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(performanceData.byType || {}).map(([type, data]) => (
            <div key={type} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getCampaignTypeColor(type)}`}>
                  {type}
                </span>
                <span className="text-white font-bold">{data.count || 0}</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Conversions:</span>
                  <span className="text-white">{data.conversions || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Spend:</span>
                  <span className="text-white">${data.spend?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">ROI:</span>
                  <span className="text-white">{data.roi || 0}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: FiTarget },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
    { id: 'settings', label: 'Settings', icon: FiSettings }
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
            <h1 className="text-2xl font-bold text-white mb-2">Campaign Tracking</h1>
            <p className="text-gray-400">Monitor and optimize your marketing campaign performance</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Export Report
            </button>
            <button
              onClick={() => setShowCreateCampaign(true)}
              className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
            >
              New Campaign
            </button>
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Campaign Settings</h3>
            <p className="text-gray-400">Advanced campaign configuration coming soon...</p>
          </div>
        )}
      </motion.div>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <CampaignForm
          onSave={handleCreateCampaign}
          onCancel={() => setShowCreateCampaign(false)}
        />
      )}
    </div>
  )
}

export default CampaignTracker