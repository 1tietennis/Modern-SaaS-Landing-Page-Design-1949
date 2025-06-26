import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import proposalService from '../../lib/proposals'

const { FiFileText, FiPlus, FiEdit, FiCopy, FiSend, FiEye, FiDownload, FiDollarSign, FiCalendar, FiUser, FiCheck, FiX, FiClock } = FiIcons

const ProposalManager = () => {
  const [activeTab, setActiveTab] = useState('proposals')
  const [proposals, setProposals] = useState([])
  const [templates, setTemplates] = useState([])
  const [showCreateProposal, setShowCreateProposal] = useState(false)
  const [editingProposal, setEditingProposal] = useState(null)

  useEffect(() => {
    loadProposals()
  }, [])

  const loadProposals = async () => {
    try {
      setProposals(await proposalService.getAllProposals())
      setTemplates(await proposalService.getTemplates())
    } catch (error) {
      console.error('Error loading proposals:', error)
    }
  }

  const handleCreateProposal = async (proposalData) => {
    try {
      await proposalService.createProposal(proposalData)
      await loadProposals()
      setShowCreateProposal(false)
      toast.success('Proposal created successfully!')
    } catch (error) {
      toast.error('Failed to create proposal')
    }
  }

  const handleSendProposal = async (proposalId) => {
    try {
      await proposalService.sendProposal(proposalId)
      await loadProposals()
      toast.success('Proposal sent to client!')
    } catch (error) {
      toast.error('Failed to send proposal')
    }
  }

  const ProposalForm = ({ proposal, onSave, onCancel }) => {
    const [formData, setFormData] = useState(proposal || {
      title: '',
      client_name: '',
      client_email: '',
      description: '',
      value: '',
      expires_at: '',
      template_id: '',
      sections: [
        { title: 'Project Overview', content: '', order: 1 },
        { title: 'Scope of Work', content: '', order: 2 },
        { title: 'Timeline', content: '', order: 3 },
        { title: 'Investment', content: '', order: 4 }
      ]
    })

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    const updateSection = (index, field, value) => {
      const newSections = [...formData.sections]
      newSections[index] = { ...newSections[index], [field]: value }
      setFormData(prev => ({ ...prev, sections: newSections }))
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-600">
            <h3 className="text-xl font-bold text-white">
              {proposal ? 'Edit Proposal' : 'Create New Proposal'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Proposal Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Template</label>
                <select
                  value={formData.template_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, template_id: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>{template.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.client_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client Email *</label>
                <input
                  type="email"
                  required
                  value={formData.client_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, client_email: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Proposal Value</label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Expires On</label>
                <input
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Brief description of the proposal..."
              />
            </div>

            {/* Proposal Sections */}
            <div>
              <h4 className="font-medium text-white mb-3">Proposal Sections</h4>
              <div className="space-y-4">
                {formData.sections.map((section, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <div className="mb-2">
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSection(index, 'title', e.target.value)}
                        className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Section title"
                      />
                    </div>
                    <textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Section content..."
                    />
                  </div>
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
                {proposal ? 'Update' : 'Create'} Proposal
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400'
      case 'sent': return 'bg-blue-500/20 text-blue-400'
      case 'viewed': return 'bg-yellow-500/20 text-yellow-400'
      case 'approved': return 'bg-green-500/20 text-green-400'
      case 'rejected': return 'bg-red-500/20 text-red-400'
      case 'expired': return 'bg-orange-500/20 text-orange-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const renderProposals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Proposals</h2>
        <button
          onClick={() => setShowCreateProposal(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Proposal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {proposals.map((proposal, index) => (
          <motion.div
            key={proposal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{proposal.title}</h3>
                <p className="text-gray-400 text-sm">{proposal.client_name}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(proposal.status)}`}>
                {proposal.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-300 text-sm">
                <SafeIcon icon={FiDollarSign} className="w-4 h-4 mr-2" />
                ${proposal.value?.toLocaleString() || '0'}
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                Created {format(new Date(proposal.created_at), 'MMM d, yyyy')}
              </div>
              {proposal.expires_at && (
                <div className="flex items-center text-gray-300 text-sm">
                  <SafeIcon icon={FiClock} className="w-4 h-4 mr-2" />
                  Expires {format(new Date(proposal.expires_at), 'MMM d, yyyy')}
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setEditingProposal(proposal)}
                className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4 mr-1 inline" />
                Edit
              </button>
              {proposal.status === 'draft' && (
                <button
                  onClick={() => handleSendProposal(proposal.id)}
                  className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  <SafeIcon icon={FiSend} className="w-4 h-4 mr-1 inline" />
                  Send
                </button>
              )}
              <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Proposal Templates</h2>
        <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Template
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                <p className="text-gray-400 text-sm">{template.category}</p>
              </div>
              <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full text-xs">
                Template
              </span>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-3">{template.description}</p>

            <div className="flex space-x-2">
              <button className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                <SafeIcon icon={FiEye} className="w-4 h-4 mr-1 inline" />
                Preview
              </button>
              <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiCopy} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const tabs = [
    { id: 'proposals', label: 'Proposals', icon: FiFileText },
    { id: 'templates', label: 'Templates', icon: FiCopy }
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
            <h1 className="text-2xl font-bold text-white mb-2">Proposal Manager</h1>
            <p className="text-gray-400">Create, manage, and track professional proposals</p>
          </div>
          <div className="flex space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{proposals.length}</p>
              <p className="text-gray-400 text-sm">Total Proposals</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{proposals.filter(p => p.status === 'approved').length}</p>
              <p className="text-gray-400 text-sm">Approved</p>
            </div>
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
        {activeTab === 'proposals' && renderProposals()}
        {activeTab === 'templates' && renderTemplates()}
      </motion.div>

      {/* Create/Edit Proposal Modal */}
      {(showCreateProposal || editingProposal) && (
        <ProposalForm
          proposal={editingProposal}
          onSave={editingProposal ? 
            (updates) => {
              proposalService.updateProposal(editingProposal.id, updates)
              loadProposals()
              setEditingProposal(null)
              toast.success('Proposal updated successfully!')
            } : 
            handleCreateProposal
          }
          onCancel={() => {
            setShowCreateProposal(false)
            setEditingProposal(null)
          }}
        />
      )}
    </div>
  )
}

export default ProposalManager