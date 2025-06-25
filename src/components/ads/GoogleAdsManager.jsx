import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import googleAdsService from '../../lib/googleAds'

const { 
  FiTarget, FiDollarSign, FiTrendingUp, FiEye, FiMousePointer, FiZap, 
  FiPlay, FiPause, FiEdit, FiPlus, FiBarChart3, FiAlertTriangle 
} = FiIcons

const GoogleAdsManager = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [campaigns, setCampaigns] = useState([])
  const [keywords, setKeywords] = useState([])
  const [ads, setAds] = useState([])
  const [performanceData, setPerformanceData] = useState({})
  const [optimizations, setOptimizations] = useState([])

  useEffect(() => {
    loadAdsData()
  }, [])

  const loadAdsData = () => {
    setCampaigns(googleAdsService.campaigns)
    setKeywords(googleAdsService.keywords)
    setAds(googleAdsService.ads)
    setPerformanceData(googleAdsService.getPerformanceData())
    setOptimizations(googleAdsService.getOptimizationSuggestions())
  }

  const getCampaignStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'paused': return 'bg-yellow-500/20 text-yellow-400'
      case 'ended': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getQualityScoreColor = (score) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Impressions', 
            value: performanceData.summary?.impressions?.toLocaleString() || '0', 
            icon: FiEye, 
            color: 'from-blue-400 to-cyan-500',
            change: '+12.5%'
          },
          { 
            label: 'Total Clicks', 
            value: performanceData.summary?.clicks?.toLocaleString() || '0', 
            icon: FiMousePointer, 
            color: 'from-green-400 to-emerald-500',
            change: '+8.3%'
          },
          { 
            label: 'Conversions', 
            value: performanceData.summary?.conversions || '0', 
            icon: FiTarget, 
            color: 'from-purple-400 to-indigo-500',
            change: '+15.7%'
          },
          { 
            label: 'Total Spend', 
            value: `$${performanceData.summary?.cost?.toLocaleString() || '0'}`, 
            icon: FiDollarSign, 
            color: 'from-orange-400 to-red-500',
            change: '+5.2%'
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Click-Through Rate</span>
              <span className="text-white font-medium">{performanceData.summary?.ctr}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Conversion Rate</span>
              <span className="text-white font-medium">{performanceData.summary?.conversionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Cost Per Conversion</span>
              <span className="text-white font-medium">${performanceData.summary?.costPerConversion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Return on Ad Spend</span>
              <span className="text-green-400 font-medium">{performanceData.summary?.roas}x</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Keywords</h3>
          <div className="space-y-3">
            {performanceData.topKeywords?.slice(0, 4).map((keyword, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">{keyword.keyword}</span>
                <div className="text-right">
                  <span className="text-white font-medium">{keyword.conversions}</span>
                  <p className="text-xs text-gray-400">conversions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Ads</h3>
          <div className="space-y-3">
            {performanceData.topAds?.slice(0, 3).map((ad, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-3">
                <p className="text-white text-sm font-medium mb-1">{ad.headline1}</p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>CTR: {ad.ctr}%</span>
                  <span>{ad.conversions} conversions</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-semibold text-white mb-4">AI Optimization Suggestions</h3>
        <div className="space-y-4">
          {optimizations.map((suggestion, index) => (
            <div key={index} className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiAlertTriangle} className={`w-5 h-5 ${
                    suggestion.priority === 'high' ? 'text-red-400' : 
                    suggestion.priority === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                  }`} />
                  <h4 className="font-medium text-white">{suggestion.title}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  suggestion.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  suggestion.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {suggestion.priority}
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-2">{suggestion.description}</p>
              <p className="text-gray-400 text-xs mb-3">{suggestion.action}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-sm font-medium">{suggestion.impact}</span>
                <button className="bg-primary-500 text-white px-3 py-1 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                  Apply Fix
                </button>
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
        <h2 className="text-2xl font-bold text-white">Campaign Management</h2>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{campaign.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm capitalize">{campaign.type}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCampaignStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                </button>
                <button className={`p-2 transition-colors ${
                  campaign.status === 'active' 
                    ? 'text-yellow-400 hover:text-yellow-300' 
                    : 'text-green-400 hover:text-green-300'
                }`}>
                  <SafeIcon icon={campaign.status === 'active' ? FiPause : FiPlay} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-400">Daily Budget</p>
                <p className="text-lg font-semibold text-white">${campaign.budget}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Bidding Strategy</p>
                <p className="text-sm text-gray-300 capitalize">{campaign.biddingStrategy?.replace('_', ' ')}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div>
                <p className="text-xs text-gray-400">Impressions</p>
                <p className="text-sm font-medium text-white">{campaign.performance.impressions?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Clicks</p>
                <p className="text-sm font-medium text-white">{campaign.performance.clicks?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">CTR</p>
                <p className="text-sm font-medium text-white">{campaign.performance.ctr}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Conversions</p>
                <p className="text-sm font-medium text-white">{campaign.performance.conversions}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Spend: ${campaign.performance.cost?.toLocaleString()}</span>
                <span className="text-gray-400">Cost/Conv: ${campaign.performance.costPerConversion}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderKeywords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Keyword Management</h2>
        <div className="flex space-x-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            Keyword Research
          </button>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
            Add Keywords
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-600">
        <div className="p-6 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Keyword Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Keyword</th>
                <th className="text-left p-4 text-gray-300 font-medium">Match Type</th>
                <th className="text-left p-4 text-gray-300 font-medium">CPC</th>
                <th className="text-left p-4 text-gray-300 font-medium">Quality Score</th>
                <th className="text-left p-4 text-gray-300 font-medium">Impressions</th>
                <th className="text-left p-4 text-gray-300 font-medium">Clicks</th>
                <th className="text-left p-4 text-gray-300 font-medium">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword, index) => (
                <tr key={index} className="border-t border-gray-600 hover:bg-gray-700/50">
                  <td className="p-4 text-white font-medium">{keyword.keyword}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs capitalize">
                      {keyword.matchType}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">${keyword.cpc}</td>
                  <td className="p-4">
                    <span className={`font-medium ${getQualityScoreColor(keyword.quality)}`}>
                      {keyword.quality}/10
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{keyword.impressions?.toLocaleString()}</td>
                  <td className="p-4 text-gray-300">{keyword.clicks}</td>
                  <td className="p-4 text-gray-300">{keyword.conversions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: FiTarget },
    { id: 'keywords', label: 'Keywords', icon: FiZap },
    { id: 'ads', label: 'Ads', icon: FiEdit }
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
            <h1 className="text-2xl font-bold text-white mb-2">Google Ads Manager</h1>
            <p className="text-gray-400">Optimize your Google Ads campaigns with AI-powered insights</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
              Connect Google Ads
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
        {activeTab === 'keywords' && renderKeywords()}
        {activeTab === 'ads' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Ad Management</h3>
            <p className="text-gray-400">Advanced ad creation and testing features coming soon...</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default GoogleAdsManager