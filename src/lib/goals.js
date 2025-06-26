// Personal Goals Management Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class GoalsService {
  constructor() {
    this.tableName = 'goals_crm2024'
    this.syncStatus = this.loadSyncStatus()
  }

  loadSyncStatus() {
    try {
      const stored = localStorage.getItem('cyborgcrm_sync_status')
      return stored ? JSON.parse(stored) : { google: false, calendar: false }
    } catch (error) {
      return { google: false, calendar: false }
    }
  }

  async createGoal(goalData) {
    try {
      const goal = await supabaseService.create(this.tableName, {
        title: goalData.title,
        description: goalData.description || '',
        category: goalData.category || 'personal',
        priority: goalData.priority || 'medium',
        target_date: goalData.targetDate || null,
        progress: 0,
        metrics: goalData.metrics || { type: 'percentage', target: 100, current: 0 },
        milestones: goalData.milestones || [],
        google_task_id: null,
        calendar_event_id: null,
        completed: false
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'goal',
        goal.id,
        `Created goal: ${goal.title}`,
        { category: goal.category, target_date: goal.target_date }
      )

      return goal
    } catch (error) {
      console.error('Error creating goal:', error)
      throw error
    }
  }

  async getAllGoals() {
    return await supabaseService.getAll(this.tableName)
  }

  async updateGoal(goalId, updates) {
    try {
      const goal = await supabaseService.update(this.tableName, goalId, updates)

      // Log activity
      await supabaseService.logActivity(
        'update',
        'goal',
        goalId,
        `Updated goal: ${goal.title}`,
        updates
      )

      return goal
    } catch (error) {
      console.error('Error updating goal:', error)
      throw error
    }
  }

  async updateProgress(goalId, progress) {
    try {
      const goal = await supabaseService.getById(this.tableName, goalId)
      if (!goal) throw new Error('Goal not found')

      const newCurrent = Math.round((progress / 100) * goal.metrics.target)
      const completed = progress >= 100

      const updatedGoal = await supabaseService.update(this.tableName, goalId, {
        progress: Math.min(progress, 100),
        metrics: { ...goal.metrics, current: newCurrent },
        completed,
        completed_at: completed ? new Date().toISOString() : null
      })

      // Log activity
      await supabaseService.logActivity(
        'update',
        'goal',
        goalId,
        `Updated progress for goal "${goal.title}" to ${progress}%`,
        { progress, completed }
      )

      return updatedGoal
    } catch (error) {
      console.error('Error updating goal progress:', error)
      throw error
    }
  }

  async deleteGoal(goalId) {
    try {
      const goal = await supabaseService.getById(this.tableName, goalId)
      await supabaseService.delete(this.tableName, goalId)

      // Log activity
      await supabaseService.logActivity(
        'delete',
        'goal',
        goalId,
        `Deleted goal: ${goal?.title || 'Unknown'}`,
        { goal_id: goalId }
      )

      return true
    } catch (error) {
      console.error('Error deleting goal:', error)
      throw error
    }
  }

  async getGoalsByCategory(category) {
    return await supabaseService.getAll(this.tableName, { category })
  }

  getSyncStatus() {
    return this.syncStatus
  }

  async syncAllWithGoogle() {
    try {
      // Mock authentication with Google
      this.syncStatus.google = true
      this.saveSyncStatus()
      return true
    } catch (error) {
      console.error('Error syncing with Google:', error)
      throw error
    }
  }

  async getGoalStats() {
    try {
      const goals = await this.getAllGoals()
      const total = goals.length
      const completed = goals.filter(g => g.completed).length
      const overdue = goals.filter(g => 
        !g.completed && 
        g.target_date && 
        new Date(g.target_date) < new Date()
      ).length

      return {
        total,
        completed,
        active: total - completed,
        overdue,
        averageProgress: total > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / total) : 0
      }
    } catch (error) {
      console.error('Error getting goal stats:', error)
      return { total: 0, completed: 0, active: 0, overdue: 0, averageProgress: 0 }
    }
  }

  saveSyncStatus() {
    localStorage.setItem('cyborgcrm_sync_status', JSON.stringify(this.syncStatus))
  }
}

export const goalsService = new GoalsService()
export default goalsService