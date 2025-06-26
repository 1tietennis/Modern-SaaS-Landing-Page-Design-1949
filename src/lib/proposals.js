// Proposal Management Service with Supabase Integration
import { supabaseService } from './supabaseService'
import smsService from './sms'

export class ProposalService {
  constructor() {
    this.proposalsTableName = 'proposals_crm2024'
    this.templatesTableName = 'proposal_templates_crm2024'
    this.sectionsTableName = 'proposal_sections_crm2024'
  }

  async createProposal(proposalData) {
    try {
      const proposal = await supabaseService.create(this.proposalsTableName, {
        title: proposalData.title,
        client_name: proposalData.client_name,
        client_email: proposalData.client_email,
        description: proposalData.description || '',
        value: proposalData.value || null,
        status: 'draft',
        expires_at: proposalData.expires_at || null,
        template_id: proposalData.template_id || null,
        sections: proposalData.sections || [],
        sent_at: null,
        viewed_at: null,
        approved_at: null
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'proposal',
        proposal.id,
        `Created proposal: ${proposal.title}`,
        { client: proposal.client_name, value: proposal.value }
      )

      return proposal
    } catch (error) {
      console.error('Error creating proposal:', error)
      throw error
    }
  }

  async getAllProposals() {
    return await supabaseService.getAll(this.proposalsTableName)
  }

  async updateProposal(proposalId, updates) {
    try {
      const proposal = await supabaseService.update(this.proposalsTableName, proposalId, updates)

      // Log activity
      await supabaseService.logActivity(
        'update',
        'proposal',
        proposalId,
        `Updated proposal: ${proposal.title}`,
        updates
      )

      return proposal
    } catch (error) {
      console.error('Error updating proposal:', error)
      throw error
    }
  }

  async sendProposal(proposalId) {
    try {
      const proposal = await supabaseService.update(this.proposalsTableName, proposalId, {
        status: 'sent',
        sent_at: new Date().toISOString()
      })

      // Send notifications
      await this.sendProposalNotifications(proposal)

      // Log activity
      await supabaseService.logActivity(
        'send',
        'proposal',
        proposalId,
        `Sent proposal to ${proposal.client_name}`,
        { client_email: proposal.client_email }
      )

      return proposal
    } catch (error) {
      console.error('Error sending proposal:', error)
      throw error
    }
  }

  async approveProposal(proposalId) {
    try {
      const proposal = await supabaseService.update(this.proposalsTableName, proposalId, {
        status: 'approved',
        approved_at: new Date().toISOString()
      })

      // Create contract from approved proposal
      await this.createContractFromProposal(proposal)

      // Log activity
      await supabaseService.logActivity(
        'approve',
        'proposal',
        proposalId,
        `Proposal approved by client: ${proposal.client_name}`,
        { value: proposal.value }
      )

      return proposal
    } catch (error) {
      console.error('Error approving proposal:', error)
      throw error
    }
  }

  async createContractFromProposal(proposal) {
    try {
      const contract = await supabaseService.create('contracts_crm2024', {
        title: `${proposal.title} - Service Agreement`,
        client_name: proposal.client_name,
        client_email: proposal.client_email,
        value: proposal.value,
        proposal_id: proposal.id,
        status: 'draft',
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        content: this.generateContractContent(proposal),
        progress: 0
      })

      return contract
    } catch (error) {
      console.error('Error creating contract from proposal:', error)
      throw error
    }
  }

  generateContractContent(proposal) {
    return `
      <h1>Service Agreement - ${proposal.title}</h1>
      
      <h2>Parties</h2>
      <p><strong>Service Provider:</strong> CyborgCRM Digital Marketing</p>
      <p><strong>Client:</strong> ${proposal.client_name}</p>
      
      <h2>Services</h2>
      <p>Based on the approved proposal "${proposal.title}", the following services will be provided:</p>
      ${proposal.sections?.map(section => `
        <h3>${section.title}</h3>
        <p>${section.content}</p>
      `).join('') || ''}
      
      <h2>Terms</h2>
      <ul>
        <li>Contract Value: $${proposal.value?.toLocaleString() || '0'}</li>
        <li>Payment Terms: Net 30 days</li>
        <li>Contract Duration: 12 months</li>
        <li>Termination: 30 days written notice</li>
      </ul>
      
      <h2>Signatures</h2>
      <p>This agreement shall be executed electronically and is binding upon signature by both parties.</p>
    `
  }

  async getTemplates() {
    try {
      const templates = await supabaseService.getAll(this.templatesTableName)
      return templates.length > 0 ? templates : this.getDefaultTemplates()
    } catch (error) {
      console.error('Error fetching templates:', error)
      return this.getDefaultTemplates()
    }
  }

  async createTemplate(templateData) {
    try {
      const template = await supabaseService.create(this.templatesTableName, {
        name: templateData.name,
        description: templateData.description || '',
        category: templateData.category || 'general',
        sections: templateData.sections || [],
        is_default: templateData.is_default || false
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'template',
        template.id,
        `Created proposal template: ${template.name}`,
        { category: template.category }
      )

      return template
    } catch (error) {
      console.error('Error creating template:', error)
      throw error
    }
  }

  getDefaultTemplates() {
    return [
      {
        id: 'default-marketing',
        name: 'Digital Marketing Proposal',
        description: 'Comprehensive digital marketing services template',
        category: 'marketing',
        sections: [
          {
            title: 'Executive Summary',
            content: 'Brief overview of the proposed digital marketing strategy and expected outcomes.',
            order: 1
          },
          {
            title: 'Current Situation Analysis',
            content: 'Analysis of current digital presence and market position.',
            order: 2
          },
          {
            title: 'Proposed Strategy',
            content: 'Detailed strategy including channels, tactics, and timeline.',
            order: 3
          },
          {
            title: 'Investment & ROI',
            content: 'Pricing breakdown and expected return on investment.',
            order: 4
          }
        ]
      },
      {
        id: 'default-web',
        name: 'Website Development Proposal',
        description: 'Website design and development services template',
        category: 'development',
        sections: [
          {
            title: 'Project Overview',
            content: 'Website objectives, target audience, and key requirements.',
            order: 1
          },
          {
            title: 'Technical Specifications',
            content: 'Technology stack, features, and functionality details.',
            order: 2
          },
          {
            title: 'Design & User Experience',
            content: 'Design approach, wireframes, and user journey mapping.',
            order: 3
          },
          {
            title: 'Timeline & Investment',
            content: 'Project phases, milestones, and pricing structure.',
            order: 4
          }
        ]
      },
      {
        id: 'default-consulting',
        name: 'Business Consulting Proposal',
        description: 'Strategic business consulting services template',
        category: 'consulting',
        sections: [
          {
            title: 'Situation Assessment',
            content: 'Current business challenges and opportunities identified.',
            order: 1
          },
          {
            title: 'Recommended Solutions',
            content: 'Strategic recommendations and implementation approach.',
            order: 2
          },
          {
            title: 'Expected Outcomes',
            content: 'Measurable goals and success metrics.',
            order: 3
          },
          {
            title: 'Engagement Terms',
            content: 'Project timeline, deliverables, and investment required.',
            order: 4
          }
        ]
      }
    ]
  }

  async sendProposalNotifications(proposal) {
    try {
      // Send email notification (mock)
      console.log(`📧 Email sent to ${proposal.client_email}:`)
      console.log(`Subject: New Proposal: ${proposal.title}`)
      console.log(`Body: Your proposal is ready for review in the client portal.`)

      // Send SMS notification to team
      await smsService.notifyNewTicket({
        ticketNumber: `PROP-${proposal.id}`,
        customerName: proposal.client_name,
        priority: 'medium',
        subject: `Proposal sent: ${proposal.title}`,
        createdAt: proposal.sent_at
      })

      console.log(`📱 SMS notifications sent for proposal #${proposal.id}`)
    } catch (error) {
      console.error('Error sending proposal notifications:', error)
    }
  }

  // Analytics methods
  async getProposalStats() {
    try {
      const proposals = await this.getAllProposals()
      const total = proposals.length
      const sent = proposals.filter(p => p.status === 'sent' || p.status === 'viewed' || p.status === 'approved').length
      const approved = proposals.filter(p => p.status === 'approved').length
      const totalValue = proposals.reduce((sum, p) => sum + (p.value || 0), 0)
      const approvedValue = proposals.filter(p => p.status === 'approved').reduce((sum, p) => sum + (p.value || 0), 0)

      return {
        total,
        sent,
        approved,
        pending: sent - approved,
        conversionRate: sent > 0 ? Math.round((approved / sent) * 100) : 0,
        totalValue,
        approvedValue,
        averageValue: total > 0 ? Math.round(totalValue / total) : 0
      }
    } catch (error) {
      console.error('Error getting proposal stats:', error)
      return { total: 0, sent: 0, approved: 0, pending: 0, conversionRate: 0, totalValue: 0, approvedValue: 0, averageValue: 0 }
    }
  }

  // Proposal tracking
  async trackProposalView(proposalId, clientIP = null) {
    try {
      const proposal = await supabaseService.getById(this.proposalsTableName, proposalId)
      if (proposal && proposal.status === 'sent') {
        await supabaseService.update(this.proposalsTableName, proposalId, {
          status: 'viewed',
          viewed_at: new Date().toISOString(),
          view_count: (proposal.view_count || 0) + 1
        })

        // Log activity
        await supabaseService.logActivity(
          'view',
          'proposal',
          proposalId,
          `Proposal viewed by client: ${proposal.client_name}`,
          { client_ip: clientIP, view_count: (proposal.view_count || 0) + 1 }
        )
      }
    } catch (error) {
      console.error('Error tracking proposal view:', error)
    }
  }
}

export const proposalService = new ProposalService()
export default proposalService