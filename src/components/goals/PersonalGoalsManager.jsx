import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format, addDays } from 'date-fns'
import toast from 'react-hot-toast'
import goalsService from '../../lib/goals'

const { FiTarget, FiPlus, FiEdit, FiTrash2, FiCalendar, FiTrendingUp, FiCheckCircle, FiClock, FiSync } = FiIcons

const PersonalGoalsManager = () => {
  const [goals, setGoals] = useState([])
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [syncStatus, setSyncStatus] = useState({ google: false, calendar: false })

  useEffect(() => {
    loadGoals()
    checkSyncStatus()
  }, [])

  const loadGoals = () => {
    const allGoals = goalsService.getAllGoals()
    setGoals(allGoals)
  }

  const checkSyncStatus = () => {
    const status = goalsService.getSyncStatus()
    setSyncStatus(status)
  }

  const handleCreateGoal = async (goalData) => {
    try {
      const newGoal = await goalsService.createGoal(goalData)
      setGoals(prev => [newGoal, ...prev])
      setShowAddGoal(false)
      toast.success('Goal created successfully!')
      
      // Sync with Google Tasks if enabled
      if (syncStatus.google) {
        await goalsService.syncWithGoogleTasks(newGoal)
      }
    } catch (error) {
      toast.error('Failed to create goal')
    }
  }

  const handleUpdateProgress = async (goalId, progress) => {
    try {
      const updatedGoal = await goalsService.updateProgress(goalId, progress)
      setGoals(prev => prev.map(g => g.id === goalId ? updatedGoal : g))
      
      if (progress === 100) {
        toast.success('🎉 Goal completed! Congratulations!')
      }
    } catch (error) {
      toast.error('Failed to update progress')
    }
  }

  const handleSyncWithGoogle = async () => {
    try {
      toast.loading('Syncing with Google Tasks...')
      await goalsService.syncAllWithGoogle()
      setSyncStatus(prev => ({ ...prev, google: true }))
      toast.success('Successfully synced with Google Tasks!')
    } catch (error) {
      toast.error('Failed to sync with Google Tasks')
    }
  }

  const GoalForm = ({ goal, onSave, onCancel }) => {
    const [formData, setFormData] = useState(goal || {
      title: '',
      description: '',
      category: 'personal',
      priority: 'medium',
      targetDate: '',
      milestones: [],
      metrics: {
        type: 'percentage',
        target: 100,
        current: 0
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
        <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">
            {goal ? 'Edit Goal' : 'Create New Goal'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Goal Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="financial">Financial</option>
                  <option value="career">Career</option>
                </select>
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
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Target Date</label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Metric Type</label>
                <select
                  value={formData.metrics.type}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    metrics: { ...prev.metrics, type: e.target.value }
                  }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="percentage">Percentage</option>
                  <option value="number">Number</option>
                  <option value="currency">Currency</option>
                  <option value="time">Time (hours)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Value</label>
                <input
                  type="number"
                  value={formData.metrics.target}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    metrics: { ...prev.metrics, target: Number(e.target.value) }
                  }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
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
                {goal ? 'Update' : 'Create'} Goal
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const getCategoryColor = (category) => {
    const colors = {
      personal: 'bg-blue-500/20 text-blue-400',
      business: 'bg-green-500/20 text-green-400',
      health: 'bg-red-500/20 text-red-400',
      learning: 'bg-purple-500/20 text-purple-400',
      financial: 'bg-yellow-500/20 text-yellow-400',
      career: 'bg-pink-500/20 text-pink-400'
    }
    return colors[category] || colors.personal
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-400'
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
            <h1 className="text-2xl font-bold text-white mb-2">Personal Goals Manager</h1>
            <p className="text-gray-400">Track your personal and professional goals with Google sync</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleSyncWithGoogle}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                syncStatus.google 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <SafeIcon icon={FiSync} className="w-4 h-4 mr-2" />
              {syncStatus.google ? 'Synced' : 'Sync Google'}
            </button>
            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
            >
              <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
              New Goal
            </button>
          </div>
        </div>
      </motion.div>

      {/* Sync Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Integration Status</h3>
            <div className="flex space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${syncStatus.google ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-300">Google Tasks</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${syncStatus.calendar ? 'bg-green-400' : 'bg-red-400'}`}></div>
                <span className="text-gray-300">Google Calendar</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-semibold">{goals.length} Goals</p>
            <p className="text-gray-400 text-sm">{goals.filter(g => g.completed).length} Completed</p>
          </div>
        </div>
      </motion.div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{goal.title}</h3>
                <p className="text-gray-400 text-sm mb-2">{goal.description}</p>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(goal.category)}`}>
                    {goal.category}
                  </span>
                  <span className={`text-lg ${getPriorityColor(goal.priority)}`}>
                    {goal.priority === 'critical' ? '🔥' : goal.priority === 'high' ? '⚠️' : goal.priority === 'medium' ? '📌' : '📝'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setEditingGoal(goal)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <SafeIcon icon={FiEdit} className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-400 transition-colors">
                  <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Progress</span>
                <span>{goal.progress}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-gray-400">Current</p>
                <p className="text-white font-semibold">
                  {goal.metrics.type === 'currency' ? '$' : ''}{goal.metrics.current}
                  {goal.metrics.type === 'percentage' ? '%' : ''}
                  {goal.metrics.type === 'time' ? 'h' : ''}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Target</p>
                <p className="text-white font-semibold">
                  {goal.metrics.type === 'currency' ? '$' : ''}{goal.metrics.target}
                  {goal.metrics.type === 'percentage' ? '%' : ''}
                  {goal.metrics.type === 'time' ? 'h' : ''}
                </p>
              </div>
            </div>

            {/* Target Date */}
            {goal.targetDate && (
              <div className="flex items-center text-gray-400 text-sm mb-4">
                <SafeIcon icon={FiCalendar} className="w-4 h-4 mr-2" />
                Target: {format(new Date(goal.targetDate), 'MMM d, yyyy')}
              </div>
            )}

            {/* Progress Update */}
            <div className="flex space-x-2">
              <input
                type="number"
                min="0"
                max={goal.metrics.target}
                placeholder="Update progress"
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = Number(e.target.value)
                    const progress = Math.round((value / goal.metrics.target) * 100)
                    handleUpdateProgress(goal.id, Math.min(progress, 100))
                    e.target.value = ''
                  }
                }}
              />
              <button
                onClick={() => handleUpdateProgress(goal.id, 100)}
                className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                Complete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {goals.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 text-lg mb-4">No goals set yet</div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Create Your First Goal
          </button>
        </motion.div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <GoalForm
          onSave={handleCreateGoal}
          onCancel={() => setShowAddGoal(false)}
        />
      )}

      {/* Edit Goal Modal */}
      {editingGoal && (
        <GoalForm
          goal={editingGoal}
          onSave={(updates) => {
            goalsService.updateGoal(editingGoal.id, updates)
            loadGoals()
            setEditingGoal(null)
            toast.success('Goal updated successfully!')
          }}
          onCancel={() => setEditingGoal(null)}
        />
      )}
    </div>
  )
}

export default PersonalGoalsManager