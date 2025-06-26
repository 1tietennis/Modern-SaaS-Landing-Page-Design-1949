// Automation Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class AutomationService {
  constructor() {
    this.workflowsTableName = 'automation_workflows_crm2024'
    this.templatesTableName = 'email_templates_crm2024'
  }

  async getWorkflows() {
    return await supabaseService.getAll(this.workflowsTableName)
  }

  async createWorkflow(workflowData) {
    try {
      const workflow = await supabaseService.create(this.workflowsTableName, {
        name: workflowData.name,
        description: workflowData.description || '',
        trigger_type: workflowData.trigger || 'new_lead',
        conditions: workflowData.conditions || [],
        actions: workflowData.actions || [],
        delay_minutes: workflowData.delay || 0,
        active: workflowData.active || false,
        stats: { triggered: 0, completed: 0, conversion_rate: 0 }
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'workflow',
        workflow.id,
        `Created automation workflow: ${workflow.name}`,
        { trigger: workflow.trigger_type, active: workflow.active }
      )

      return workflow
    } catch (error) {
      console.error('Error creating workflow:', error)
      throw error
    }
  }

  async updateWorkflow(workflowId, updates) {
    try {
      const workflow = await supabaseService.update(this.workflowsTableName, workflowId, updates)

      // Log activity
      await supabaseService.logActivity(
        'update',
        'workflow',
        workflowId,
        `Updated automation workflow: ${workflow.name}`,
        updates
      )

      return workflow
    } catch (error) {
      console.error('Error updating workflow:', error)
      throw error
    }
  }

  async toggleWorkflow(workflowId, active) {
    try {
      const workflow = await supabaseService.update(this.workflowsTableName, workflowId, { active })

      // Log activity
      await supabaseService.logActivity(
        'update',
        'workflow',
        workflowId,
        `${active ? 'Activated' : 'Deactivated'} workflow: ${workflow.name}`,
        { active }
      )

      return workflow
    } catch (error) {
      console.error('Error toggling workflow:', error)
      throw error
    }
  }

  async deleteWorkflow(workflowId) {
    try {
      const workflow = await supabaseService.getById(this.workflowsTableName, workflowId)
      await supabaseService.delete(this.workflowsTableName, workflowId)

      // Log activity
      await supabaseService.logActivity(
        'delete',
        'workflow',
        workflowId,
        `Deleted workflow: ${workflow?.name || 'Unknown'}`,
        { workflow_id: workflowId }
      )

      return true
    } catch (error) {
      console.error('Error deleting workflow:', error)
      throw error
    }
  }

  async getTemplates() {
    return await supabaseService.getAll(this.templatesTableName)
  }

  async createTemplate(templateData) {
    try {
      const template = await supabaseService.create(this.templatesTableName, {
        name: templateData.name,
        type: templateData.type || 'email',
        subject: templateData.subject || '',
        content: templateData.content,
        variables: templateData.variables || {},
        active: templateData.active !== false,
        usage_count: 0
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'template',
        template.id,
        `Created ${template.type} template: ${template.name}`,
        { type: template.type }
      )

      return template
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  async updateTemplate(templateId, updates) {
    try {
      const template = await supabaseService.update(this.templatesTableName, templateId, updates)

      // Log activity
      await supabaseService.logActivity(
        'update',
        'template',
        templateId,
        `Updated template: ${template.name}`,
        updates
      )

      return template
    } catch (error) {
      console.error('Error updating template:', error)
      throw error
    }
  }

  async deleteTemplate(templateId) {
    try {
      const template = await supabaseService.getById(this.templatesTableName, templateId)
      await supabaseService.delete(this.templatesTableName, templateId)

      // Log activity
      await supabaseService.logActivity(
        'delete',
        'template',
        templateId,
        `Deleted template: ${template?.name || 'Unknown'}`,
        { template_id: templateId }
      )

      return true
    } catch (error) {
      console.error('Error deleting template:', error)
      throw error
    }
  }

  // Mock responses for UI compatibility
  getResponses() {
    return [
      {
        id: 1,
        trigger: 'business_hours',
        type: 'email',
        subject: 'We received your message',
        content: 'Thank you for contacting CyborgCRM. We received your message and will respond within 2 hours during business hours.',
        active: true
      }
    ]
  }

  async getWorkflowStats() {
    try {
      const workflows = await this.getWorkflows()
      return {
        total: workflows.length,
        active: workflows.filter(w => w.active).length,
        totalTriggered: workflows.reduce((sum, w) => sum + (w.stats?.triggered || 0), 0),
        totalCompleted: workflows.reduce((sum, w) => sum + (w.stats?.completed || 0), 0),
        averageConversion: workflows.length > 0
          ? Math.round(workflows.reduce((sum, w) => sum + (w.stats?.conversion_rate || 0), 0) / workflows.length)
          : 0
      }
    } catch (error) {
      console.error('Error getting workflow stats:', error)
      return { total: 0, active: 0, totalTriggered: 0, totalCompleted: 0, averageConversion: 0 }
    }
  }

  // Email automation methods
  async sendAutomatedEmail(templateId, recipientData) {
    try {
      const template = await supabaseService.getById(this.templatesTableName, templateId)
      if (!template || template.type !== 'email') {
        throw new Error('Email template not found')
      }

      // Replace variables in template
      let content = template.content
      let subject = template.subject

      Object.entries(recipientData).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g')
        content = content.replace(regex, value)
        subject = subject.replace(regex, value)
      })

      console.log('Sending automated email:', {
        to: recipientData.email,
        subject,
        content,
        templateId
      })

      // Update usage count
      await supabaseService.update(this.templatesTableName, templateId, {
        usage_count: (template.usage_count || 0) + 1
      })

      return {
        success: true,
        messageId: `email_${Date.now()}`,
        templateUsed: template.name
      }
    } catch (error) {
      console.error('Error sending automated email:', error)
      throw error
    }
  }

  // Trigger workflow execution
  async triggerWorkflow(triggerType, data) {
    try {
      const workflows = await this.getWorkflows()
      const activeWorkflows = workflows.filter(w => w.active && w.trigger_type === triggerType)

      for (const workflow of activeWorkflows) {
        if (this.evaluateConditions(workflow.conditions, data)) {
          await this.executeWorkflow(workflow, data)
        }
      }
    } catch (error) {
      console.error('Error triggering workflows:', error)
    }
  }

  evaluateConditions(conditions, data) {
    if (!conditions || conditions.length === 0) return true

    return conditions.every(condition => {
      const value = data[condition.field]
      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'not_equals':
          return value !== condition.value
        case 'greater_than':
          return Number(value) > Number(condition.value)
        case 'less_than':
          return Number(value) < Number(condition.value)
        case 'contains':
          return String(value).toLowerCase().includes(String(condition.value).toLowerCase())
        default:
          return true
      }
    })
  }

  async executeWorkflow(workflow, data) {
    try {
      console.log(`Executing workflow: ${workflow.name}`, data)

      // Update stats
      const newStats = {
        ...workflow.stats,
        triggered: (workflow.stats.triggered || 0) + 1
      }

      for (const action of workflow.actions) {
        try {
          await this.executeAction(action, data)
        } catch (error) {
          console.error(`Error executing action in workflow ${workflow.name}:`, error)
        }
      }

      newStats.completed = (workflow.stats.completed || 0) + 1
      newStats.conversion_rate = Math.round((newStats.completed / newStats.triggered) * 100)

      await supabaseService.update(this.workflowsTableName, workflow.id, { stats: newStats })

      // Log activity
      await supabaseService.logActivity(
        'execute',
        'workflow',
        workflow.id,
        `Executed workflow: ${workflow.name}`,
        { trigger_data: data, stats: newStats }
      )
    } catch (error) {
      console.error('Error executing workflow:', error)
    }
  }

  async executeAction(action, data) {
    switch (action.type) {
      case 'send_email':
        if (action.delay > 0) {
          setTimeout(() => {
            this.sendAutomatedEmail(action.template, data)
          }, action.delay * 60 * 1000) // Convert minutes to milliseconds
        } else {
          await this.sendAutomatedEmail(action.template, data)
        }
        break
      case 'send_sms':
        console.log('Sending SMS:', data)
        break
      case 'add_to_crm':
        console.log('Adding to CRM:', data)
        break
      default:
        console.log('Unknown action type:', action.type)
    }
  }
}

export const automationService = new AutomationService()
export default automationService