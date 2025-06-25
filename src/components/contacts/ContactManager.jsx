import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import contactService from '../../lib/contacts'

const { FiUser, FiMail, FiPhone, FiBuilding, FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiDownload, FiUpload, FiTag } = FiIcons

const ContactManager = () => {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [showAddContact, setShowAddContact] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterTag, setFilterTag] = useState('all')
  const [editingContact, setEditingContact] = useState(null)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = () => {
    const allContacts = contactService.getAllContacts()
    setContacts(allContacts)
  }

  const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactService.createContact(contactData)
      setContacts(prev => [newContact, ...prev])
      setShowAddContact(false)
      toast.success('Contact added successfully!')
    } catch (error) {
      toast.error('Failed to add contact')
    }
  }

  const handleUpdateContact = async (contactId, updates) => {
    try {
      const updatedContact = await contactService.updateContact(contactId, updates)
      setContacts(prev => prev.map(c => c.id === contactId ? updatedContact : c))
      setEditingContact(null)
      toast.success('Contact updated successfully!')
    } catch (error) {
      toast.error('Failed to update contact')
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.deleteContact(contactId)
        setContacts(prev => prev.filter(c => c.id !== contactId))
        setSelectedContact(null)
        toast.success('Contact deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete contact')
      }
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterTag === 'all' || contact.tags.includes(filterTag)
    
    return matchesSearch && matchesFilter
  })

  const ContactForm = ({ contact, onSave, onCancel }) => {
    const [formData, setFormData] = useState(contact || {
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      tags: [],
      notes: '',
      priority: 'medium'
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
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
          <h3 className="text-xl font-bold text-white mb-6">
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-300 mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
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
                {contact ? 'Update' : 'Add'} Contact
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

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
            <h1 className="text-2xl font-bold text-white mb-2">Contact Manager</h1>
            <p className="text-gray-400">Manage your business contacts and relationships</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors flex items-center">
              <SafeIcon icon={FiDownload} className="w-4 h-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setShowAddContact(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>
          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            <option value="all">All Tags</option>
            <option value="lead">Lead</option>
            <option value="customer">Customer</option>
            <option value="partner">Partner</option>
            <option value="prospect">Prospect</option>
          </select>
        </div>
      </motion.div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact, index) => (
          <motion.div
            key={contact.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all cursor-pointer"
            onClick={() => setSelectedContact(contact)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">{contact.name}</h3>
                  <p className="text-gray-400 text-sm">{contact.position}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs ${
                contact.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                contact.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-green-500/20 text-green-400'
              }`}>
                {contact.priority}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-300 text-sm">
                <SafeIcon icon={FiMail} className="w-4 h-4 mr-2" />
                {contact.email}
              </div>
              {contact.phone && (
                <div className="flex items-center text-gray-300 text-sm">
                  <SafeIcon icon={FiPhone} className="w-4 h-4 mr-2" />
                  {contact.phone}
                </div>
              )}
              {contact.company && (
                <div className="flex items-center text-gray-300 text-sm">
                  <SafeIcon icon={FiBuilding} className="w-4 h-4 mr-2" />
                  {contact.company}
                </div>
              )}
            </div>

            {contact.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {contact.tags.map((tag, tagIndex) => (
                  <span key={tagIndex} className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex space-x-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingContact(contact)
                }}
                className="flex-1 bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteContact(contact.id)
                }}
                className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-500 transition-colors text-sm"
              >
                <SafeIcon icon={FiTrash2} className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <ContactForm
          onSave={handleAddContact}
          onCancel={() => setShowAddContact(false)}
        />
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <ContactForm
          contact={editingContact}
          onSave={(updates) => handleUpdateContact(editingContact.id, updates)}
          onCancel={() => setEditingContact(null)}
        />
      )}
    </div>
  )
}

export default ContactManager