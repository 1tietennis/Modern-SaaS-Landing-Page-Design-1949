import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import automationService from '../../lib/automation'

const { FiZap, FiPlus, FiEdit, FiTrash2, FiPlay, FiPause, FiMail, FiMessageSquare, FiClock, FiUsers, FiTrendingUp, FiSettings, FiCopy } = FiIcons

const AutomationHub = () => {
  const [activeTab, setActiveTab] = useState('workflows')
  const [workflows, setWorkflows] = useState([])
  const [templates, setTemplates] = useState([])
  const [responses, setResponses] = useState([])
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false)
  const [editingWorkflow, setEditingWorkflow] = useState(null)

  useEffect(() => {
    loadAutomationData()
  }, [])

  const loadAutomationData = () => {
    setWorkflows(automationService.getWorkflows())
    setTemplates(automationService.getTemplates())
    setResponses(automationService.getResponses())
  }

  const handleCreateWorkflow = async (workflowData) => {
    try {
      const newWorkflow = await automationService.createWorkflow(workflowData)
      setWorkflows(prev => [newWorkflow, ...prev])
      setShowCreateWorkflow(false)
      toast.success('Automation workflow created successfully!')
    } catch (error) {
      toast.error('Failed to create workflow')
    }
  }

  const handleToggleWorkflow = async (workflowId, active) => {
    try {
      const updatedWorkflow = await automationService.toggleWorkflow(workflowId, active)
      setWorkflows(prev => prev.map(w => w.id === workflowId ? updatedWorkflow : w))
      toast.success(active ? 'Workflow activated!' : 'Workflow paused!')
    } catch (error) {
      toast.error('Failed to update workflow')
    }
  }

  const WorkflowForm = ({ workflow, onSave, onCancel }) => {
    const [formData, setFormData] = useState(workflow || {
      name: '',
      description: '',
      trigger: 'new_lead',
      conditions: [],
      actions: [],
      delay: 0,
      active: false
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
            {workflow ? 'Edit Workflow' : 'Create New Workflow'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Workflow Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Trigger Event *</label>
                <select
                  value={formData.trigger}
                  onChange={(e) => setFormData(prev => ({ ...prev, trigger: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="new_lead">New Lead</option>
                  <option value="form_submission">Form Submission</option>
                  <option value="email_opened">Email Opened</option>
                  <option value="link_clicked">Link Clicked</option>
                  <option value="page_visited">Page Visited</option>
                  <option value="time_delay">Time Delay</option>
                  <option value="tag_added">Tag Added</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Describe what this workflow does..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Delay (minutes)</label>
              <input
                type="number"
                min="0"
                value={formData.delay}
                onChange={(e) => setFormData(prev => ({ ...prev, delay: Number(e.target.value) }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="0 for immediate execution"
              />
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-3">Actions</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-300">Send Welcome Email</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-300">Send SMS Notification</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-300">Add to CRM</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-300">Assign to Sales Rep</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-gray-300">Create Follow-up Task</span>
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
                {workflow ? 'Update' : 'Create'} Workflow
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const renderWorkflows = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Automation Workflows</h2>
        <button
          onClick={() => setShowCreateWorkflow(true)}
          className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {workflows.map((workflow, index) => (
          <motion.div
            key={workflow.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{workflow.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{workflow.description}</p>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                    {workflow.trigger.replace('_', ' ')}
                  </span>
                  <span className="text-gray-400">
                    {workflow.delay > 0 ? `${workflow.delay}min delay` : 'Immediate'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleToggleWorkflow(workflow.id, !workflow.active)}
                className={`p-2 rounded-lg transition-colors ${
                  workflow.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-600 text-gray-400'
                }`}
              >
                <SafeIcon icon={workflow.active ? FiPause : FiPlay} className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-sm mb-4">
              <div>
                <p className="text-white font-medium">{workflow.stats.triggered}</p>
                <p className="text-gray-400 text-xs">Triggered</p>
              </div>
              <div>
                <p className="text-white font-medium">{workflow.stats.completed}</p>
                <p className="text-gray-400 text-xs">Completed</p>
              </div>
              <div>
                <p className="text-white font-medium">{workflow.stats.conversionRate}%</p>
                <p className="text-gray-400 text-xs">Success Rate</p>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setEditingWorkflow(workflow)}
                className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4 mx-auto" />
              </button>
              <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                <SafeIcon icon={FiCopy} className="w-4 h-4 mx-auto" />
              </button>
              <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-500 transition-colors text-sm">
                <SafeIcon icon={FiTrash2} className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderResponses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Automated Responses</h2>
        <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center">
          <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
          Create Response
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Templates */}
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiMail} className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Email Templates</h3>
          </div>
          <div className="space-y-3">
            {templates.filter(t => t.type === 'email').map((template, index) => (
              <div key={index} className="bg-gray-600 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white text-sm">{template.name}</h4>
                  <button className="text-gray-400 hover:text-white">
                    <SafeIcon icon={FiEdit} className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-gray-300 text-xs line-clamp-2">{template.preview}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">Used {template.usage} times</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    template.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {template.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Templates */}
        <div className="bg-gray-700 rounded-xl p-6 border border-gray-600">
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-green-400" />
            <h3 className="text-lg font-semibold text-white">SMS Templates</h3>
          </div>
          <div className="space-y-3">
            {templates.filter(t => t.type === 'sms').map((template, index) => (
              <div key={index} className="bg-gray-600 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-white text-sm">{template.name}</h4>
                  <button className="text-gray-400 hover:text-white">
                    <SafeIcon icon={FiEdit} className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-gray-300 text-xs line-clamp-2">{template.preview}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-gray-400">Used {template.usage} times</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    template.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {template.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-Response Settings */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Auto-Response Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-gray-300">Auto-reply to emails</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" defaultChecked />
              <span className="text-gray-300">Auto-reply to SMS</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-3" />
              <span className="text-gray-300">Weekend auto-replies</span>
            </label>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Response Delay</label>
              <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white text-sm">
                <option>Immediate</option>
                <option>1 minute</option>
                <option>5 minutes</option>
                <option>15 minutes</option>
                <option>30 minutes</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Business Hours</label>
              <div className="text-sm text-gray-400">
                <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                <p>Sat: 10:00 AM - 4:00 PM</p>
                <p>Sun: Closed</p>
                <button className="text-cyan-400 hover:text-cyan-300 mt-1">Edit Hours</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Automation Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Workflows', value: workflows.length, icon: FiZap, color: 'from-blue-400 to-cyan-500' },
          { label: 'Active Workflows', value: workflows.filter(w => w.active).length, icon: FiPlay, color: 'from-green-400 to-emerald-500' },
          { label: 'Emails Sent', value: '2,847', icon: FiMail, color: 'from-purple-400 to-indigo-500' },
          { label: 'SMS Sent', value: '1,293', icon: FiMessageSquare, color: 'from-orange-400 to-red-500' }
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

      {/* Performance Chart */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-4">Workflow Performance</h3>
        <div className="h-64 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <SafeIcon icon={FiTrendingUp} className="w-12 h-12 mx-auto mb-2" />
            <p>Analytics chart will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'workflows', label: 'Workflows', icon: FiZap },
    { id: 'responses', label: 'Auto-Responses', icon: FiMessageSquare },
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
            <h1 className="text-2xl font-bold text-white mb-2">Automation Hub</h1>
            <p className="text-gray-400">Streamline your marketing with intelligent automation workflows</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              Import Templates
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Quick Setup
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
        {activeTab === 'workflows' && renderWorkflows()}
        {activeTab === 'responses' && renderResponses()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Automation Settings</h3>
            <p className="text-gray-400">Advanced automation configuration coming soon...</p>
          </div>
        )}
      </motion.div>

      {/* Create Workflow Modal */}
      {showCreateWorkflow && (
        <WorkflowForm
          onSave={handleCreateWorkflow}
          onCancel={() => setShowCreateWorkflow(false)}
        />
      )}

      {/* Edit Workflow Modal */}
      {editingWorkflow && (
        <WorkflowForm
          workflow={editingWorkflow}
          onSave={(updates) => {
            automationService.updateWorkflow(editingWorkflow.id, updates)
            loadAutomationData()
            setEditingWorkflow(null)
            toast.success('Workflow updated successfully!')
          }}
          onCancel={() => setEditingWorkflow(null)}
        />
      )}
    </div>
  )
}

export default AutomationHub