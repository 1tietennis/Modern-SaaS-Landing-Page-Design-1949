import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import ticketingService, { TICKET_STATUS, TICKET_PRIORITY } from '../../lib/ticketing'
import smsService from '../../lib/sms'

const { FiTicket, FiClock, FiUser, FiPhone, FiMail, FiMessageSquare, FiAlertTriangle, FiCheckCircle, FiXCircle, FiEdit } = FiIcons

const TicketDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [stats, setStats] = useState({})
  const [smsStatus, setSmsStatus] = useState({})

  useEffect(() => {
    loadTickets()
    checkSmsStatus()
  }, [])

  const loadTickets = () => {
    const allTickets = ticketingService.getAllTickets()
    const ticketStats = ticketingService.getTicketStats()
    setTickets(allTickets)
    setStats(ticketStats)
  }

  const checkSmsStatus = () => {
    const status = smsService.getStatus()
    setSmsStatus(status)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case TICKET_PRIORITY.URGENT: return 'text-red-500 bg-red-500/20'
      case TICKET_PRIORITY.HIGH: return 'text-orange-500 bg-orange-500/20'
      case TICKET_PRIORITY.MEDIUM: return 'text-yellow-500 bg-yellow-500/20'
      default: return 'text-green-500 bg-green-500/20'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case TICKET_STATUS.OPEN: return 'text-blue-500 bg-blue-500/20'
      case TICKET_STATUS.IN_PROGRESS: return 'text-yellow-500 bg-yellow-500/20'
      case TICKET_STATUS.RESOLVED: return 'text-green-500 bg-green-500/20'
      case TICKET_STATUS.CLOSED: return 'text-gray-500 bg-gray-500/20'
      default: return 'text-gray-500 bg-gray-500/20'
    }
  }

  const updateTicketStatus = (ticketNumber, newStatus) => {
    ticketingService.updateTicketStatus(ticketNumber, newStatus)
    loadTickets()
  }

  return (
    <div className="space-y-6">
      {/* Header with SMS Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Support Tickets</h1>
            <p className="text-gray-400">Manage customer inquiries and support requests</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* SMS Status Indicator */}
            <div className={`flex items-center px-4 py-2 rounded-lg ${smsStatus.configured ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
              <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">
                SMS {smsStatus.configured ? 'Connected' : 'Mock Mode'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Tickets', value: stats.total || 0, icon: FiTicket, color: 'from-blue-400 to-cyan-500' },
          { label: 'Open Tickets', value: stats.open || 0, icon: FiClock, color: 'from-yellow-400 to-orange-500' },
          { label: 'Urgent Tickets', value: stats.urgent || 0, icon: FiAlertTriangle, color: 'from-red-400 to-pink-500' },
          { label: 'Resolved Today', value: stats.resolved || 0, icon: FiCheckCircle, color: 'from-green-400 to-emerald-500' }
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

      {/* Tickets List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl border border-gray-600"
      >
        <div className="p-6 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">Recent Tickets</h2>
        </div>
        
        <div className="divide-y divide-gray-600">
          {tickets.slice(0, 10).map((ticket) => (
            <motion.div
              key={ticket.id}
              whileHover={{ backgroundColor: 'rgba(55, 65, 81, 0.5)' }}
              className="p-6 cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-primary-400 font-mono text-sm">#{ticket.ticketNumber}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold mb-1">{ticket.subject}</h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-1" />
                      {ticket.customerName}
                    </div>
                    <div className="flex items-center">
                      <SafeIcon icon={FiMail} className="w-4 h-4 mr-1" />
                      {ticket.email}
                    </div>
                    {ticket.phone && (
                      <div className="flex items-center">
                        <SafeIcon icon={FiPhone} className="w-4 h-4 mr-1" />
                        {ticket.phone}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(ticket.createdAt), 'h:mm a')}
                  </div>
                  {ticket.customFields.leadScore && (
                    <div className="mt-1">
                      <span className="text-xs text-green-400">
                        Lead Score: {ticket.customFields.leadScore}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedTicket(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-gray-800 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white">Ticket #{selectedTicket.ticketNumber}</h2>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}>
                    {selectedTicket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiXCircle} className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-300">{selectedTicket.customerName}</span>
                  </div>
                  <div className="flex items-center">
                    <SafeIcon icon={FiMail} className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-300">{selectedTicket.email}</span>
                  </div>
                  {selectedTicket.phone && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiPhone} className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-300">{selectedTicket.phone}</span>
                    </div>
                  )}
                  {selectedTicket.company && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-300">{selectedTicket.company}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ticket Details */}
              <div className="bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Ticket Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-400 text-sm">Created:</span>
                    <p className="text-gray-300">{format(new Date(selectedTicket.createdAt), 'PPpp')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Category:</span>
                    <p className="text-gray-300">{selectedTicket.category.replace('_', ' ')}</p>
                  </div>
                  {selectedTicket.customFields.leadScore && (
                    <div>
                      <span className="text-gray-400 text-sm">Lead Score:</span>
                      <p className="text-green-400 font-semibold">{selectedTicket.customFields.leadScore}/100</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6 bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
              <div className="text-gray-300 whitespace-pre-line">
                {selectedTicket.description}
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 bg-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Timeline</h3>
              <div className="space-y-4">
                {selectedTicket.timeline.map((event) => (
                  <div key={event.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-gray-300">{event.description}</p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(event.timestamp), 'MMM d, yyyy h:mm a')} by {event.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-4">
              <select
                onChange={(e) => updateTicketStatus(selectedTicket.ticketNumber, e.target.value)}
                value={selectedTicket.status}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600"
              >
                <option value={TICKET_STATUS.OPEN}>Open</option>
                <option value={TICKET_STATUS.IN_PROGRESS}>In Progress</option>
                <option value={TICKET_STATUS.PENDING}>Pending</option>
                <option value={TICKET_STATUS.RESOLVED}>Resolved</option>
                <option value={TICKET_STATUS.CLOSED}>Closed</option>
              </select>
              
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Add Note
              </button>
              
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Send SMS Update
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default TicketDashboard