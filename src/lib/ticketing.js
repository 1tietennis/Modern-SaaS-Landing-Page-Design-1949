import { format } from 'date-fns'
import smsService from './sms'

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
    this.tickets = this.loadTickets()
    this.ticketCounter = this.getNextTicketNumber()
  }

  loadTickets() {
    try {
      const stored = localStorage.getItem('cyborgcrm_tickets')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading tickets:', error)
      return []
    }
  }

  saveTickets() {
    try {
      localStorage.setItem('cyborgcrm_tickets', JSON.stringify(this.tickets))
    } catch (error) {
      console.error('Error saving tickets:', error)
    }
  }

  getNextTicketNumber() {
    const existingTickets = this.tickets
    if (existingTickets.length === 0) {
      return 100001
    }
    const maxTicket = Math.max(...existingTickets.map(t => parseInt(t.ticketNumber)))
    return maxTicket + 1
  }

  generateTicketNumber() {
    return this.ticketCounter++
  }

  async createTicket(ticketData) {
    const ticketNumber = this.generateTicketNumber()
    
    const ticket = {
      id: Date.now(),
      ticketNumber: ticketNumber,
      customerName: `${ticketData.firstName} ${ticketData.lastName}`,
      email: ticketData.email,
      phone: ticketData.phone || '',
      company: ticketData.company || '',
      subject: this.generateSubject(ticketData),
      description: this.generateDescription(ticketData),
      category: this.determineCategory(ticketData),
      priority: this.determinePriority(ticketData),
      status: TICKET_STATUS.OPEN,
      source: ticketData.source || 'contact_form',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: null,
      tags: this.generateTags(ticketData),
      attachments: [],
      notes: [],
      timeline: [
        {
          id: Date.now(),
          action: 'created',
          description: 'Ticket created from customer inquiry',
          timestamp: new Date().toISOString(),
          user: 'System'
        }
      ],
      customFields: {
        service: ticketData.service,
        budget: ticketData.budget,
        leadScore: this.calculateLeadScore(ticketData),
        followUpDate: this.calculateFollowUpDate(ticketData)
      }
    }

    this.tickets.push(ticket)
    this.saveTickets()

    // Send SMS notifications
    await this.sendTicketNotifications(ticket)

    return ticket
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
    
    if (ticketData.challenge) {
      description += `\nMarketing Challenge: ${ticketData.challenge}\n`
    }
    
    if (ticketData.business) {
      description += `Business Type: ${ticketData.business}\n`
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
    if (ticketData.message && 
        (ticketData.message.toLowerCase().includes('urgent') || 
         ticketData.message.toLowerCase().includes('asap') ||
         ticketData.message.toLowerCase().includes('emergency'))) {
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
          customerName: ticket.customerName,
          email: ticket.email,
          phone: ticket.phone,
          issue: ticket.subject,
          ticketNumber: ticket.ticketNumber
        })
      } else {
        await smsService.notifyNewTicket({
          ticketNumber: ticket.ticketNumber,
          customerName: ticket.customerName,
          priority: ticket.priority,
          subject: ticket.subject,
          createdAt: ticket.createdAt
        })
      }

      console.log(`📱 SMS notifications sent for ticket #${ticket.ticketNumber}`)
    } catch (error) {
      console.error('Error sending ticket notifications:', error)
    }
  }

  getTicket(ticketNumber) {
    return this.tickets.find(t => t.ticketNumber === parseInt(ticketNumber))
  }

  getAllTickets() {
    return this.tickets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  updateTicketStatus(ticketNumber, status, note = '') {
    const ticket = this.getTicket(ticketNumber)
    if (!ticket) return null

    ticket.status = status
    ticket.updatedAt = new Date().toISOString()
    
    ticket.timeline.push({
      id: Date.now(),
      action: 'status_changed',
      description: `Status changed to ${status}${note ? ': ' + note : ''}`,
      timestamp: new Date().toISOString(),
      user: 'System'
    })

    this.saveTickets()
    return ticket
  }

  addTicketNote(ticketNumber, note, user = 'System') {
    const ticket = this.getTicket(ticketNumber)
    if (!ticket) return null

    const noteObj = {
      id: Date.now(),
      content: note,
      user: user,
      timestamp: new Date().toISOString()
    }

    ticket.notes.push(noteObj)
    ticket.updatedAt = new Date().toISOString()
    
    ticket.timeline.push({
      id: Date.now(),
      action: 'note_added',
      description: `Note added by ${user}`,
      timestamp: new Date().toISOString(),
      user: user
    })

    this.saveTickets()
    return ticket
  }

  getTicketStats() {
    const total = this.tickets.length
    const open = this.tickets.filter(t => t.status === TICKET_STATUS.OPEN).length
    const inProgress = this.tickets.filter(t => t.status === TICKET_STATUS.IN_PROGRESS).length
    const resolved = this.tickets.filter(t => t.status === TICKET_STATUS.RESOLVED).length
    const urgent = this.tickets.filter(t => t.priority === TICKET_PRIORITY.URGENT).length
    
    return {
      total,
      open,
      inProgress,
      resolved,
      urgent,
      avgLeadScore: this.tickets.reduce((sum, t) => sum + (t.customFields.leadScore || 0), 0) / total || 0
    }
  }
}

export const ticketingService = new TicketingService()
export default ticketingService