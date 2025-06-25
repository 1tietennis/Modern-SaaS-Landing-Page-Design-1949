// Automation Service
export class AutomationService {
  constructor() {
    this.workflows = this.loadWorkflows()
    this.templates = this.loadTemplates()
    this.responses = this.loadResponses()
  }

  loadWorkflows() {
    try {
      const stored = localStorage.getItem('cyborgcrm_workflows')
      return stored ? JSON.parse(stored) : this.getDefaultWorkflows()
    } catch (error) {
      console.error('Error loading workflows:', error)
      return this.getDefaultWorkflows()
    }
  }

  loadTemplates() {
    return [
      // Email Templates
      {
        id: 1,
        name: 'Welcome Email',
        type: 'email',
        subject: 'Welcome to CyborgCRM! 🚀',
        content: `Hi {{firstName}},

Welcome to CyborgCRM! We're thrilled to have you on board.

Our team will be in touch within 24 hours to help you get started with your digital marketing strategy.

In the meantime, feel free to explore our resources:
- Marketing Strategy Guide
- Free SEO Audit Tool
- Client Success Stories

Best regards,
The CyborgCRM Team`,
        preview: 'Welcome new customers with personalized messaging',
        active: true,
        usage: 127
      },
      {
        id: 2,
        name: 'Follow-up Email',
        type: 'email',
        subject: 'Quick follow-up on your inquiry',
        content: `Hi {{firstName}},

I wanted to follow up on your recent inquiry about our {{service}} services.

Based on your needs, I believe our {{recommendedPackage}} package would be perfect for {{companyName}}.

Would you be available for a 15-minute call this week to discuss how we can help you achieve your marketing goals?

Best regards,
{{salesRepName}}`,
        preview: 'Automated follow-up for sales inquiries',
        active: true,
        usage: 89
      },
      {
        id: 3,
        name: 'Proposal Ready',
        type: 'email',
        subject: 'Your custom marketing proposal is ready! 📊',
        content: `Hi {{firstName}},

Great news! Your custom marketing proposal is ready for review.

We've analyzed your business needs and created a comprehensive strategy that includes:
✓ {{service1}}
✓ {{service2}}
✓ {{service3}}

The proposal includes detailed timelines, expected ROI, and transparent pricing.

Click here to review your proposal: {{proposalLink}}

Let's schedule a call to discuss the next steps!

Best regards,
{{salesRepName}}`,
        preview: 'Notify when custom proposals are ready',
        active: true,
        usage: 156
      },
      // SMS Templates
      {
        id: 4,
        name: 'Lead Notification',
        type: 'sms',
        content: '🚨 NEW LEAD: {{firstName}} {{lastName}} from {{companyName}} is interested in {{service}}. Ticket #{{ticketNumber}} created. Respond within 1 hour for best results!',
        preview: 'Instant SMS alerts for new leads',
        active: true,
        usage: 234
      },
      {
        id: 5,
        name: 'Appointment Reminder',
        type: 'sms',
        content: 'Hi {{firstName}}! Reminder: Your consultation call with {{salesRep}} is tomorrow at {{time}}. Reply CONFIRM to confirm or RESCHEDULE if you need to change. - CyborgCRM',
        preview: 'Appointment reminders via SMS',
        active: true,
        usage: 178
      },
      {
        id: 6,
        name: 'Quick Response',
        type: 'sms',
        content: 'Thanks for your interest in CyborgCRM! We received your inquiry and will respond within 2 hours. For urgent matters, call (555) 123-4567. - Team CyborgCRM',
        preview: 'Quick acknowledgment of inquiries',
        active: true,
        usage: 445
      }
    ]
  }

  loadResponses() {
    return [
      {
        id: 1,
        trigger: 'business_hours',
        type: 'email',
        subject: 'We received your message',
        content: 'Thank you for contacting CyborgCRM. We received your message and will respond within 2 hours during business hours.',
        active: true
      },
      {
        id: 2,
        trigger: 'after_hours',
        type: 'email',
        subject: 'Thanks for your message - we\'ll respond soon',
        content: 'Thank you for contacting CyborgCRM. Our office is currently closed, but we\'ll respond first thing in the morning.',
        active: true
      },
      {
        id: 3,
        trigger: 'weekend',
        type: 'sms',
        content: 'Thanks for your message! Our team will respond on Monday morning. For urgent matters, call (555) 123-4567.',
        active: false
      }
    ]
  }

  getDefaultWorkflows() {
    return [
      {
        id: 1,
        name: 'New Lead Nurturing',
        description: 'Automatically nurture new leads with educational content and follow-ups',
        trigger: 'new_lead',
        conditions: [
          { field: 'leadSource', operator: 'equals', value: 'website' },
          { field: 'leadScore', operator: 'greater_than', value: 50 }
        ],
        actions: [
          { type: 'send_email', template: 'welcome_email', delay: 0 },
          { type: 'send_sms', template: 'welcome_sms', delay: 5 },
          { type: 'add_to_crm', delay: 0 },
          { type: 'assign_sales_rep', delay: 0 },
          { type: 'schedule_followup', delay: 1440 } // 24 hours
        ],
        delay: 0,
        active: true,
        stats: {
          triggered: 156,
          completed: 142,
          conversionRate: 23
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Abandoned Form Recovery',
        description: 'Re-engage users who started but didn\'t complete contact forms',
        trigger: 'form_abandoned',
        conditions: [
          { field: 'timeOnPage', operator: 'greater_than', value: 30 },
          { field: 'fieldsCompleted', operator: 'greater_than', value: 2 }
        ],
        actions: [
          { type: 'send_email', template: 'abandoned_form', delay: 60 },
          { type: 'show_exit_intent', delay: 0 },
          { type: 'retarget_ads', delay: 120 }
        ],
        delay: 60,
        active: true,
        stats: {
          triggered: 89,
          completed: 67,
          conversionRate: 18
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Customer Onboarding',
        description: 'Guide new customers through the onboarding process',
        trigger: 'new_customer',
        conditions: [
          { field: 'packageType', operator: 'not_equals', value: 'trial' }
        ],
        actions: [
          { type: 'send_email', template: 'onboarding_welcome', delay: 0 },
          { type: 'create_project', delay: 0 },
          { type: 'schedule_kickoff', delay: 1440 },
          { type: 'send_resources', delay: 2880 }
        ],
        delay: 0,
        active: true,
        stats: {
          triggered: 45,
          completed: 43,
          conversionRate: 95
        },
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Re-engagement Campaign',
        description: 'Win back inactive leads and customers',
        trigger: 'inactive_contact',
        conditions: [
          { field: 'lastActivity', operator: 'older_than', value: '30_days' },
          { field: 'leadScore', operator: 'greater_than', value: 30 }
        ],
        actions: [
          { type: 'send_email', template: 'reengagement', delay: 0 },
          { type: 'offer_consultation', delay: 1440 },
          { type: 'send_case_study', delay: 4320 }
        ],
        delay: 0,
        active: false,
        stats: {
          triggered: 78,
          completed: 34,
          conversionRate: 12
        },
        createdAt: new Date().toISOString()
      }
    ]
  }

  async createWorkflow(workflowData) {
    const newWorkflow = {
      id: Date.now(),
      ...workflowData,
      stats: {
        triggered: 0,
        completed: 0,
        conversionRate: 0
      },
      createdAt: new Date().toISOString()
    }

    this.workflows.unshift(newWorkflow)
    this.saveWorkflows()
    return newWorkflow
  }

  async updateWorkflow(workflowId, updates) {
    const workflowIndex = this.workflows.findIndex(w => w.id === workflowId)
    if (workflowIndex === -1) throw new Error('Workflow not found')

    this.workflows[workflowIndex] = {
      ...this.workflows[workflowIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveWorkflows()
    return this.workflows[workflowIndex]
  }

  async toggleWorkflow(workflowId, active) {
    const workflow = this.workflows.find(w => w.id === workflowId)
    if (!workflow) throw new Error('Workflow not found')

    workflow.active = active
    workflow.updatedAt = new Date().toISOString()

    this.saveWorkflows()
    return workflow
  }

  async deleteWorkflow(workflowId) {
    this.workflows = this.workflows.filter(w => w.id !== workflowId)
    this.saveWorkflows()
    return true
  }

  // Email automation methods
  async sendAutomatedEmail(templateId, recipientData) {
    const template = this.templates.find(t => t.id === templateId && t.type === 'email')
    if (!template) throw new Error('Email template not found')

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

    // In production, integrate with email service (SendGrid, Mailgun, etc.)
    return {
      success: true,
      messageId: `email_${Date.now()}`,
      templateUsed: template.name
    }
  }

  // SMS automation methods
  async sendAutomatedSMS(templateId, recipientData) {
    const template = this.templates.find(t => t.id === templateId && t.type === 'sms')
    if (!template) throw new Error('SMS template not found')

    // Replace variables in template
    let content = template.content

    Object.entries(recipientData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g')
      content = content.replace(regex, value)
    })

    console.log('Sending automated SMS:', {
      to: recipientData.phone,
      content,
      templateId
    })

    // In production, integrate with SMS service (Twilio, etc.)
    return {
      success: true,
      messageId: `sms_${Date.now()}`,
      templateUsed: template.name
    }
  }

  // Trigger workflow execution
  async triggerWorkflow(triggerType, data) {
    const activeWorkflows = this.workflows.filter(w => 
      w.active && w.trigger === triggerType
    )

    for (const workflow of activeWorkflows) {
      // Check conditions
      if (this.evaluateConditions(workflow.conditions, data)) {
        await this.executeWorkflow(workflow, data)
      }
    }
  }

  evaluateConditions(conditions, data) {
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
        case 'older_than':
          // Handle date comparisons
          const daysAgo = parseInt(condition.value.replace('_days', ''))
          const cutoffDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
          return new Date(value) < cutoffDate
        default:
          return true
      }
    })
  }

  async executeWorkflow(workflow, data) {
    console.log(`Executing workflow: ${workflow.name}`, data)

    // Update stats
    workflow.stats.triggered++

    for (const action of workflow.actions) {
      try {
        await this.executeAction(action, data)
      } catch (error) {
        console.error(`Error executing action in workflow ${workflow.name}:`, error)
      }
    }

    workflow.stats.completed++
    workflow.stats.conversionRate = Math.round(
      (workflow.stats.completed / workflow.stats.triggered) * 100
    )

    this.saveWorkflows()
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
        if (action.delay > 0) {
          setTimeout(() => {
            this.sendAutomatedSMS(action.template, data)
          }, action.delay * 60 * 1000)
        } else {
          await this.sendAutomatedSMS(action.template, data)
        }
        break

      case 'add_to_crm':
        console.log('Adding to CRM:', data)
        // Integrate with CRM system
        break

      case 'assign_sales_rep':
        console.log('Assigning sales rep:', data)
        // Assign to sales representative
        break

      case 'schedule_followup':
        console.log('Scheduling follow-up:', data)
        // Create follow-up task
        break

      case 'create_project':
        console.log('Creating project:', data)
        // Create new project
        break

      default:
        console.log('Unknown action type:', action.type)
    }
  }

  getWorkflows() {
    return this.workflows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getTemplates() {
    return this.templates
  }

  getResponses() {
    return this.responses
  }

  getWorkflowStats() {
    return {
      total: this.workflows.length,
      active: this.workflows.filter(w => w.active).length,
      totalTriggered: this.workflows.reduce((sum, w) => sum + w.stats.triggered, 0),
      totalCompleted: this.workflows.reduce((sum, w) => sum + w.stats.completed, 0),
      averageConversion: Math.round(
        this.workflows.reduce((sum, w) => sum + w.stats.conversionRate, 0) / this.workflows.length
      )
    }
  }

  saveWorkflows() {
    localStorage.setItem('cyborgcrm_workflows', JSON.stringify(this.workflows))
  }
}

export const automationService = new AutomationService()
export default automationService