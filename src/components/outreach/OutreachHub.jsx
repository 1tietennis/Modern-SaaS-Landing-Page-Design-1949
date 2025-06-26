import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import outreachService from '../../lib/outreach'

const { FiSend, FiUsers, FiMail, FiLinkedin, FiPlay, FiPause, FiEdit, FiEye, FiTrendingUp, FiTarget, FiClock, FiPlus, FiFilter, FiDownload, FiMessageSquare, FiUserPlus, FiBarChart3, FiSettings } = FiIcons

const OutreachHub = () => {
  const [activeTab, setActiveTab] = useState('prospects')
  const [prospects, setProspects] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [sequences, setSequences] = useState([])
  const [analytics, setAnalytics] = useState({})
  const [showCreateCampaign, setShowCreateCampaign] = useState(false)
  const [selectedProspects, setSelectedProspects] = useState([])
  const [filters, setFilters] = useState({ status: 'all', channel: 'all', score: 'all' })

  useEffect(() => {
    loadOutreachData()
  }, [])

  const loadOutreachData = async () => {
    try {
      setProspects(await outreachService.getProspects())
      setCampaigns(await outreachService.getCampaigns())
      setSequences(await outreachService.getSequences())
      setAnalytics(await outreachService.getAnalytics())
    } catch (error) {
      console.error('Error loading outreach data:', error)
    }
  }

  const handleCreateCampaign = async (campaignData) => {
    try {
      await outreachService.createCampaign(campaignData)
      await loadOutreachData()
      setShowCreateCampaign(false)
      toast.success('Campaign created successfully!')
    } catch (error) {
      toast.error('Failed to create campaign')
    }
  }

  const handleStartSequence = async (prospectId, sequenceId) => {
    try {
      await outreachService.startSequence(prospectId, sequenceId)
      await loadOutreachData()
      toast.success('Sequence started successfully!')
    } catch (error) {
      toast.error('Failed to start sequence')
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getStatusColor = (status) => {
    const colors = {
      'new': 'bg-blue-500/20 text-blue-400',
      'contacted': 'bg-yellow-500/20 text-yellow-400',
      'responded': 'bg-green-500/20 text-green-400',
      'qualified': 'bg-purple-500/20 text-purple-400',
      'closed': 'bg-gray-500/20 text-gray-400'
    }
    return colors[status] || colors['new']
  }

  const CampaignForm = ({ onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      channels: [],
      sequence_id: '',
      target_criteria: {
        industries: [],
        company_size: '',
        job_titles: [],
        locations: []
      },
      personalization: {
        use_company_name: true,
        use_job_title: true,
        use_recent_activity: true,
        custom_variables: []
      }
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
        <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-600">
            <h3 className="text-xl font-bold text-white">Create Outreach Campaign</h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Sequence</label>
                <select
                  value={formData.sequence_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, sequence_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Sequence</option>
                  {sequences.map(seq => (
                    <option key={seq.id} value={seq.id}>{seq.name}</option>
                  ))}
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Outreach Channels</label>
              <div className="space-y-2">
                {[
                  { id: 'email', label: 'Email', icon: FiMail },
                  { id: 'linkedin', label: 'LinkedIn', icon: FiLinkedin }
                ].map(channel => (
                  <label key={channel.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.channels.includes(channel.id)}
                      onChange={(e) => {
                        const channels = e.target.checked
                          ? [...formData.channels, channel.id]
                          : formData.channels.filter(c => c !== channel.id)
                        setFormData(prev => ({ ...prev, channels }))
                      }}
                      className="mr-3"
                    />
                    <SafeIcon icon={channel.icon} className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-300">{channel.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Industries</label>
                <input
                  type="text"
                  placeholder="Technology, Healthcare, Finance"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company Size</label>
                <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Any Size</option>
                  <option value="startup">Startup (1-50)</option>
                  <option value="growth">Growth (51-200)</option>
                  <option value="enterprise">Enterprise (200+)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Personalization Options</label>
              <div className="space-y-2">
                {[
                  { key: 'use_company_name', label: 'Use Company Name' },
                  { key: 'use_job_title', label: 'Use Job Title' },
                  { key: 'use_recent_activity', label: 'Reference Recent Activity' }
                ].map(option => (
                  <label key={option.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.personalization[option.key]}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        personalization: {
                          ...prev.personalization,
                          [option.key]: e.target.checked
                        }
                      }))}
                      className="mr-3"
                    />
                    <span className="text-gray-300">{option.label}</span>
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
                Create Campaign
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const renderProspects = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Prospect Database</h2>
        <div className="flex space-x-3">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center">
            <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
            Import
          </button>
          <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
            <SafeIcon icon={FiUserPlus} className="w-4 h-4 mr-2" />
            Add Prospect
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <SafeIcon icon={FiFilter} className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300 text-sm">Filters:</span>
          </div>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="responded">Responded</option>
            <option value="qualified">Qualified</option>
          </select>

          <select
            value={filters.channel}
            onChange={(e) => setFilters(prev => ({ ...prev, channel: e.target.value }))}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
          >
            <option value="all">All Channels</option>
            <option value="email">Email</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          <select
            value={filters.score}
            onChange={(e) => setFilters(prev => ({ ...prev, score: e.target.value }))}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm"
          >
            <option value="all">All Scores</option>
            <option value="high">High (80+)</option>
            <option value="medium">Medium (60-79)</option>
            <option value="low">Low (<60)</option>
          </select>
        </div>
      </div>

      {/* Prospects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {prospects.map((prospect, index) => (
          <motion.div
            key={prospect.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {prospect.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{prospect.name}</h3>
                  <p className="text-gray-400 text-sm">{prospect.title}</p>
                  <p className="text-gray-500 text-xs">{prospect.company}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-semibold ${getScoreColor(prospect.lead_score)}`}>
                  {prospect.lead_score}
                </span>
                <p className="text-gray-500 text-xs">Score</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(prospect.status)}`}>
                  {prospect.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Last Contact:</span>
                <span className="text-gray-300">
                  {prospect.last_contact ? format(new Date(prospect.last_contact), 'MMM d') : 'Never'}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Industry:</span>
                <span className="text-gray-300">{prospect.industry}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {prospect.email && (
                <div className="flex items-center bg-gray-600 px-2 py-1 rounded text-xs">
                  <SafeIcon icon={FiMail} className="w-3 h-3 mr-1 text-blue-400" />
                  <span className="text-gray-300">Email</span>
                </div>
              )}
              {prospect.linkedin_url && (
                <div className="flex items-center bg-gray-600 px-2 py-1 rounded text-xs">
                  <SafeIcon icon={FiLinkedin} className="w-3 h-3 mr-1 text-blue-500" />
                  <span className="text-gray-300">LinkedIn</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleStartSequence(prospect.id, sequences[0]?.id)}
                className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                <SafeIcon icon={FiSend} className="w-4 h-4 mr-1 inline" />
                Start Sequence
              </button>
              <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiEye} className="w-4 h-4" />
              </button>
              <button className="bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                <SafeIcon icon={FiLinkedin} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderCampaigns = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Outreach Campaigns</h2>
        <button
          onClick={() => setShowCreateCampaign(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map((campaign, index) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{campaign.name}</h3>
                <p className="text-gray-400 text-sm">{campaign.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  campaign.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                }`}>
                  {campaign.status}
                </span>
                <button className="p-1 text-gray-400 hover:text-white">
                  <SafeIcon icon={campaign.status === 'active' ? FiPause : FiPlay} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-400 text-xs">Total Prospects</p>
                <p className="text-white font-semibold">{campaign.total_prospects}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Response Rate</p>
                <p className="text-white font-semibold">{campaign.response_rate}%</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Sent</p>
                <p className="text-white font-semibold">{campaign.messages_sent}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Replies</p>
                <p className="text-white font-semibold">{campaign.replies}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              {campaign.channels.map(channel => (
                <div key={channel} className="flex items-center bg-gray-600 px-2 py-1 rounded text-xs">
                  <SafeIcon 
                    icon={channel === 'email' ? FiMail : FiLinkedin} 
                    className={`w-3 h-3 mr-1 ${channel === 'email' ? 'text-blue-400' : 'text-blue-500'}`} 
                  />
                  <span className="text-gray-300 capitalize">{channel}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiEdit} className="w-4 h-4 mr-1 inline" />
                Edit
              </button>
              <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                <SafeIcon icon={FiBarChart3} className="w-4 h-4 mr-1 inline" />
                Analytics
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderSequences = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Message Sequences</h2>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sequences.map((sequence, index) => (
          <motion.div
            key={sequence.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{sequence.name}</h3>
                <p className="text-gray-400 text-sm">{sequence.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-400 text-sm">{sequence.steps.length} steps</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {sequence.steps.slice(0, 3).map((step, stepIndex) => (
                <div key={stepIndex} className="flex items-start space-x-3 p-3 bg-gray-600 rounded-lg">
                  <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                    {stepIndex + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <SafeIcon 
                        icon={step.channel === 'email' ? FiMail : FiLinkedin} 
                        className={`w-4 h-4 ${step.channel === 'email' ? 'text-blue-400' : 'text-blue-500'}`} 
                      />
                      <span className="text-white text-sm font-medium">{step.type}</span>
                      <span className="text-gray-400 text-xs">
                        Day {step.delay_days}
                      </span>
                    </div>
                    <p className="text-gray-300 text-xs line-clamp-2">{step.content.substring(0, 80)}...</p>
                  </div>
                </div>
              ))}
              {sequence.steps.length > 3 && (
                <div className="text-center text-gray-400 text-sm">
                  +{sequence.steps.length - 3} more steps
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
              <div>
                <p className="text-white font-semibold">{sequence.active_prospects}</p>
                <p className="text-gray-400 text-xs">Active</p>
              </div>
              <div>
                <p className="text-white font-semibold">{sequence.completion_rate}%</p>
                <p className="text-gray-400 text-xs">Complete</p>
              </div>
              <div>
                <p className="text-white font-semibold">{sequence.response_rate}%</p>
                <p className="text-gray-400 text-xs">Response</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiEdit} className="w-4 h-4 mr-1 inline" />
                Edit
              </button>
              <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                <SafeIcon icon={FiPlay} className="w-4 h-4 mr-1 inline" />
                Use
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Outreach Analytics</h2>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Prospects', value: analytics.total_prospects || 0, icon: FiUsers, color: 'from-blue-400 to-cyan-500' },
          { label: 'Messages Sent', value: analytics.messages_sent || 0, icon: FiSend, color: 'from-green-400 to-emerald-500' },
          { label: 'Response Rate', value: `${analytics.response_rate || 0}%`, icon: FiTrendingUp, color: 'from-purple-400 to-indigo-500' },
          { label: 'Qualified Leads', value: analytics.qualified_leads || 0, icon: FiTarget, color: 'from-orange-400 to-red-500' }
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

      {/* Performance by Channel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Channel</h3>
          <div className="space-y-4">
            {[
              { channel: 'Email', sent: 1250, responses: 89, rate: 7.1 },
              { channel: 'LinkedIn', sent: 840, responses: 76, rate: 9.0 }
            ].map((channel, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <SafeIcon 
                      icon={channel.channel === 'Email' ? FiMail : FiLinkedin} 
                      className={`w-5 h-5 ${channel.channel === 'Email' ? 'text-blue-400' : 'text-blue-500'}`} 
                    />
                    <span className="font-medium text-white">{channel.channel}</span>
                  </div>
                  <span className="text-green-400 font-semibold">{channel.rate}%</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Sent:</span>
                    <span className="text-white ml-2">{channel.sent}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Responses:</span>
                    <span className="text-white ml-2">{channel.responses}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Sequences</h3>
          <div className="space-y-3">
            {sequences.slice(0, 4).map((sequence, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium text-white text-sm">{sequence.name}</p>
                  <p className="text-gray-400 text-xs">{sequence.active_prospects} active prospects</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">{sequence.response_rate}%</p>
                  <p className="text-gray-400 text-xs">response rate</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'prospects', label: 'Prospects', icon: FiUsers },
    { id: 'campaigns', label: 'Campaigns', icon: FiSend },
    { id: 'sequences', label: 'Sequences', icon: FiMessageSquare },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart3 }
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
            <h1 className="text-2xl font-bold text-white mb-2">B2B Outreach Hub</h1>
            <p className="text-gray-400">Automate personalized outreach across email and LinkedIn</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              <SafeIcon icon={FiLinkedin} className="w-4 h-4 mr-2 inline" />
              Connect LinkedIn
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <SafeIcon icon={FiMail} className="w-4 h-4 mr-2 inline" />
              Connect Email
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
        {activeTab === 'prospects' && renderProspects()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'sequences' && renderSequences()}
        {activeTab === 'analytics' && renderAnalytics()}
      </motion.div>

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateCampaign && (
          <CampaignForm
            onSave={handleCreateCampaign}
            onCancel={() => setShowCreateCampaign(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default OutreachHub