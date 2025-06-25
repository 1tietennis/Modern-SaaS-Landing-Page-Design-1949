// Project Management Service
export class ProjectService {
  constructor() {
    this.projects = this.loadProjects()
    this.notifications = this.loadNotifications()
  }

  loadProjects() {
    try {
      const stored = localStorage.getItem('cyborgcrm_projects')
      return stored ? JSON.parse(stored) : this.getDefaultProjects()
    } catch (error) {
      console.error('Error loading projects:', error)
      return this.getDefaultProjects()
    }
  }

  loadNotifications() {
    return [
      {
        id: 1,
        message: 'Website redesign project deadline approaching in 3 days',
        time: '2 hours ago',
        type: 'deadline',
        projectId: 1
      },
      {
        id: 2,
        message: 'New task assigned in Marketing Campaign project',
        time: '4 hours ago',
        type: 'task',
        projectId: 2
      },
      {
        id: 3,
        message: 'Client feedback received for Mobile App project',
        time: '1 day ago',
        type: 'feedback',
        projectId: 3
      }
    ]
  }

  getDefaultProjects() {
    return [
      {
        id: 1,
        name: 'Website Redesign',
        description: 'Complete redesign of company website with modern UI/UX',
        client: 'TechCorp Inc',
        status: 'active',
        priority: 'high',
        budget: 25000,
        deadline: '2024-02-15',
        createdAt: new Date().toISOString(),
        team: ['John Doe', 'Jane Smith', 'Mike Wilson'],
        tasks: [
          {
            id: 1,
            title: 'Design mockups',
            completed: true,
            assignee: 'Jane Smith',
            dueDate: '2024-01-20'
          },
          {
            id: 2,
            title: 'Frontend development',
            completed: false,
            assignee: 'John Doe',
            dueDate: '2024-02-05'
          },
          {
            id: 3,
            title: 'Content migration',
            completed: false,
            assignee: 'Mike Wilson',
            dueDate: '2024-02-10'
          }
        ]
      },
      {
        id: 2,
        name: 'Marketing Campaign',
        description: 'Q1 digital marketing campaign for product launch',
        client: 'StartupCo',
        status: 'planning',
        priority: 'medium',
        budget: 15000,
        deadline: '2024-03-01',
        createdAt: new Date().toISOString(),
        team: ['Sarah Johnson', 'Tom Anderson'],
        tasks: [
          {
            id: 4,
            title: 'Market research',
            completed: true,
            assignee: 'Sarah Johnson',
            dueDate: '2024-01-25'
          },
          {
            id: 5,
            title: 'Ad creative design',
            completed: false,
            assignee: 'Tom Anderson',
            dueDate: '2024-02-01'
          }
        ]
      }
    ]
  }

  async createProject(projectData) {
    const newProject = {
      id: Date.now(),
      ...projectData,
      tasks: [],
      createdAt: new Date().toISOString(),
      team: projectData.team || []
    }

    this.projects.unshift(newProject)
    this.saveProjects()

    // Create notification
    this.addNotification({
      message: `New project "${newProject.name}" created`,
      type: 'project_created',
      projectId: newProject.id
    })

    return newProject
  }

  async updateProject(projectId, updates) {
    const projectIndex = this.projects.findIndex(p => p.id === projectId)
    if (projectIndex === -1) throw new Error('Project not found')

    this.projects[projectIndex] = {
      ...this.projects[projectIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveProjects()
    return this.projects[projectIndex]
  }

  async addTask(projectId, taskData) {
    const project = this.projects.find(p => p.id === projectId)
    if (!project) throw new Error('Project not found')

    const newTask = {
      id: Date.now(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString()
    }

    project.tasks.push(newTask)
    this.saveProjects()

    // Create notification for task assignment
    if (taskData.assignee) {
      this.addNotification({
        message: `New task "${newTask.title}" assigned to ${taskData.assignee}`,
        type: 'task_assigned',
        projectId: projectId
      })
    }

    return project
  }

  async updateTaskStatus(projectId, taskId, completed) {
    const project = this.projects.find(p => p.id === projectId)
    if (!project) throw new Error('Project not found')

    const task = project.tasks.find(t => t.id === taskId)
    if (!task) throw new Error('Task not found')

    task.completed = completed
    task.completedAt = completed ? new Date().toISOString() : null

    this.saveProjects()

    // Create notification for task completion
    if (completed) {
      this.addNotification({
        message: `Task "${task.title}" completed in ${project.name}`,
        type: 'task_completed',
        projectId: projectId
      })
    }

    return project
  }

  addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      ...notification,
      time: new Date().toISOString()
    }

    this.notifications.unshift(newNotification)
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50)
    }

    this.saveNotifications()
  }

  getAllProjects() {
    return this.projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getProjectsByStatus(status) {
    return this.projects.filter(p => p.status === status)
  }

  getNotifications() {
    return this.notifications.slice(0, 10) // Return last 10 notifications
  }

  saveProjects() {
    localStorage.setItem('cyborgcrm_projects', JSON.stringify(this.projects))
  }

  saveNotifications() {
    localStorage.setItem('cyborgcrm_notifications', JSON.stringify(this.notifications))
  }
}

export const projectService = new ProjectService()
export default projectService