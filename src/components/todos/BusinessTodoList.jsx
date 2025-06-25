import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import todoService from '../../lib/todos'

const { FiCheckSquare, FiPlus, FiEdit, FiTrash2, FiClock, FiFlag, FiFilter, FiCalendar, FiUser } = FiIcons

const BusinessTodoList = () => {
  const [todos, setTodos] = useState([])
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('priority')

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = () => {
    const allTodos = todoService.getAllTodos()
    setTodos(allTodos)
  }

  const handleCreateTodo = async (todoData) => {
    try {
      const newTodo = await todoService.createTodo(todoData)
      setTodos(prev => [newTodo, ...prev])
      setShowAddTodo(false)
      toast.success('Task added successfully!')
    } catch (error) {
      toast.error('Failed to add task')
    }
  }

  const handleToggleComplete = async (todoId) => {
    try {
      const updatedTodo = await todoService.toggleComplete(todoId)
      setTodos(prev => prev.map(t => t.id === todoId ? updatedTodo : t))
      toast.success(updatedTodo.completed ? 'Task completed!' : 'Task reopened')
    } catch (error) {
      toast.error('Failed to update task')
    }
  }

  const handleDeleteTodo = async (todoId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await todoService.deleteTodo(todoId)
        setTodos(prev => prev.filter(t => t.id !== todoId))
        toast.success('Task deleted successfully!')
      } catch (error) {
        toast.error('Failed to delete task')
      }
    }
  }

  const TodoForm = ({ todo, onSave, onCancel }) => {
    const [formData, setFormData] = useState(todo || {
      title: '',
      description: '',
      priority: 'medium',
      category: 'general',
      dueDate: '',
      assignedTo: '',
      estimatedHours: ''
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
            {todo ? 'Edit Task' : 'Add New Task'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Task Title *</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                >
                  <option value="general">General</option>
                  <option value="marketing">Marketing</option>
                  <option value="sales">Sales</option>
                  <option value="development">Development</option>
                  <option value="operations">Operations</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estimated Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Assigned To</label>
              <input
                type="text"
                value={formData.assignedTo}
                onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="Team member name"
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
                {todo ? 'Update' : 'Add'} Task
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
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

  const getCategoryColor = (category) => {
    const colors = {
      marketing: 'bg-pink-500/20 text-pink-400',
      sales: 'bg-green-500/20 text-green-400',
      development: 'bg-blue-500/20 text-blue-400',
      operations: 'bg-purple-500/20 text-purple-400',
      finance: 'bg-yellow-500/20 text-yellow-400',
      general: 'bg-gray-500/20 text-gray-400'
    }
    return colors[category] || colors.general
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'completed') return todo.completed
    if (filter === 'pending') return !todo.completed
    if (filter === 'overdue') return !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()
    return true
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const priorities = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorities[b.priority] - priorities[a.priority]
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

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
            <h1 className="text-2xl font-bold text-white mb-2">Business To-Do List</h1>
            <p className="text-gray-400">Manage your business tasks and priorities</p>
          </div>
          <button
            onClick={() => setShowAddTodo(true)}
            className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Task
          </button>
        </div>
      </motion.div>

      {/* Filters and Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <option value="priority">Sort by Priority</option>
              <option value="dueDate">Sort by Due Date</option>
              <option value="created">Sort by Created</option>
            </select>
          </div>

          <div className="flex space-x-6 text-sm">
            <div className="text-gray-300">
              <span className="font-medium text-white">{todos.filter(t => !t.completed).length}</span> Pending
            </div>
            <div className="text-gray-300">
              <span className="font-medium text-white">{todos.filter(t => t.completed).length}</span> Completed
            </div>
            <div className="text-gray-300">
              <span className="font-medium text-white">{todos.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length}</span> Overdue
            </div>
          </div>
        </div>
      </motion.div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.map((todo, index) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={`bg-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-500 transition-all ${
              todo.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <button
                onClick={() => handleToggleComplete(todo.id)}
                className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-400 hover:border-green-400'
                }`}
              >
                {todo.completed && <SafeIcon icon={FiCheckSquare} className="w-4 h-4 text-white" />}
              </button>

              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className={`font-semibold ${todo.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-gray-400 text-sm mt-1">{todo.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg ${getPriorityColor(todo.priority)}`}>
                      {todo.priority === 'urgent' ? '🔥' : todo.priority === 'high' ? '⚠️' : todo.priority === 'medium' ? '📌' : '📝'}
                    </span>
                    <button
                      onClick={() => setEditingTodo(todo)}
                      className="p-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <SafeIcon icon={FiEdit} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(todo.category)}`}>
                    {todo.category}
                  </span>
                  
                  {todo.dueDate && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiCalendar} className="w-3 h-3 mr-1" />
                      <span className={new Date(todo.dueDate) < new Date() && !todo.completed ? 'text-red-400' : ''}>
                        Due: {format(new Date(todo.dueDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}

                  {todo.estimatedHours && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiClock} className="w-3 h-3 mr-1" />
                      {todo.estimatedHours}h estimated
                    </div>
                  )}

                  {todo.assignedTo && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiUser} className="w-3 h-3 mr-1" />
                      {todo.assignedTo}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTodos.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-gray-400 text-lg mb-4">No tasks found</div>
          <button
            onClick={() => setShowAddTodo(true)}
            className="bg-cyan-500 text-white px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Add Your First Task
          </button>
        </motion.div>
      )}

      {/* Add Todo Modal */}
      {showAddTodo && (
        <TodoForm
          onSave={handleCreateTodo}
          onCancel={() => setShowAddTodo(false)}
        />
      )}

      {/* Edit Todo Modal */}
      {editingTodo && (
        <TodoForm
          todo={editingTodo}
          onSave={(updates) => {
            todoService.updateTodo(editingTodo.id, updates)
            loadTodos()
            setEditingTodo(null)
            toast.success('Task updated successfully!')
          }}
          onCancel={() => setEditingTodo(null)}
        />
      )}
    </div>
  )
}

export default BusinessTodoList