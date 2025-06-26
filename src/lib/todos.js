// Business Todo Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class TodoService {
  constructor() {
    this.tableName = 'todos_crm2024'
  }

  async createTodo(todoData) {
    try {
      const todo = await supabaseService.create(this.tableName, {
        title: todoData.title,
        description: todoData.description || '',
        priority: todoData.priority || 'medium',
        category: todoData.category || 'general',
        due_date: todoData.dueDate || null,
        assigned_to: todoData.assignedTo || '',
        estimated_hours: todoData.estimatedHours || null,
        completed: false
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'todo',
        todo.id,
        `Created task: ${todo.title}`,
        { priority: todo.priority, category: todo.category }
      )

      return todo
    } catch (error) {
      console.error('Error creating todo:', error)
      throw error
    }
  }

  async getAllTodos() {
    return await supabaseService.getAll(this.tableName)
  }

  async updateTodo(todoId, updates) {
    try {
      const todo = await supabaseService.update(this.tableName, todoId, updates)

      // Log activity
      await supabaseService.logActivity(
        'update',
        'todo',
        todoId,
        `Updated task: ${todo.title}`,
        updates
      )

      return todo
    } catch (error) {
      console.error('Error updating todo:', error)
      throw error
    }
  }

  async toggleComplete(todoId) {
    try {
      const todo = await supabaseService.getById(this.tableName, todoId)
      if (!todo) throw new Error('Todo not found')

      const updatedTodo = await supabaseService.update(this.tableName, todoId, {
        completed: !todo.completed,
        completed_at: !todo.completed ? new Date().toISOString() : null
      })

      // Log activity
      await supabaseService.logActivity(
        'update',
        'todo',
        todoId,
        `${updatedTodo.completed ? 'Completed' : 'Reopened'} task: ${todo.title}`,
        { completed: updatedTodo.completed }
      )

      return updatedTodo
    } catch (error) {
      console.error('Error toggling todo completion:', error)
      throw error
    }
  }

  async deleteTodo(todoId) {
    try {
      const todo = await supabaseService.getById(this.tableName, todoId)
      await supabaseService.delete(this.tableName, todoId)

      // Log activity
      await supabaseService.logActivity(
        'delete',
        'todo',
        todoId,
        `Deleted task: ${todo?.title || 'Unknown'}`,
        { todo_id: todoId }
      )

      return true
    } catch (error) {
      console.error('Error deleting todo:', error)
      throw error
    }
  }

  async getTodosByCategory(category) {
    return await supabaseService.getAll(this.tableName, { category })
  }

  async getTodosByAssignee(assignee) {
    try {
      const todos = await this.getAllTodos()
      return todos.filter(todo => todo.assigned_to === assignee)
    } catch (error) {
      console.error('Error getting todos by assignee:', error)
      return []
    }
  }

  async getOverdueTodos() {
    try {
      const todos = await this.getAllTodos()
      const now = new Date()
      return todos.filter(todo => 
        !todo.completed && 
        todo.due_date && 
        new Date(todo.due_date) < now
      )
    } catch (error) {
      console.error('Error getting overdue todos:', error)
      return []
    }
  }

  async getTodoStats() {
    try {
      const todos = await this.getAllTodos()
      const total = todos.length
      const completed = todos.filter(t => t.completed).length
      const overdue = await this.getOverdueTodos()
      const urgent = todos.filter(t => t.priority === 'urgent' && !t.completed).length

      return {
        total,
        completed,
        pending: total - completed,
        overdue: overdue.length,
        urgent,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      }
    } catch (error) {
      console.error('Error getting todo stats:', error)
      return { total: 0, completed: 0, pending: 0, overdue: 0, urgent: 0, completionRate: 0 }
    }
  }
}

export const todoService = new TodoService()
export default todoService