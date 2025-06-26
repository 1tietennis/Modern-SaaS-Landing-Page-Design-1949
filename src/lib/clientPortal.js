// Client Portal Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class ClientPortalService {
  constructor() {
    this.proposalsTableName = 'proposals_crm2024'
    this.contractsTableName = 'contracts_crm2024'
    this.documentsTableName = 'documents_crm2024'
    this.messagesTableName = 'portal_messages_crm2024'
    this.clientsTableName = 'clients_crm2024'
  }

  async getClientInfo() {
    // Mock client data - in production, this would come from authentication
    return {
      id: 'client-123',
      name: 'Sarah Johnson',
      company: 'TechStart Inc.',
      email: 'sarah@techstart.com',
      accountManager: 'John Smith',
      activeProjects: 3,
      completedTasks: 28,
      totalInvestment: 45000,
      joinDate: new Date('2024-01-15').toISOString()
    }
  }

  async getProposals() {
    try {
      const proposals = await supabaseService.getAll(this.proposalsTableName)
      return proposals.map(proposal => ({
        ...proposal,
        type: 'Proposal'
      }))
    } catch (error) {
      console.error('Error fetching proposals:', error)
      return this.getMockProposals()
    }
  }

  async getContracts() {
    try {
      const contracts = await supabaseService.getAll(this.contractsTableName)
      return contracts
    } catch (error) {
      console.error('Error fetching contracts:', error)
      return this.getMockContracts()
    }
  }

  async getDocuments() {
    try {
      const documents = await supabaseService.getAll(this.documentsTableName)
      return documents
    } catch (error) {
      console.error('Error fetching documents:', error)
      return this.getMockDocuments()
    }
  }

  async getMessages() {
    try {
      const messages = await supabaseService.getAll(this.messagesTableName)
      return messages.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } catch (error) {
      console.error('Error fetching messages:', error)
      return this.getMockMessages()
    }
  }

  async updateDocumentStatus(documentId, status) {
    try {
      await supabaseService.update(this.documentsTableName, documentId, { 
        status,
        updated_at: new Date().toISOString()
      })
      
      // Log activity
      await supabaseService.logActivity(
        'update',
        'document',
        documentId,
        `Document status changed to ${status}`,
        { status }
      )
      
      return true
    } catch (error) {
      console.error('Error updating document status:', error)
      throw error
    }
  }

  async sendMessage(messageData) {
    try {
      const message = await supabaseService.create(this.messagesTableName, {
        content: messageData.content,
        sender: messageData.sender || 'Client',
        recipient: messageData.recipient || 'Team',
        thread_id: messageData.threadId || null,
        attachments: messageData.attachments || []
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'message',
        message.id,
        `New message from ${message.sender}`,
        { content: message.content.substring(0, 100) }
      )

      return message
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Mock data methods
  getMockProposals() {
    return [
      {
        id: 1,
        title: 'Digital Marketing Strategy 2024',
        type: 'Marketing Proposal',
        status: 'pending',
        value: 25000,
        created_at: new Date('2024-01-15').toISOString(),
        expires_at: new Date('2024-02-15').toISOString(),
        content: `
          <h1>Digital Marketing Strategy 2024</h1>
          <h2>Executive Summary</h2>
          <p>This comprehensive digital marketing strategy is designed to increase your online presence, drive qualified traffic, and boost conversions by 300% within the first 6 months.</p>
          
          <h2>Scope of Work</h2>
          <ul>
            <li>Search Engine Optimization (SEO)</li>
            <li>Pay-Per-Click Advertising (PPC)</li>
            <li>Social Media Marketing</li>
            <li>Content Marketing Strategy</li>
            <li>Email Marketing Automation</li>
          </ul>
          
          <h2>Timeline</h2>
          <p><strong>Phase 1 (Month 1-2):</strong> Strategy development and initial setup</p>
          <p><strong>Phase 2 (Month 3-4):</strong> Campaign launch and optimization</p>
          <p><strong>Phase 3 (Month 5-6):</strong> Scale and performance enhancement</p>
          
          <h2>Investment</h2>
          <p>Total Project Investment: <strong>$25,000</strong></p>
          <p>Monthly Retainer: <strong>$4,999</strong></p>
        `
      },
      {
        id: 2,
        title: 'Website Redesign Project',
        type: 'Development Proposal',
        status: 'approved',
        value: 15000,
        created_at: new Date('2024-01-10').toISOString(),
        expires_at: null,
        content: `
          <h1>Website Redesign Project</h1>
          <h2>Project Overview</h2>
          <p>Complete redesign of your corporate website with modern design, improved UX, and mobile optimization.</p>
          
          <h2>Deliverables</h2>
          <ul>
            <li>Modern responsive design</li>
            <li>Content management system</li>
            <li>SEO optimization</li>
            <li>Performance optimization</li>
            <li>Analytics integration</li>
          </ul>
        `
      }
    ]
  }

  getMockContracts() {
    return [
      {
        id: 1,
        title: 'Digital Marketing Services Agreement',
        status: 'signed',
        value: 59988,
        start_date: new Date('2024-01-01').toISOString(),
        end_date: new Date('2024-12-31').toISOString(),
        progress: 75,
        created_at: new Date('2024-01-01').toISOString(),
        content: `
          <h1>Digital Marketing Services Agreement</h1>
          <h2>Service Terms</h2>
          <p>This agreement outlines the terms for comprehensive digital marketing services including SEO, PPC, and social media management.</p>
          
          <h2>Payment Terms</h2>
          <p>Monthly retainer of $4,999 payable on the 1st of each month.</p>
          
          <h2>Service Level Agreement</h2>
          <ul>
            <li>Monthly reporting and analysis</li>
            <li>Bi-weekly strategy calls</li>
            <li>24/7 campaign monitoring</li>
            <li>Dedicated account manager</li>
          </ul>
        `
      }
    ]
  }

  getMockDocuments() {
    return [
      {
        id: 1,
        title: 'Brand Guidelines 2024',
        type: 'Brand Asset',
        status: 'approved',
        size: '2.4 MB',
        created_at: new Date('2024-01-20').toISOString(),
        content: '<h1>Brand Guidelines</h1><p>Your complete brand guidelines document...</p>'
      },
      {
        id: 2,
        title: 'Q1 Marketing Report',
        type: 'Report',
        status: 'pending',
        size: '1.8 MB',
        created_at: new Date('2024-01-18').toISOString(),
        content: '<h1>Q1 Marketing Report</h1><p>Quarterly performance analysis and insights...</p>'
      },
      {
        id: 3,
        title: 'Campaign Creative Assets',
        type: 'Creative',
        status: 'approved',
        size: '15.2 MB',
        created_at: new Date('2024-01-15').toISOString(),
        content: '<h1>Campaign Creative Assets</h1><p>Your approved creative assets for the upcoming campaign...</p>'
      },
      {
        id: 4,
        title: 'SEO Strategy Document',
        type: 'Strategy',
        status: 'draft',
        size: '3.1 MB',
        created_at: new Date('2024-01-12').toISOString(),
        content: '<h1>SEO Strategy Document</h1><p>Comprehensive SEO strategy and implementation plan...</p>'
      }
    ]
  }

  getMockMessages() {
    return [
      {
        id: 1,
        sender: 'John Smith',
        content: 'Hi Sarah! The new campaign assets are ready for your review. I\'ve uploaded them to the documents section.',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
      },
      {
        id: 2,
        sender: 'You',
        content: 'Thanks John! I\'ll review them today. Can we schedule a call to discuss the Q2 strategy?',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
      },
      {
        id: 3,
        sender: 'Marketing Team',
        content: 'Your campaign performance this month has been exceptional! CTR increased by 45% and conversions are up 67%.',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      },
      {
        id: 4,
        sender: 'Sarah Johnson',
        content: 'The website redesign looks amazing! My team is very impressed with the user experience improvements.',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
      }
    ]
  }

  // Analytics methods
  async getClientAnalytics() {
    return {
      totalDocuments: 12,
      pendingApprovals: 3,
      completedProjects: 5,
      activeContracts: 2,
      messagesSent: 28,
      averageResponseTime: '2.4 hours'
    }
  }

  // Notification methods
  async markNotificationAsRead(notificationId) {
    try {
      await supabaseService.update('notifications_crm2024', notificationId, {
        read: true,
        read_at: new Date().toISOString()
      })
      return true
    } catch (error) {
      console.error('Error marking notification as read:', error)
      return false
    }
  }

  // File upload simulation
  async uploadDocument(file, metadata) {
    try {
      // In production, this would upload to Supabase Storage
      const document = await supabaseService.create(this.documentsTableName, {
        title: metadata.title || file.name,
        type: metadata.type || 'Document',
        status: 'pending',
        size: this.formatFileSize(file.size),
        original_name: file.name,
        mime_type: file.type,
        content: '<p>Document content will be processed...</p>'
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'document',
        document.id,
        `Document uploaded: ${document.title}`,
        { size: document.size, type: document.type }
      )

      return document
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export const clientPortalService = new ClientPortalService()
export default clientPortalService