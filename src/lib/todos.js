// Business Todo Service
export class TodoService {
  constructor() {
    this.todos = this.loadTodos()
  }

  loadTodos() {
    try {
      const stored = localStorage.getItem('cyborgcrm_todos')
      return stored ? JSON.parse(stored) : this.getDefaultTodos()
    } catch (error) {
      console.error('Error loading todos:', error)
      return this.getDefaultTodos()
    }
  }

  getDefaultTodos() {
    return [
      {
        id: 1,
        title: 'Review Q1 Marketing Budget',
        description: 'Analyze spending and ROI for first quarter marketing campaigns',
        priority: 'high',
        category: 'finance',
        dueDate: '2024-02-01',
        assignedTo: 'John Doe',
        estimatedHours: 3,
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Update Website Content',
        description: 'Refresh homepage content and product descriptions',
        priority: 'medium',
        category: 'marketing',
        dueDate: '2024-01-30',
        assignedTo: 'Jane Smith',
        estimatedHours: 5,
        completed: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Client Check-in Call',
        description: 'Monthly check-in with TechCorp Inc to review progress',
        priority: 'high',
        category: 'sales',
        dueDate: '2024-01-25',
        assignedTo: 'Sarah Johnson',
        estimatedHours: 1,
        completed: true,
        completedAt: '2024-01-24T14:30:00Z',
        createdAt: new Date().toISOString()
      }
    ]
  }

  async createTodo(todoData) {
    const newTodo = {
      id: Date.now(),
      ...todoData,
      completed: false,
      createdAt: new Date().toISOString()
    }

    this.todos.unshift(newTodo)
    this.saveTodos()
    return newTodo
  }

  async updateTodo(todoId, updates) {
    const todoIndex = this.todos.findIndex(t => t.id === todoId)
    if (todoIndex === -1) throw new Error('Todo not found')

    this.todos[todoIndex] = {
      ...this.todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveTodos()
    return this.todos[todoIndex]
  }

  async toggleComplete(todoId) {
    const todo = this.todos.find(t => t.id === todoId)
    if (!todo) throw new Error('Todo not found')

    todo.completed = !todo.completed
    todo.completedAt = todo.completed ? new Date().toISOString() : null
    todo.updatedAt = new Date().toISOString()

    this.saveTodos()
    return todo
  }

  async deleteTodo(todoId) {
    this.todos = this.todos.filter(t => t.id !== todoId)
    this.saveTodos()
    return true
  }

  getAllTodos() {
    return this.todos.sort((a, b) => {
      // Incomplete todos first, then by priority
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      
      const priorities = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorities[b.priority] - priorities[a.priority]
    })
  }

  getTodosByCategory(category) {
    return this.todos.filter(t => t.category === category)
  }

  getTodosByAssignee(assignee) {
    return this.todos.filter(t => t.assignedTo === assignee)
  }

  getOverdueTodos() {
    const now = new Date()
    return this.todos.filter(t => 
      !t.completed && 
      t.dueDate && 
      new Date(t.dueDate) < now
    )
  }

  getTodoStats() {
    const total = this.todos.length
    const completed = this.todos.filter(t => t.completed).length
    const overdue = this.getOverdueTodos().length
    const urgent = this.todos.filter(t => t.priority === 'urgent' && !t.completed).length

    return {
      total,
      completed,
      pending: total - completed,
      overdue,
      urgent,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  saveTodos() {
    localStorage.setItem('cyborgcrm_todos', JSON.stringify(this.todos))
  }
}

export const todoService = new TodoService()
export default todoService