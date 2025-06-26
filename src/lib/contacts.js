// Contact Management Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class ContactService {
  constructor() {
    this.tableName = 'contacts_crm2024'
  }

  async createContact(contactData) {
    try {
      const contact = await supabaseService.create(this.tableName, {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone || '',
        company: contactData.company || '',
        position: contactData.position || '',
        tags: contactData.tags || [],
        priority: contactData.priority || 'medium',
        notes: contactData.notes || '',
        lead_score: this.calculateLeadScore(contactData),
        last_contact: new Date().toISOString(),
        source: contactData.source || 'manual',
        status: 'active'
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'contact',
        contact.id,
        `Created contact: ${contact.name}`,
        { email: contact.email, company: contact.company }
      )

      return contact
    } catch (error) {
      console.error('Error creating contact:', error)
      throw error
    }
  }

  async getAllContacts() {
    return await supabaseService.getAll(this.tableName)
  }

  async updateContact(contactId, updates) {
    try {
      const contact = await supabaseService.update(this.tableName, contactId, {
        ...updates,
        lead_score: updates.lead_score || this.calculateLeadScore(updates)
      })

      // Log activity
      await supabaseService.logActivity(
        'update',
        'contact',
        contactId,
        `Updated contact: ${contact.name}`,
        updates
      )

      return contact
    } catch (error) {
      console.error('Error updating contact:', error)
      throw error
    }
  }

  async deleteContact(contactId) {
    try {
      const contact = await supabaseService.getById(this.tableName, contactId)
      await supabaseService.delete(this.tableName, contactId)

      // Log activity
      await supabaseService.logActivity(
        'delete',
        'contact',
        contactId,
        `Deleted contact: ${contact?.name || 'Unknown'}`,
        { contact_id: contactId }
      )

      return true
    } catch (error) {
      console.error('Error deleting contact:', error)
      throw error
    }
  }

  async searchContacts(query) {
    try {
      const contacts = await this.getAllContacts()
      return contacts.filter(contact =>
        contact.name.toLowerCase().includes(query.toLowerCase()) ||
        contact.email.toLowerCase().includes(query.toLowerCase()) ||
        contact.company.toLowerCase().includes(query.toLowerCase())
      )
    } catch (error) {
      console.error('Error searching contacts:', error)
      return []
    }
  }

  calculateLeadScore(contactData) {
    let score = 0
    
    // Email domain scoring
    if (contactData.email) {
      const domain = contactData.email.split('@')[1]
      if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com'].includes(domain)) {
        score += 20 // Business email
      }
    }

    // Company presence
    if (contactData.company) score += 25

    // Phone number
    if (contactData.phone) score += 15

    // Position/title
    if (contactData.position) {
      const title = contactData.position.toLowerCase()
      if (title.includes('ceo') || title.includes('founder')) score += 30
      else if (title.includes('manager') || title.includes('director')) score += 20
      else score += 10
    }

    return Math.min(score, 100)
  }
}

export const contactService = new ContactService()
export default contactService