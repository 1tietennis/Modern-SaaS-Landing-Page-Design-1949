// Ticketing Service with Supabase Integration
import { format } from 'date-fns'
import smsService from './sms'
import { supabaseService } from './supabaseService'

// Ticket Priority Levels
export const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
}

// Ticket Status Types
export const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  CLOSED: 'closed'
}

// Ticket Categories
export const TICKET_CATEGORY = {
  GENERAL_INQUIRY: 'general_inquiry',
  TECHNICAL_SUPPORT: 'technical_support',
  BILLING: 'billing',
  SALES: 'sales',
  FEATURE_REQUEST: 'feature_request',
  BUG_REPORT: 'bug_report',
  COMPLAINT: 'complaint'
}

export class TicketingService {
  constructor() {
    this.tableName = 'support_tickets_crm2024'
    this.notesTableName = 'ticket_notes_crm2024'
    this.timelineTableName = 'ticket_timeline_crm2024'
  }

  async getNextTicketNumber() {
    try {
      // Get the highest ticket number from the database
      const { data, error } = await supabaseService.supabase
        .from(this.tableName)
        .select('ticket_number')
        .order('ticket_number', { ascending: false })
        .limit(1)

      if (error) throw error

      const maxTicket = data[0]?.ticket_number || 100000
      return maxTicket + 1
    } catch (error) {
      console.error('Error getting next ticket number:', error)
      return Date.now() // Fallback to timestamp
    }
  }

  async createTicket(ticketData) {
    try {
      const ticketNumber = await this.getNextTicketNumber()

      const ticket = await supabaseService.create(this.tableName, {
        ticket_number: ticketNumber,
        customer_name: `${ticketData.firstName} ${ticketData.lastName}`,
        email: ticketData.email,
        phone: ticketData.phone || '',
        company: ticketData.company || '',
        subject: this.generateSubject(ticketData),
        description: this.generateDescription(ticketData),
        category: this.determineCategory(ticketData),
        priority: this.determinePriority(ticketData),
        status: TICKET_STATUS.OPEN,
        source: ticketData.source || 'contact_form',
        assigned_to: null,
        tags: this.generateTags(ticketData),
        custom_fields: {
          service: ticketData.service,
          budget: ticketData.budget,
          lead_score: this.calculateLeadScore(ticketData),
          follow_up_date: this.calculateFollowUpDate(ticketData)
        }
      })

      // Create initial timeline entry
      await this.addTimelineEntry(ticket.id, 'created', 'Ticket created from customer inquiry', 'System')

      // Send SMS notifications
      await this.sendTicketNotifications(ticket)

      // Log activity
      await supabaseService.logActivity(
        'create',
        'ticket',
        ticket.id,
        `Created support ticket #${ticket.ticket_number}`,
        { customer: ticket.customer_name, priority: ticket.priority }
      )

      return ticket
    } catch (error) {
      console.error('Error creating ticket:', error)
      throw error
    }
  }

  async getAllTickets() {
    return await supabaseService.getAll(this.tableName)
  }

  async getTicket(ticketNumber) {
    try {
      const { data, error } = await supabaseService.supabase
        .from(this.tableName)
        .select('*')
        .eq('ticket_number', parseInt(ticketNumber))
        .eq('user_id', supabaseService.userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching ticket:', error)
      return null
    }
  }

  async updateTicketStatus(ticketNumber, status, note = '') {
    try {
      const ticket = await this.getTicket(ticketNumber)
      if (!ticket) return null

      const updatedTicket = await supabaseService.update(this.tableName, ticket.id, {
        status,
        updated_at: new Date().toISOString()
      })

      // Add timeline entry
      await this.addTimelineEntry(
        ticket.id,
        'status_changed',
        `Status changed to ${status}${note ? ': ' + note : ''}`,
        'System'
      )

      // Log activity
      await supabaseService.logActivity(
        'update',
        'ticket',
        ticket.id,
        `Changed ticket #${ticket.ticket_number} status to ${status}`,
        { status, note }
      )

      return updatedTicket
    } catch (error) {
      console.error('Error updating ticket status:', error)
      throw error
    }
  }

  async addTicketNote(ticketNumber, note, user = 'System', isInternal = false) {
    try {
      const ticket = await this.getTicket(ticketNumber)
      if (!ticket) return null

      const noteObj = await supabaseService.create(this.notesTableName, {
        ticket_id: ticket.id,
        content: note,
        is_internal: isInternal
      })

      // Add timeline entry
      await this.addTimelineEntry(
        ticket.id,
        'note_added',
        `Note added by ${user}`,
        user
      )

      return noteObj
    } catch (error) {
      console.error('Error adding ticket note:', error)
      throw error
    }
  }

  async addTimelineEntry(ticketId, action, description, userName, metadata = {}) {
    try {
      return await supabaseService.create(this.timelineTableName, {
        ticket_id: ticketId,
        action,
        description,
        user_name: userName,
        metadata
      })
    } catch (error) {
      console.error('Error adding timeline entry:', error)
    }
  }

  async getTicketStats() {
    try {
      const tickets = await this.getAllTickets()
      const total = tickets.length
      const open = tickets.filter(t => t.status === TICKET_STATUS.OPEN).length
      const inProgress = tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length
      const resolved = tickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length
      const urgent = tickets.filter(t => t.priority === TICKET_PRIORITY.URGENT).length

      return {
        total,
        open,
        inProgress,
        resolved,
        urgent,
        avgLeadScore: tickets.reduce((sum, t) => sum + (t.custom_fields?.lead_score || 0), 0) / total || 0
      }
    } catch (error) {
      console.error('Error getting ticket stats:', error)
      return { total: 0, open: 0, inProgress: 0, resolved: 0, urgent: 0, avgLeadScore: 0 }
    }
  }

  generateSubject(ticketData) {
    if (ticketData.service) {
      return `${ticketData.service} - Inquiry from ${ticketData.firstName} ${ticketData.lastName}`
    }
    return `General Inquiry from ${ticketData.firstName} ${ticketData.lastName}`
  }

  generateDescription(ticketData) {
    let description = `Customer Inquiry Details:\n\n`
    description += `Name: ${ticketData.firstName} ${ticketData.lastName}\n`
    description += `Email: ${ticketData.email}\n`
    if (ticketData.phone) {
      description += `Phone: ${ticketData.phone}\n`
    }
    if (ticketData.company) {
      description += `Company: ${ticketData.company}\n`
    }
    if (ticketData.service) {
      description += `Service of Interest: ${ticketData.service}\n`
    }
    if (ticketData.budget) {
      description += `Budget Range: ${ticketData.budget}\n`
    }
    if (ticketData.message) {
      description += `\nMessage:\n${ticketData.message}\n`
    }
    
    description += `\nInquiry Date: ${format(new Date(), 'PPpp')}`
    description += `\nSource: ${ticketData.source || 'Contact Form'}`
    
    return description
  }

  determineCategory(ticketData) {
    if (ticketData.service) {
      if (ticketData.service.includes('website') || ticketData.service.includes('design')) {
        return TICKET_CATEGORY.TECHNICAL_SUPPORT
      }
      if (ticketData.service.includes('consultation')) {
        return TICKET_CATEGORY.SALES
      }
      if (ticketData.service.includes('marketing')) {
        return TICKET_CATEGORY.SALES
      }
    }
    return TICKET_CATEGORY.GENERAL_INQUIRY
  }

  determinePriority(ticketData) {
    // High budget customers get higher priority
    if (ticketData.budget === '25k-plus' || ticketData.budget === '10k-25k') {
      return TICKET_PRIORITY.HIGH
    }

    // Enterprise services get higher priority
    if (ticketData.service && ticketData.service.includes('enterprise')) {
      return TICKET_PRIORITY.HIGH
    }

    // Urgent keywords in message
    if (ticketData.message && (
      ticketData.message.toLowerCase().includes('urgent') ||
      ticketData.message.toLowerCase().includes('asap') ||
      ticketData.message.toLowerCase().includes('emergency')
    )) {
      return TICKET_PRIORITY.URGENT
    }

    return TICKET_PRIORITY.MEDIUM
  }

  generateTags(ticketData) {
    const tags = []
    
    if (ticketData.service) {
      tags.push(ticketData.service.toLowerCase().replace(/\s+/g, '-'))
    }
    if (ticketData.budget) {
      tags.push('budget-' + ticketData.budget)
    }
    if (ticketData.company) {
      tags.push('has-company')
    }
    if (ticketData.source) {
      tags.push('source-' + ticketData.source)
    }

    return tags
  }

  calculateLeadScore(ticketData) {
    let score = 0

    // Budget scoring
    if (ticketData.budget) {
      const budgetScores = {
        'under-1k': 10,
        '1k-5k': 30,
        '5k-10k': 50,
        '10k-25k': 80,
        '25k-plus': 100
      }
      score += budgetScores[ticketData.budget] || 0
    }

    // Service interest scoring
    if (ticketData.service) {
      if (ticketData.service.includes('full-package') || ticketData.service.includes('complete')) {
        score += 30
      } else if (ticketData.service.includes('consultation')) {
        score += 15
      } else {
        score += 20
      }
    }

    // Company info bonus
    if (ticketData.company) {
      score += 15
    }

    // Message detail bonus
    if (ticketData.message && ticketData.message.length > 100) {
      score += 10
    }

    return Math.min(score, 100) // Cap at 100
  }

  calculateFollowUpDate(ticketData) {
    const now = new Date()
    const priority = this.determinePriority(ticketData)

    switch (priority) {
      case TICKET_PRIORITY.URGENT:
        return new Date(now.getTime() + 2 * 60 * 60 * 1000) // 2 hours
      case TICKET_PRIORITY.HIGH:
        return new Date(now.getTime() + 4 * 60 * 60 * 1000) // 4 hours
      case TICKET_PRIORITY.MEDIUM:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24 hours
      default:
        return new Date(now.getTime() + 48 * 60 * 60 * 1000) // 48 hours
    }
  }

  async sendTicketNotifications(ticket) {
    try {
      // Send SMS notification
      if (ticket.priority === TICKET_PRIORITY.URGENT) {
        await smsService.notifyUrgentInquiry({
          customerName: ticket.customer_name,
          email: ticket.email,
          phone: ticket.phone,
          issue: ticket.subject,
          ticketNumber: ticket.ticket_number
        })
      } else {
        await smsService.notifyNewTicket({
          ticketNumber: ticket.ticket_number,
          customerName: ticket.customer_name,
          priority: ticket.priority,
          subject: ticket.subject,
          createdAt: ticket.created_at
        })
      }

      console.log(`📱 SMS notifications sent for ticket #${ticket.ticket_number}`)
    } catch (error) {
      console.error('Error sending ticket notifications:', error)
    }
  }
}

export const ticketingService = new TicketingService()
export default ticketingService