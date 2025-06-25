import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import socialMediaService, { SOCIAL_PLATFORMS, POST_TYPES } from '../../lib/socialMedia'

const { 
  FiCalendar, FiTrendingUp, FiUsers, FiHeart, FiShare2, FiMessageCircle, 
  FiEdit, FiPlay, FiPause, FiBarChart3, FiSettings, FiPlus, FiEye 
} = FiIcons

const SocialMediaHub = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPlatform, setSelectedPlatform] = useState('all')
  const [posts, setPosts] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [platformStatus, setPlatformStatus] = useState({})

  useEffect(() => {
    loadSocialData()
  }, [])

  const loadSocialData = () => {
    setPosts(socialMediaService.getPosts())
    setCampaigns(socialMediaService.getCampaigns())
    setAnalytics(socialMediaService.getAnalytics())
    setPlatformStatus(socialMediaService.getPlatformStatus())
  }

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: '📘',
      instagram: '📷',
      linkedin: '💼',
      twitter: '🐦',
      youtube: '📺',
      tiktok: '🎵',
      pinterest: '📌'
    }
    return icons[platform] || '📱'
  }

  const getPlatformColor = (platform) => {
    const colors = {
      facebook: 'bg-blue-500',
      instagram: 'bg-pink-500',
      linkedin: 'bg-blue-600',
      twitter: 'bg-sky-500',
      youtube: 'bg-red-500',
      tiktok: 'bg-black',
      pinterest: 'bg-red-600'
    }
    return colors[platform] || 'bg-gray-500'
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Platform Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(platformStatus).map(([platform, status]) => (
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-xl p-4 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getPlatformIcon(platform)}</span>
                <span className="font-medium text-white capitalize">{platform}</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${status.connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            </div>
            <div className="text-sm text-gray-400">
              {status.connected ? (
                <>
                  <p>{status.pages || status.accounts || status.channels || 0} connected</p>
                  <p>Last sync: {status.lastSync ? format(new Date(status.lastSync), 'MMM d') : 'Never'}</p>
                </>
              ) : (
                <p>Not connected</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Reach', value: analytics.overview?.totalReach?.toLocaleString() || '0', icon: FiUsers, color: 'from-blue-400 to-cyan-500' },
          { label: 'Total Engagement', value: analytics.overview?.totalEngagement?.toLocaleString() || '0', icon: FiHeart, color: 'from-pink-400 to-rose-500' },
          { label: 'Total Clicks', value: analytics.overview?.totalClicks?.toLocaleString() || '0', icon: FiTrendingUp, color: 'from-green-400 to-emerald-500' },
          { label: 'Engagement Rate', value: `${analytics.overview?.engagementRate || 0}%`, icon: FiBarChart3, color: 'from-purple-400 to-indigo-500' }
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
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Posts */}
      <div className="bg-gray-800 rounded-2xl border border-gray-600">
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Posts</h2>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Create Post
            </button>
          </div>
        </div>
        <div className="p-6">
          {posts.slice(0, 3).map((post) => (
            <div key={post.id} className="flex space-x-4 p-4 border border-gray-600 rounded-lg mb-4 last:mb-0">
              {post.mediaUrl && (
                <img src={post.mediaUrl} alt="Post media" className="w-16 h-16 rounded-lg object-cover" />
              )}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {post.platforms.map((platform) => (
                    <span key={platform} className="text-xs">{getPlatformIcon(platform)}</span>
                  ))}
                  <span className={`px-2 py-1 rounded-full text-xs ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {post.status}
                  </span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">{post.content}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                  <span>👍 {post.performance.likes}</span>
                  <span>💬 {post.performance.comments}</span>
                  <span>🔄 {post.performance.shares}</span>
                  <span>👁️ {post.performance.reach}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderPosts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Content Calendar</h2>
        <div className="flex space-x-4">
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
          >
            <option value="all">All Platforms</option>
            {Object.values(SOCIAL_PLATFORMS).map((platform) => (
              <option key={platform} value={platform} className="capitalize">{platform}</option>
            ))}
          </select>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Schedule Post
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts
          .filter(post => selectedPlatform === 'all' || post.platforms.includes(selectedPlatform))
          .map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-xl p-6 border border-gray-600"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-1">
                  {post.platforms.map((platform) => (
                    <span key={platform} className="text-lg">{getPlatformIcon(platform)}</span>
                  ))}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  post.status === 'published' ? 'bg-green-500/20 text-green-400' :
                  post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {post.status}
                </span>
              </div>

              {post.mediaUrl && (
                <img src={post.mediaUrl} alt="Post media" className="w-full h-32 rounded-lg object-cover mb-4" />
              )}

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.content}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {post.hashtags?.map((tag, index) => (
                  <span key={index} className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">{tag}</span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>{format(new Date(post.scheduledFor), 'MMM d, h:mm a')}</span>
                <span className="capitalize">{post.type.replace('_', ' ')}</span>
              </div>

              {post.status === 'published' && (
                <div className="grid grid-cols-4 gap-2 text-center text-xs text-gray-400">
                  <div>
                    <SafeIcon icon={FiHeart} className="w-4 h-4 mx-auto mb-1" />
                    <span>{post.performance.likes}</span>
                  </div>
                  <div>
                    <SafeIcon icon={FiMessageCircle} className="w-4 h-4 mx-auto mb-1" />
                    <span>{post.performance.comments}</span>
                  </div>
                  <div>
                    <SafeIcon icon={FiShare2} className="w-4 h-4 mx-auto mb-1" />
                    <span>{post.performance.shares}</span>
                  </div>
                  <div>
                    <SafeIcon icon={FiEye} className="w-4 h-4 mx-auto mb-1" />
                    <span>{post.performance.reach}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-xs">
                  <SafeIcon icon={FiEdit} className="w-3 h-3 mr-1 inline" />
                  Edit
                </button>
                <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-xs">
                  <SafeIcon icon={FiEye} className="w-3 h-3 mr-1 inline" />
                  View
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Social Media Analytics</h2>
      
      {/* Platform Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(analytics.platformBreakdown || {}).map(([platform, data]) => (
          <motion.div
            key={platform}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getPlatformIcon(platform)}</span>
                <h3 className="text-lg font-semibold text-white capitalize">{platform}</h3>
              </div>
              <span className="text-sm text-gray-400">{data.followers} followers</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Reach</p>
                <p className="text-lg font-semibold text-white">{data.reach?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Engagement</p>
                <p className="text-lg font-semibold text-white">{data.engagement?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Clicks</p>
                <p className="text-lg font-semibold text-white">{data.clicks?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Conversions</p>
                <p className="text-lg font-semibold text-white">{data.conversions}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trending Content */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
        <h3 className="text-xl font-bold text-white mb-4">Trending Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">Top Hashtags</h4>
            <div className="space-y-2">
              {analytics.trending?.topHashtags?.map((tag, index) => (
                <span key={index} className="block bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Best Platform</h4>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getPlatformIcon(analytics.trending?.bestPerformingPlatform)}</span>
              <span className="text-white capitalize">{analytics.trending?.bestPerformingPlatform}</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Optimal Posting Times</h4>
            <div className="space-y-1 text-sm text-gray-300">
              {Object.entries(analytics.trending?.optimalPostingTimes || {}).map(([platform, time]) => (
                <div key={platform} className="flex justify-between">
                  <span className="capitalize">{platform}:</span>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'posts', label: 'Posts & Calendar', icon: FiCalendar },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
    { id: 'campaigns', label: 'Campaigns', icon: FiUsers }
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
            <h1 className="text-2xl font-bold text-white mb-2">Social Media Marketing Hub</h1>
            <p className="text-gray-400">Manage all your social media marketing from one place</p>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center">
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Connect Platform
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
        {activeTab === 'posts' && renderPosts()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'campaigns' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Campaign Management</h3>
            <p className="text-gray-400">Advanced campaign management features coming soon...</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default SocialMediaHub