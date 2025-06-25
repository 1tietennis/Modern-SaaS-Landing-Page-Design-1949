import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import localSEOService from '../../lib/localSEO'

const { 
  FiMapPin, FiStar, FiTrendingUp, FiEye, FiPhone, FiNavigation, 
  FiCheckCircle, FiAlertCircle, FiClock, FiEdit, FiCamera, FiMessageSquare 
} = FiIcons

const LocalSEODashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [gmbProfiles, setGmbProfiles] = useState([])
  const [keywords, setKeywords] = useState([])
  const [citations, setCitations] = useState([])
  const [reviews, setReviews] = useState([])
  const [auditResults, setAuditResults] = useState({})

  useEffect(() => {
    loadSEOData()
  }, [])

  const loadSEOData = () => {
    setGmbProfiles(localSEOService.gmbProfiles)
    setKeywords(localSEOService.trackLocalKeywords())
    setCitations(localSEOService.getCitations())
    setReviews(localSEOService.getReviews())
    setAuditResults(localSEOService.performLocalSEOAudit())
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-500/20 text-green-400'
      case 'claimed': return 'bg-blue-500/20 text-blue-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-red-500/20 text-red-400'
    }
  }

  const getOpportunityColor = (opportunity) => {
    switch (opportunity) {
      case 'high': return 'bg-green-500/20 text-green-400'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400'
      default: return 'bg-red-500/20 text-red-400'
    }
  }

  const renderOverview = () => {
    const profile = gmbProfiles[0] // Main profile
    
    return (
      <div className="space-y-6">
        {/* GMB Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                <SafeIcon icon={FiMapPin} className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profile?.businessName}</h2>
                <p className="text-gray-400">{profile?.category}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex items-center">
                    <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white ml-1">{profile?.rating}</span>
                    <span className="text-gray-400 ml-1">({profile?.reviewCount} reviews)</span>
                  </div>
                  {profile?.verified && (
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              <SafeIcon icon={FiEdit} className="w-4 h-4 mr-2 inline" />
              Edit Profile
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiEye} className="w-5 h-5 text-blue-400" />
                <span className="text-xs text-gray-400">This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile?.insights?.views?.toLocaleString()}</p>
              <p className="text-sm text-gray-400">Profile Views</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiPhone} className="w-5 h-5 text-green-400" />
                <span className="text-xs text-gray-400">This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile?.insights?.calls}</p>
              <p className="text-sm text-gray-400">Phone Calls</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiNavigation} className="w-5 h-5 text-purple-400" />
                <span className="text-xs text-gray-400">This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile?.insights?.directions}</p>
              <p className="text-sm text-gray-400">Directions</p>
            </div>
            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <SafeIcon icon={FiTrendingUp} className="w-5 h-5 text-orange-400" />
                <span className="text-xs text-gray-400">This Month</span>
              </div>
              <p className="text-2xl font-bold text-white">{profile?.insights?.websiteClicks}</p>
              <p className="text-sm text-gray-400">Website Clicks</p>
            </div>
          </div>
        </motion.div>

        {/* SEO Audit Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Local SEO Audit</h3>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-white">{auditResults.score}</p>
                <p className="text-sm text-gray-400">SEO Score</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                auditResults.score >= 80 ? 'bg-green-500/20' :
                auditResults.score >= 60 ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                <span className={`text-lg ${
                  auditResults.score >= 80 ? 'text-green-400' :
                  auditResults.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {auditResults.score >= 80 ? '🎯' : auditResults.score >= 60 ? '⚠️' : '🚨'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-3">Issues Found</h4>
              <div className="space-y-2">
                {auditResults.issues?.map((issue, index) => (
                  <div key={index} className="flex items-center space-x-2 text-red-400">
                    <SafeIcon icon={FiAlertCircle} className="w-4 h-4" />
                    <span className="text-sm">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-3">Recommendations</h4>
              <div className="space-y-2">
                {auditResults.recommendations?.map((rec, index) => (
                  <div key={index} className="flex items-center space-x-2 text-blue-400">
                    <SafeIcon icon={FiCheckCircle} className="w-4 h-4" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Recent Reviews</h3>
            <button className="text-primary-400 hover:text-primary-300 text-sm">View All</button>
          </div>
          
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{review.author}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon 
                          key={i} 
                          icon={FiStar} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{review.platform}</span>
                  </div>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <p className="text-gray-300 text-sm mb-2">{review.text}</p>
                {review.response ? (
                  <div className="bg-gray-700 p-3 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Your Response:</p>
                    <p className="text-gray-300 text-sm">{review.response}</p>
                  </div>
                ) : (
                  <button className="text-primary-400 hover:text-primary-300 text-sm">
                    <SafeIcon icon={FiMessageSquare} className="w-4 h-4 mr-1 inline" />
                    Respond
                  </button>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  const renderKeywords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Local Keyword Tracking</h2>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
          Add Keywords
        </button>
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
                <th className="text-left p-4 text-gray-300 font-medium">Ranking</th>
                <th className="text-left p-4 text-gray-300 font-medium">Volume</th>
                <th className="text-left p-4 text-gray-300 font-medium">Difficulty</th>
                <th className="text-left p-4 text-gray-300 font-medium">Trend</th>
                <th className="text-left p-4 text-gray-300 font-medium">Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {keywords.map((keyword, index) => (
                <tr key={index} className="border-t border-gray-600 hover:bg-gray-700/50">
                  <td className="p-4 text-white font-medium">{keyword.keyword}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      keyword.ranking <= 3 ? 'bg-green-500/20 text-green-400' :
                      keyword.ranking <= 10 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      #{keyword.ranking}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">{keyword.volume?.toLocaleString()}</td>
                  <td className="p-4 text-gray-300">{keyword.difficulty}</td>
                  <td className="p-4">
                    <span className={`${
                      keyword.trend === 'up' ? 'text-green-400' :
                      keyword.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {keyword.trend === 'up' ? '📈' : keyword.trend === 'down' ? '📉' : '➡️'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getOpportunityColor(keyword.opportunity)}`}>
                      {keyword.opportunity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const renderCitations = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Citation Management</h2>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
          Check New Citations
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {citations.map((citation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{citation.platform}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(citation.status)}`}>
                {citation.status}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Last Updated:</span>
                <span className="text-gray-300">{citation.lastUpdated}</span>
              </div>
              
              <div className="flex space-x-2 mt-4">
                {citation.status === 'verified' ? (
                  <button className="flex-1 bg-green-500/20 text-green-400 py-2 px-3 rounded-lg text-sm">
                    <SafeIcon icon={FiCheckCircle} className="w-3 h-3 mr-1 inline" />
                    Verified
                  </button>
                ) : (
                  <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                    {citation.status === 'pending' ? 'Check Status' : 'Claim Now'}
                  </button>
                )}
                <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                  <SafeIcon icon={FiEdit} className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Citation Opportunities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Foursquare', priority: 'high', status: 'unclaimed' },
            { name: 'Apple Maps', priority: 'high', status: 'unclaimed' },
            { name: 'TripAdvisor', priority: 'medium', status: 'unclaimed' },
            { name: 'Angie\'s List', priority: 'medium', status: 'unclaimed' }
          ].map((opportunity, index) => (
            <div key={index} className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{opportunity.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  opportunity.priority === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {opportunity.priority}
                </span>
              </div>
              <button className="w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                Claim Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiTrendingUp },
    { id: 'keywords', label: 'Keywords', icon: FiEye },
    { id: 'citations', label: 'Citations', icon: FiMapPin },
    { id: 'reviews', label: 'Reviews', icon: FiStar }
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
            <h1 className="text-2xl font-bold text-white mb-2">Local SEO Management</h1>
            <p className="text-gray-400">Dominate local search results and drive more foot traffic</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <SafeIcon icon={FiCamera} className="w-4 h-4 mr-2 inline" />
              Add Photos
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
        {activeTab === 'keywords' && renderKeywords()}
        {activeTab === 'citations' && renderCitations()}
        {activeTab === 'reviews' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Review Management</h3>
            <p className="text-gray-400">Advanced review management features coming soon...</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default LocalSEODashboard