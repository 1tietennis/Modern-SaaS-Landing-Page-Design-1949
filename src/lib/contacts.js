// Contact Management Service
export class ContactService {
  constructor() {
    this.contacts = this.loadContacts()
  }

  loadContacts() {
    try {
      const stored = localStorage.getItem('cyborgcrm_contacts')
      return stored ? JSON.parse(stored) : this.getDefaultContacts()
    } catch (error) {
      console.error('Error loading contacts:', error)
      return this.getDefaultContacts()
    }
  }

  getDefaultContacts() {
    return [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@techcorp.com',
        phone: '+1 (555) 123-4567',
        company: 'TechCorp Inc',
        position: 'CEO',
        tags: ['lead', 'high-value'],
        priority: 'high',
        notes: 'Interested in enterprise package. Follow up next week.',
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike@dataflow.com',
        phone: '+1 (555) 234-5678',
        company: 'DataFlow Solutions',
        position: 'CTO',
        tags: ['customer', 'technical'],
        priority: 'medium',
        notes: 'Current customer, looking to expand services.',
        createdAt: new Date().toISOString(),
        lastContact: new Date().toISOString()
      }
    ]
  }

  async createContact(contactData) {
    const newContact = {
      id: Date.now(),
      ...contactData,
      tags: contactData.tags || [],
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    }

    this.contacts.unshift(newContact)
    this.saveContacts()
    return newContact
  }

  async updateContact(contactId, updates) {
    const contactIndex = this.contacts.findIndex(c => c.id === contactId)
    if (contactIndex === -1) throw new Error('Contact not found')

    this.contacts[contactIndex] = {
      ...this.contacts[contactIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    }

    this.saveContacts()
    return this.contacts[contactIndex]
  }

  async deleteContact(contactId) {
    this.contacts = this.contacts.filter(c => c.id !== contactId)
    this.saveContacts()
    return true
  }

  getAllContacts() {
    return this.contacts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  searchContacts(query) {
    return this.contacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase()) ||
      contact.company.toLowerCase().includes(query.toLowerCase())
    )
  }

  getContactsByTag(tag) {
    return this.contacts.filter(contact => contact.tags.includes(tag))
  }

  addTag(contactId, tag) {
    const contact = this.contacts.find(c => c.id === contactId)
    if (contact && !contact.tags.includes(tag)) {
      contact.tags.push(tag)
      this.saveContacts()
    }
  }

  removeTag(contactId, tag) {
    const contact = this.contacts.find(c => c.id === contactId)
    if (contact) {
      contact.tags = contact.tags.filter(t => t !== tag)
      this.saveContacts()
    }
  }

  saveContacts() {
    localStorage.setItem('cyborgcrm_contacts', JSON.stringify(this.contacts))
  }
}

export const contactService = new ContactService()
export default contactService