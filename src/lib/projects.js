// Project Management Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class ProjectService {
  constructor() {
    this.tableName = 'projects_crm2024'
  }

  async createProject(projectData) {
    try {
      const project = await supabaseService.create(this.tableName, {
        name: projectData.name,
        description: projectData.description || '',
        client: projectData.client || '',
        status: projectData.status || 'planning',
        priority: projectData.priority || 'medium',
        budget: projectData.budget || null,
        deadline: projectData.deadline || null,
        team_members: projectData.team || [],
        tasks: projectData.tasks || [],
        progress: 0
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'project',
        project.id,
        `Created project: ${project.name}`,
        { client: project.client, budget: project.budget }
      )

      return project
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  async getAllProjects() {
    return await supabaseService.getAll(this.tableName)
  }

  async updateProject(projectId, updates) {
    try {
      const project = await supabaseService.update(this.tableName, projectId, updates)

      // Log activity
      await supabaseService.logActivity(
        'update',
        'project',
        projectId,
        `Updated project: ${project.name}`,
        updates
      )

      return project
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  async deleteProject(projectId) {
    try {
      const project = await supabaseService.getById(this.tableName, projectId)
      await supabaseService.delete(this.tableName, projectId)

      // Log activity
      await supabaseService.logActivity(
        'delete',
        'project',
        projectId,
        `Deleted project: ${project?.name || 'Unknown'}`,
        { project_id: projectId }
      )

      return true
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  async addTask(projectId, taskData) {
    try {
      const project = await supabaseService.getById(this.tableName, projectId)
      if (!project) throw new Error('Project not found')

      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        created_at: new Date().toISOString()
      }

      const updatedTasks = [...(project.tasks || []), newTask]
      const updatedProject = await supabaseService.update(this.tableName, projectId, {
        tasks: updatedTasks
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'task',
        newTask.id,
        `Added task "${newTask.title}" to project ${project.name}`,
        { project_id: projectId, task: newTask }
      )

      return updatedProject
    } catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  }

  async updateTaskStatus(projectId, taskId, completed) {
    try {
      const project = await supabaseService.getById(this.tableName, projectId)
      if (!project) throw new Error('Project not found')

      const updatedTasks = (project.tasks || []).map(task =>
        task.id === taskId
          ? { ...task, completed, completed_at: completed ? new Date().toISOString() : null }
          : task
      )

      const updatedProject = await supabaseService.update(this.tableName, projectId, {
        tasks: updatedTasks
      })

      // Log activity
      const task = updatedTasks.find(t => t.id === taskId)
      await supabaseService.logActivity(
        'update',
        'task',
        taskId,
        `${completed ? 'Completed' : 'Reopened'} task "${task?.title || 'Unknown'}" in project ${project.name}`,
        { project_id: projectId, task_id: taskId, completed }
      )

      return updatedProject
    } catch (error) {
      console.error('Error updating task status:', error)
      throw error
    }
  }

  async getProjectsByStatus(status) {
    return await supabaseService.getAll(this.tableName, { status })
  }

  getNotifications() {
    // Mock notifications for now - in real implementation, this would come from the database
    return [
      {
        id: 1,
        message: 'Website redesign project deadline approaching in 3 days',
        time: '2 hours ago',
        type: 'deadline',
        project_id: 1
      },
      {
        id: 2,
        message: 'New task assigned in Marketing Campaign project',
        time: '4 hours ago',
        type: 'task',
        project_id: 2
      }
    ]
  }
}

export const projectService = new ProjectService()
export default projectService