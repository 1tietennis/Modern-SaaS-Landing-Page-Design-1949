import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import projectService from '../../lib/projects'

const { FiFolder, FiPlus, FiEdit, FiTrash2, FiUser, FiCalendar, FiClock, FiCheckCircle, FiBell, FiMessageSquare } = FiIcons

const ProjectManager = () => {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [showAddProject, setShowAddProject] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    loadProjects()
    loadNotifications()
  }, [])

  const loadProjects = () => {
    const allProjects = projectService.getAllProjects()
    setProjects(allProjects)
  }

  const loadNotifications = () => {
    const projectNotifications = projectService.getNotifications()
    setNotifications(projectNotifications)
  }

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.createProject(projectData)
      setProjects(prev => [newProject, ...prev])
      setShowAddProject(false)
      toast.success('Project created successfully!')
    } catch (error) {
      toast.error('Failed to create project')
    }
  }

  const handleUpdateProject = async (projectId, updates) => {
    try {
      const updatedProject = await projectService.updateProject(projectId, updates)
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p))
      setEditingProject(null)
      toast.success('Project updated successfully!')
    } catch (error) {
      toast.error('Failed to update project')
    }
  }

  const handleAddTask = async (projectId, taskData) => {
    try {
      const updatedProject = await projectService.addTask(projectId, taskData)
      setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p))
      if (selectedProject && selectedProject.id === projectId) {
        setSelectedProject(updatedProject)
      }
      toast.success('Task added successfully!')
    } catch (error) {
      toast.error('Failed to add task')
    }
  }

  const ProjectForm = ({ project, onSave, onCancel }) => {
    const [formData, setFormData] = useState(project || {
      name: '',
      description: '',
      client: '',
      deadline: '',
      priority: 'medium',
      status: 'planning',
      budget: '',
      team: []
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
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg">
          <h3 className="text-xl font-bold text-white mb-6">
            {project ? 'Edit Project' : 'Create New Project'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Project Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Budget</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
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
                {project ? 'Update' : 'Create'} Project
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400'
      case 'planning': return 'bg-blue-500/20 text-blue-400'
      case 'on_hold': return 'bg-yellow-500/20 text-yellow-400'
      case 'completed': return 'bg-purple-500/20 text-purple-400'
      case 'cancelled': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400'
      case 'high': return 'text-orange-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
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
            <h1 className="text-2xl font-bold text-white mb-2">Project Manager</h1>
            <p className="text-gray-400">Manage client projects and team collaboration</p>
          </div>
          <button
            onClick={() => setShowAddProject(true)}
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </motion.div>

      {/* Notifications Panel */}
      {notifications.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <SafeIcon icon={FiBell} className="w-6 h-6 text-orange-400" />
            <h3 className="text-lg font-semibold text-white">Project Notifications</h3>
          </div>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                <span className="text-gray-300">{notification.message}</span>
                <span className="text-gray-500 text-xs">{notification.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                <p className="text-gray-400 text-sm">{project.client}</p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(project.status)}`}>
                  {project.status.replace('_', ' ')}
                </span>
                <span className={`text-lg ${getPriorityColor(project.priority)}`}>
                  {project.priority === 'urgent' ? '🔥' : project.priority === 'high' ? '⚠️' : project.priority === 'medium' ? '📌' : '📝'}
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-sm mb-4 line-clamp-2">{project.description}</p>

            <div className="space-y-2 mb-4">
              {project.deadline && (
                <div className="flex items-center text-gray-400 text-xs">
                  <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                  Due: {format(new Date(project.deadline), 'MMM d, yyyy')}
                </div>
              )}
              <div className="flex items-center text-gray-400 text-xs">
                <SafeIcon icon={FiCheckCircle} className="w-3 h-3 mr-1" />
                {project.tasks.filter(t => t.completed).length} / {project.tasks.length} tasks completed
              </div>
              {project.budget && (
                <div className="flex items-center text-gray-400 text-xs">
                  <span className="mr-1">💰</span>
                  Budget: ${project.budget.toLocaleString()}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Progress</span>
                <span>{Math.round((project.tasks.filter(t => t.completed).length / project.tasks.length) * 100 || 0)}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(project.tasks.filter(t => t.completed).length / project.tasks.length) * 100 || 0}%` }}
                />
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedProject(project)}
                className="flex-1 bg-cyan-500 text-white py-2 px-3 rounded-lg hover:bg-cyan-600 transition-colors text-sm"
              >
                View Details
              </button>
              <button
                onClick={() => setEditingProject(project)}
                className="bg-gray-600 text-white py-2 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm"
              >
                <SafeIcon icon={FiEdit} className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showAddProject && (
        <ProjectForm
          onSave={handleCreateProject}
          onCancel={() => setShowAddProject(false)}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <ProjectForm
          project={editingProject}
          onSave={(updates) => handleUpdateProject(editingProject.id, updates)}
          onCancel={() => setEditingProject(null)}
        />
      )}
    </div>
  )
}

export default ProjectManager