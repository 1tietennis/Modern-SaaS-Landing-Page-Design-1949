// Personal Goals Management Service with Google Integration
export class GoalsService {
  constructor() {
    this.goals = this.loadGoals()
    this.syncStatus = this.loadSyncStatus()
  }

  loadGoals() {
    try {
      const stored = localStorage.getItem('cyborgcrm_goals')
      return stored ? JSON.parse(stored) : this.getDefaultGoals()
    } catch (error) {
      console.error('Error loading goals:', error)
      return this.getDefaultGoals()
    }
  }

  loadSyncStatus() {
    try {
      const stored = localStorage.getItem('cyborgcrm_sync_status')
      return stored ? JSON.parse(stored) : { google: false, calendar: false }
    } catch (error) {
      return { google: false, calendar: false }
    }
  }

  getDefaultGoals() {
    return [
      {
        id: 1,
        title: 'Increase Monthly Revenue by 30%',
        description: 'Focus on upselling existing clients and acquiring 5 new high-value customers',
        category: 'business',
        priority: 'high',
        targetDate: '2024-06-30',
        progress: 65,
        metrics: {
          type: 'currency',
          target: 300000,
          current: 195000
        },
        milestones: [
          { id: 1, title: 'Reach $250k', completed: false, date: '2024-04-30' },
          { id: 2, title: 'Reach $275k', completed: false, date: '2024-05-31' }
        ],
        googleTaskId: null,
        calendarEventId: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Complete Digital Marketing Certification',
        description: 'Earn Google Ads and Facebook Blueprint certifications to enhance expertise',
        category: 'learning',
        priority: 'medium',
        targetDate: '2024-04-15',
        progress: 40,
        metrics: {
          type: 'percentage',
          target: 100,
          current: 40
        },
        milestones: [
          { id: 3, title: 'Complete Google Ads course', completed: true, date: '2024-02-15' },
          { id: 4, title: 'Pass Google Ads exam', completed: false, date: '2024-03-01' }
        ],
        googleTaskId: null,
        calendarEventId: null,
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Build Emergency Fund',
        description: 'Save $50,000 for business emergency fund to ensure financial stability',
        category: 'financial',
        priority: 'high',
        targetDate: '2024-12-31',
        progress: 30,
        metrics: {
          type: 'currency',
          target: 50000,
          current: 15000
        },
        milestones: [
          { id: 5, title: 'Save $20k', completed: false, date: '2024-06-30' },
          { id: 6, title: 'Save $35k', completed: false, date: '2024-09-30' }
        ],
        googleTaskId: null,
        calendarEventId: null,
        createdAt: new Date().toISOString()
      }
    ]
  }

  async createGoal(goalData) {
    const newGoal = {
      id: Date.now(),
      ...goalData,
      progress: 0,
      milestones: goalData.milestones || [],
      googleTaskId: null,
      calendarEventId: null,
      createdAt: new Date().toISOString()
    }

    this.goals.unshift(newGoal)
    this.saveGoals()
    return newGoal
  }

  async updateGoal(goalId, updates) {
    const goalIndex = this.goals.findIndex(g => g.id === goalId)
    if (goalIndex === -1) throw new Error('Goal not found')

    this.goals[goalIndex] = {
      ...this.goals[goalIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveGoals()
    
    // Sync with Google if enabled
    if (this.syncStatus.google) {
      await this.syncGoalWithGoogle(this.goals[goalIndex])
    }

    return this.goals[goalIndex]
  }

  async updateProgress(goalId, progress) {
    const goal = this.goals.find(g => g.id === goalId)
    if (!goal) throw new Error('Goal not found')

    // Calculate new current value based on progress percentage
    const newCurrent = Math.round((progress / 100) * goal.metrics.target)
    
    goal.progress = Math.min(progress, 100)
    goal.metrics.current = newCurrent
    goal.completed = progress >= 100
    goal.completedAt = progress >= 100 ? new Date().toISOString() : null
    goal.updatedAt = new Date().toISOString()

    this.saveGoals()

    // Sync with Google if enabled
    if (this.syncStatus.google) {
      await this.syncGoalWithGoogle(goal)
    }

    return goal
  }

  async deleteGoal(goalId) {
    const goal = this.goals.find(g => g.id === goalId)
    if (goal && goal.googleTaskId && this.syncStatus.google) {
      await this.deleteGoogleTask(goal.googleTaskId)
    }

    this.goals = this.goals.filter(g => g.id !== goalId)
    this.saveGoals()
    return true
  }

  // Google Tasks Integration
  async syncWithGoogleTasks(goal) {
    try {
      // In a real implementation, this would use the Google Tasks API
      console.log('Syncing goal with Google Tasks:', goal.title)
      
      // Mock Google Tasks API call
      const googleTask = {
        id: `gt_${goal.id}_${Date.now()}`,
        title: goal.title,
        notes: goal.description,
        due: goal.targetDate,
        status: goal.completed ? 'completed' : 'needsAction'
      }

      // Update goal with Google Task ID
      goal.googleTaskId = googleTask.id
      this.saveGoals()

      return googleTask
    } catch (error) {
      console.error('Error syncing with Google Tasks:', error)
      throw error
    }
  }

  async syncGoalWithGoogle(goal) {
    if (!this.syncStatus.google || !goal.googleTaskId) return

    try {
      // Mock API call to update Google Task
      console.log('Updating Google Task:', goal.googleTaskId, {
        title: goal.title,
        notes: `${goal.description}\n\nProgress: ${goal.progress}%`,
        status: goal.completed ? 'completed' : 'needsAction'
      })
    } catch (error) {
      console.error('Error updating Google Task:', error)
    }
  }

  async syncAllWithGoogle() {
    try {
      // Mock authentication with Google
      this.syncStatus.google = true
      this.saveSyncStatus()

      // Sync all goals
      for (const goal of this.goals) {
        if (!goal.googleTaskId) {
          await this.syncWithGoogleTasks(goal)
        }
      }

      return true
    } catch (error) {
      console.error('Error syncing with Google:', error)
      throw error
    }
  }

  async deleteGoogleTask(taskId) {
    try {
      // Mock API call to delete Google Task
      console.log('Deleting Google Task:', taskId)
    } catch (error) {
      console.error('Error deleting Google Task:', error)
    }
  }

  // Google Calendar Integration
  async createCalendarEvent(goal) {
    try {
      // Mock Google Calendar API call
      const calendarEvent = {
        id: `ce_${goal.id}_${Date.now()}`,
        summary: goal.title,
        description: goal.description,
        start: { date: goal.targetDate },
        end: { date: goal.targetDate }
      }

      goal.calendarEventId = calendarEvent.id
      this.saveGoals()

      return calendarEvent
    } catch (error) {
      console.error('Error creating calendar event:', error)
      throw error
    }
  }

  getAllGoals() {
    return this.goals.sort((a, b) => {
      // Incomplete goals first, then by priority
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1
      }
      
      const priorities = { critical: 4, high: 3, medium: 2, low: 1 }
      return priorities[b.priority] - priorities[a.priority]
    })
  }

  getGoalsByCategory(category) {
    return this.goals.filter(g => g.category === category)
  }

  getSyncStatus() {
    return this.syncStatus
  }

  getGoalStats() {
    const total = this.goals.length
    const completed = this.goals.filter(g => g.completed).length
    const overdue = this.goals.filter(g => 
      !g.completed && 
      g.targetDate && 
      new Date(g.targetDate) < new Date()
    ).length

    return {
      total,
      completed,
      active: total - completed,
      overdue,
      averageProgress: total > 0 ? Math.round(this.goals.reduce((sum, g) => sum + g.progress, 0) / total) : 0
    }
  }

  saveGoals() {
    localStorage.setItem('cyborgcrm_goals', JSON.stringify(this.goals))
  }

  saveSyncStatus() {
    localStorage.setItem('cyborgcrm_sync_status', JSON.stringify(this.syncStatus))
  }
}

export const goalsService = new GoalsService()
export default goalsService