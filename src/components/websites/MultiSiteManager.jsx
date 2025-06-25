import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import websiteService from '../../lib/websites'

const { FiGlobe, FiPlus, FiEdit, FiTrash2, FiEye, FiCopy, FiZap, FiTrendingUp, FiUsers, FiMonitor, FiSmartphone, FiActivity } = FiIcons

const MultiSiteManager = () => {
  const [activeTab, setActiveTab] = useState('websites')
  const [websites, setWebsites] = useState([])
  const [funnels, setFunnels] = useState([])
  const [microsites, setMicrosites] = useState([])
  const [showCreateSite, setShowCreateSite] = useState(false)
  const [selectedType, setSelectedType] = useState('website')

  useEffect(() => {
    loadWebsiteData()
  }, [])

  const loadWebsiteData = () => {
    setWebsites(websiteService.getWebsites())
    setFunnels(websiteService.getFunnels())
    setMicrosites(websiteService.getMicrosites())
  }

  const handleCreateSite = async (siteData) => {
    try {
      let newSite
      if (selectedType === 'website') {
        newSite = await websiteService.createWebsite(siteData)
        setWebsites(prev => [newSite, ...prev])
      } else if (selectedType === 'funnel') {
        newSite = await websiteService.createFunnel(siteData)
        setFunnels(prev => [newSite, ...prev])
      } else {
        newSite = await websiteService.createMicrosite(siteData)
        setMicrosites(prev => [newSite, ...prev])
      }
      setShowCreateSite(false)
      toast.success(`${selectedType} created successfully!`)
    } catch (error) {
      toast.error(`Failed to create ${selectedType}`)
    }
  }

  const handleDeploySite = async (siteId, type) => {
    try {
      await websiteService.deploySite(siteId, type)
      toast.success('Site deployed successfully!')
      loadWebsiteData()
    } catch (error) {
      toast.error('Failed to deploy site')
    }
  }

  const SiteForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      template: '',
      domain: '',
      mobileOptimized: true,
      seoOptimized: true,
      fastLoading: true
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave({ ...formData, type: selectedType })
    }

    const templates = {
      website: [
        { id: 'business', name: 'Business Professional', preview: 'Clean business template' },
        { id: 'ecommerce', name: 'E-commerce Store', preview: 'Online store template' },
        { id: 'portfolio', name: 'Creative Portfolio', preview: 'Showcase portfolio' },
        { id: 'agency', name: 'Digital Agency', preview: 'Marketing agency template' }
      ],
      funnel: [
        { id: 'lead-gen', name: 'Lead Generation', preview: 'High-converting lead funnel' },
        { id: 'sales', name: 'Sales Funnel', preview: 'Product sales funnel' },
        { id: 'webinar', name: 'Webinar Funnel', preview: 'Webinar registration funnel' },
        { id: 'squeeze', name: 'Squeeze Page', preview: 'Email capture page' }
      ],
      microsite: [
        { id: 'landing', name: 'Landing Page', preview: 'Single page landing' },
        { id: 'event', name: 'Event Page', preview: 'Event promotion page' },
        { id: 'product', name: 'Product Launch', preview: 'Product showcase page' },
        { id: 'campaign', name: 'Campaign Page', preview: 'Marketing campaign page' }
      ]
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">
            Create New {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['website', 'funnel', 'microsite'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-cyan-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Domain</label>
                <input
                  type="text"
                  value={formData.domain}
                  onChange={(e) => setFormData(prev => ({ ...prev, domain: e.target.value }))}
                  placeholder="your-domain.com"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Describe the purpose of this site..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Choose Template</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templates[selectedType]?.map((template) => (
                  <label key={template.id} className="cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`p-4 border-2 rounded-lg transition-all ${
                      formData.template === template.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}>
                      <h4 className="font-medium text-white">{template.name}</h4>
                      <p className="text-gray-400 text-sm">{template.preview}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Optimization Features</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.mobileOptimized}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobileOptimized: e.target.checked }))}
                    className="mr-3"
                  />
                  <SafeIcon icon={FiSmartphone} className="w-4 h-4 mr-2 text-cyan-400" />
                  <span className="text-gray-300">Mobile Optimized</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.seoOptimized}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoOptimized: e.target.checked }))}
                    className="mr-3"
                  />
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-2 text-green-400" />
                  <span className="text-gray-300">SEO Optimized</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.fastLoading}
                    onChange={(e) => setFormData(prev => ({ ...prev, fastLoading: e.target.checked }))}
                    className="mr-3"
                  />
                  <SafeIcon icon={FiZap} className="w-4 h-4 mr-2 text-yellow-400" />
                  <span className="text-gray-300">Fast Loading</span>
                </label>
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
                className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Create {selectedType}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const SiteCard = ({ site, type, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-white">{site.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              site.status === 'live' ? 'bg-green-500/20 text-green-400' :
              site.status === 'deploying' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              {site.status}
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-2">{site.description}</p>
          <div className="flex items-center space-x-3 text-xs">
            <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
              {site.template}
            </span>
            {site.domain && (
              <span className="text-gray-400">{site.domain}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
        <div>
          <p className="text-white font-medium">{site.analytics.visitors}</p>
          <p className="text-gray-400 text-xs">Visitors</p>
        </div>
        <div>
          <p className="text-white font-medium">{site.analytics.conversions}</p>
          <p className="text-gray-400 text-xs">Conversions</p>
        </div>
        <div>
          <p className="text-white font-medium">{site.analytics.speed}s</p>
          <p className="text-gray-400 text-xs">Load Time</p>
        </div>
      </div>

      <div className="flex items-center space-x-1 mb-4">
        {site.mobileOptimized && (
          <SafeIcon icon={FiSmartphone} className="w-4 h-4 text-cyan-400" title="Mobile Optimized" />
        )}
        {site.seoOptimized && (
          <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-400" title="SEO Optimized" />
        )}
        {site.fastLoading && (
          <SafeIcon icon={FiZap} className="w-4 h-4 text-yellow-400" title="Fast Loading" />
        )}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => handleDeploySite(site.id, type)}
          className="flex-1 bg-cyan-500 text-white py-2 px-3 rounded-lg hover:bg-cyan-600 transition-colors text-sm"
        >
          {site.status === 'live' ? 'Redeploy' : 'Deploy'}
        </button>
        <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
          <SafeIcon icon={FiEye} className="w-4 h-4" />
        </button>
        <button className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm">
          <SafeIcon icon={FiEdit} className="w-4 h-4" />
        </button>
        <button className="bg-purple-500 text-white py-2 px-3 rounded-lg hover:bg-purple-600 transition-colors text-sm">
          <SafeIcon icon={FiCopy} className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )

  const renderWebsites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Websites</h2>
        <button
          onClick={() => {
            setSelectedType('website')
            setShowCreateSite(true)
          }}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Website
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {websites.map((website, index) => (
          <SiteCard key={website.id} site={website} type="website" index={index} />
        ))}
      </div>
    </div>
  )

  const renderFunnels = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Sales Funnels</h2>
        <button
          onClick={() => {
            setSelectedType('funnel')
            setShowCreateSite(true)
          }}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Funnel
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {funnels.map((funnel, index) => (
          <SiteCard key={funnel.id} site={funnel} type="funnel" index={index} />
        ))}
      </div>
    </div>
  )

  const renderMicrosites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Microsites</h2>
        <button
          onClick={() => {
            setSelectedType('microsite')
            setShowCreateSite(true)
          }}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Microsite
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {microsites.map((microsite, index) => (
          <SiteCard key={microsite.id} site={microsite} type="microsite" index={index} />
        ))}
      </div>
    </div>
  )

  const tabs = [
    { id: 'websites', label: 'Websites', icon: FiGlobe, count: websites.length },
    { id: 'funnels', label: 'Funnels', icon: FiTrendingUp, count: funnels.length },
    { id: 'microsites', label: 'Microsites', icon: FiZap, count: microsites.length },
    { id: 'analytics', label: 'Analytics', icon: FiActivity, count: null }
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
            <h1 className="text-2xl font-bold text-white mb-2">Multi-Site Manager</h1>
            <p className="text-gray-400">Deploy websites, funnels, and microsites for rapid scaling</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Quick Deploy
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Import Template
            </button>
          </div>
        </div>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: 'Total Sites', value: websites.length + funnels.length + microsites.length, icon: FiGlobe, color: 'from-blue-400 to-cyan-500' },
          { label: 'Live Sites', value: [...websites, ...funnels, ...microsites].filter(s => s.status === 'live').length, icon: FiActivity, color: 'from-green-400 to-emerald-500' },
          { label: 'Total Visitors', value: '47.2k', icon: FiUsers, color: 'from-purple-400 to-indigo-500' },
          { label: 'Avg Load Time', value: '1.2s', icon: FiZap, color: 'from-orange-400 to-red-500' }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
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
            {tab.count !== null && (
              <span className="bg-white/20 text-xs px-2 py-1 rounded-full">{tab.count}</span>
            )}
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
        {activeTab === 'websites' && renderWebsites()}
        {activeTab === 'funnels' && renderFunnels()}
        {activeTab === 'microsites' && renderMicrosites()}
        {activeTab === 'analytics' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Site Analytics</h3>
            <p className="text-gray-400">Comprehensive analytics dashboard coming soon...</p>
          </div>
        )}
      </motion.div>

      {/* Create Site Modal */}
      {showCreateSite && (
        <SiteForm
          onSave={handleCreateSite}
          onCancel={() => setShowCreateSite(false)}
        />
      )}
    </div>
  )
}

export default MultiSiteManager