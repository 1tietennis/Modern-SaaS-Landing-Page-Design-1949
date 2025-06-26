import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import clientPortalService from '../../lib/clientPortal'

const { FiFileText, FiEdit, FiEye, FiDownload, FiSend, FiClock, FiCheck, FiX, FiMessageSquare, FiUser, FiCalendar, FiDollarSign, FiUpload, FiFolder, FiShare2 } = FiIcons

const ClientPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [proposals, setProposals] = useState([])
  const [contracts, setContracts] = useState([])
  const [documents, setDocuments] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)
  const [clientInfo, setClientInfo] = useState({})

  useEffect(() => {
    loadPortalData()
  }, [])

  const loadPortalData = async () => {
    try {
      setProposals(await clientPortalService.getProposals())
      setContracts(await clientPortalService.getContracts())
      setDocuments(await clientPortalService.getDocuments())
      setMessages(await clientPortalService.getMessages())
      setClientInfo(await clientPortalService.getClientInfo())
    } catch (error) {
      console.error('Error loading portal data:', error)
    }
  }

  const handleDocumentAction = async (documentId, action) => {
    try {
      await clientPortalService.updateDocumentStatus(documentId, action)
      await loadPortalData()
      toast.success(`Document ${action} successfully!`)
    } catch (error) {
      toast.error(`Failed to ${action} document`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400'
      case 'rejected': return 'bg-red-500/20 text-red-400'
      case 'draft': return 'bg-gray-500/20 text-gray-400'
      case 'sent': return 'bg-blue-500/20 text-blue-400'
      case 'signed': return 'bg-purple-500/20 text-purple-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const DocumentViewer = ({ document, onClose }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">{document.title}</h3>
              <p className="text-gray-400">{document.type} • {format(new Date(document.created_at), 'PPp')}</p>
            </div>
            <div className="flex space-x-2">
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2 inline" />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="bg-white rounded-lg p-8 text-gray-900">
            {/* Document Preview */}
            <div dangerouslySetInnerHTML={{ __html: document.content }} />
          </div>
        </div>

        {document.status === 'pending' && (
          <div className="p-6 border-t border-gray-600 bg-gray-700">
            <div className="flex space-x-4">
              <button
                onClick={() => handleDocumentAction(document.id, 'approved')}
                className="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                <SafeIcon icon={FiCheck} className="w-4 h-4 mr-2 inline" />
                Approve
              </button>
              <button
                onClick={() => handleDocumentAction(document.id, 'rejected')}
                className="flex-1 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-4 h-4 mr-2 inline" />
                Reject
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {clientInfo.name}!</h1>
            <p className="text-primary-100">Here's what's happening with your projects</p>
          </div>
          <div className="text-right">
            <p className="text-primary-100 text-sm">Account Manager</p>
            <p className="font-semibold">{clientInfo.accountManager}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: clientInfo.activeProjects || 3, icon: FiFolder, color: 'from-blue-400 to-cyan-500' },
          { label: 'Pending Approvals', value: proposals.filter(p => p.status === 'pending').length, icon: FiClock, color: 'from-yellow-400 to-orange-500' },
          { label: 'Completed Tasks', value: clientInfo.completedTasks || 28, icon: FiCheck, color: 'from-green-400 to-emerald-500' },
          { label: 'Total Investment', value: `$${clientInfo.totalInvestment?.toLocaleString() || '0'}`, icon: FiDollarSign, color: 'from-purple-400 to-pink-500' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-xl`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Recent Documents</h3>
          <div className="space-y-3">
            {documents.slice(0, 4).map((doc, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                <SafeIcon icon={FiFileText} className="w-5 h-5 text-primary-400" />
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{doc.title}</p>
                  <p className="text-gray-400 text-xs">{format(new Date(doc.created_at), 'MMM d, yyyy')}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(doc.status)}`}>
                  {doc.status}
                </span>
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
          <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {messages.slice(0, 4).map((message, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-700 rounded-lg">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <SafeIcon icon={FiUser} className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white text-sm">{message.sender}</p>
                  <p className="text-gray-300 text-sm line-clamp-2">{message.content}</p>
                  <p className="text-gray-500 text-xs mt-1">{format(new Date(message.created_at), 'MMM d, h:mm a')}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )

  const renderProposals = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Proposals</h2>
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
                <p className="text-gray-400 text-sm">{proposal.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(proposal.status)}`}>
                {proposal.status}
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Value:</span>
                <span className="text-white font-medium">${proposal.value?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Created:</span>
                <span className="text-gray-300">{format(new Date(proposal.created_at), 'MMM d, yyyy')}</span>
              </div>
              {proposal.expires_at && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Expires:</span>
                  <span className="text-gray-300">{format(new Date(proposal.expires_at), 'MMM d, yyyy')}</span>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedDocument(proposal)
                  setShowDocumentViewer(true)
                }}
                className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4 mr-1 inline" />
                View
              </button>
              <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderContracts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Contracts</h2>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-600">
        <div className="p-6 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Active Contracts</h3>
        </div>
        <div className="divide-y divide-gray-600">
          {contracts.map((contract, index) => (
            <motion.div
              key={contract.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-white">{contract.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Value:</span>
                      <p className="text-white font-medium">${contract.value?.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Start Date:</span>
                      <p className="text-gray-300">{format(new Date(contract.start_date), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">End Date:</span>
                      <p className="text-gray-300">{format(new Date(contract.end_date), 'MMM d, yyyy')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Progress:</span>
                      <p className="text-gray-300">{contract.progress}%</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setSelectedDocument(contract)
                      setShowDocumentViewer(true)
                    }}
                    className="bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors text-sm"
                  >
                    <SafeIcon icon={FiEye} className="w-4 h-4 mr-1 inline" />
                    View
                  </button>
                  <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                    <SafeIcon icon={FiDownload} className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Documents & Files</h2>
        <div className="flex space-x-3">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors flex items-center">
            <SafeIcon icon={FiUpload} className="w-4 h-4 mr-2" />
            Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {documents.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <SafeIcon icon={FiFileText} className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{document.title}</h3>
                  <p className="text-gray-400 text-xs">{document.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(document.status)}`}>
                {document.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="text-gray-300">{document.size || '1.2 MB'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Modified:</span>
                <span className="text-gray-300">{format(new Date(document.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setSelectedDocument(document)
                  setShowDocumentViewer(true)
                }}
                className="flex-1 bg-primary-500 text-white py-2 px-3 rounded-lg hover:bg-primary-600 transition-colors text-sm"
              >
                <SafeIcon icon={FiEye} className="w-4 h-4 mr-1 inline" />
                View
              </button>
              <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiDownload} className="w-4 h-4" />
              </button>
              <button className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                <SafeIcon icon={FiShare2} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Messages & Communication</h2>
      </div>

      <div className="bg-gray-800 rounded-2xl border border-gray-600 h-[600px] flex flex-col">
        <div className="p-6 border-b border-gray-600">
          <h3 className="text-lg font-semibold text-white">Project Communication</h3>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md p-4 rounded-lg ${
                  message.sender === 'You' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-gray-700 text-gray-100'
                }`}>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm">{message.sender}</span>
                    <span className="text-xs opacity-70">
                      {format(new Date(message.created_at), 'h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-gray-600">
          <div className="flex space-x-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              <SafeIcon icon={FiSend} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FiFolder },
    { id: 'proposals', label: 'Proposals', icon: FiFileText },
    { id: 'contracts', label: 'Contracts', icon: FiEdit },
    { id: 'documents', label: 'Documents', icon: FiUpload },
    { id: 'messages', label: 'Messages', icon: FiMessageSquare }
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
            <h1 className="text-2xl font-bold text-white mb-2">Client Portal</h1>
            <p className="text-gray-400">Manage proposals, contracts, and collaborate with your team</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-white font-medium">{clientInfo.name}</p>
              <p className="text-gray-400 text-sm">{clientInfo.company}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {clientInfo.name?.charAt(0) || 'C'}
              </span>
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
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'proposals' && renderProposals()}
        {activeTab === 'contracts' && renderContracts()}
        {activeTab === 'documents' && renderDocuments()}
        {activeTab === 'messages' && renderMessages()}
      </motion.div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {showDocumentViewer && selectedDocument && (
          <DocumentViewer
            document={selectedDocument}
            onClose={() => {
              setShowDocumentViewer(false)
              setSelectedDocument(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClientPortal