// SMS Service Configuration
const SMS_CONFIG = {
  // Twilio Configuration
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'your_twilio_account_sid',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'your_twilio_auth_token',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '+1234567890'
  },
  // Default notification numbers
  notificationNumbers: [
    '+1234567890', // Sales team
    '+1234567891', // Support team
    '+1234567892'  // Manager
  ]
}

// SMS Notification Templates
const SMS_TEMPLATES = {
  newLead: (leadData) => `
🚀 NEW LEAD ALERT!
Name: ${leadData.firstName} ${leadData.lastName}
Email: ${leadData.email}
Phone: ${leadData.phone}
Service: ${leadData.service}
Ticket: #${leadData.ticketNumber}
Time: ${new Date(leadData.timestamp).toLocaleString()}
  `.trim(),
  
  newTicket: (ticketData) => `
🎫 NEW SUPPORT TICKET
Ticket: #${ticketData.ticketNumber}
Customer: ${ticketData.customerName}
Priority: ${ticketData.priority}
Subject: ${ticketData.subject}
Time: ${new Date(ticketData.createdAt).toLocaleString()}
  `.trim(),
  
  urgentInquiry: (inquiryData) => `
🚨 URGENT INQUIRY
Customer: ${inquiryData.customerName}
Email: ${inquiryData.email}
Phone: ${inquiryData.phone}
Issue: ${inquiryData.issue}
Ticket: #${inquiryData.ticketNumber}
RESPOND ASAP!
  `.trim(),
  
  leadStatusUpdate: (leadData) => `
📈 LEAD UPDATE
Ticket: #${leadData.ticketNumber}
Customer: ${leadData.customerName}
Status: ${leadData.status}
Next Action: ${leadData.nextAction}
  `.trim()
}

export class SMSService {
  constructor() {
    this.isConfigured = this.checkConfiguration()
    this.mockMode = !this.isConfigured
  }

  checkConfiguration() {
    return SMS_CONFIG.twilio.accountSid !== 'your_twilio_account_sid' &&
           SMS_CONFIG.twilio.authToken !== 'your_twilio_auth_token' &&
           SMS_CONFIG.twilio.phoneNumber !== '+1234567890'
  }

  async sendSMS(phoneNumber, message) {
    try {
      if (this.mockMode) {
        console.log('📱 SMS Mock Mode - Would send to:', phoneNumber)
        console.log('📱 Message:', message)
        return { success: true, messageId: 'mock_' + Date.now(), mock: true }
      }

      // In production, use Twilio
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          from: SMS_CONFIG.twilio.phoneNumber
        })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('SMS sending error:', error)
      return { success: false, error: error.message }
    }
  }

  async notifyNewLead(leadData) {
    const message = SMS_TEMPLATES.newLead(leadData)
    const results = []

    for (const phoneNumber of SMS_CONFIG.notificationNumbers) {
      const result = await this.sendSMS(phoneNumber, message)
      results.push({ phoneNumber, result })
    }

    return results
  }

  async notifyNewTicket(ticketData) {
    const message = SMS_TEMPLATES.newTicket(ticketData)
    const results = []

    for (const phoneNumber of SMS_CONFIG.notificationNumbers) {
      const result = await this.sendSMS(phoneNumber, message)
      results.push({ phoneNumber, result })
    }

    return results
  }

  async notifyUrgentInquiry(inquiryData) {
    const message = SMS_TEMPLATES.urgentInquiry(inquiryData)
    const results = []

    // Send to all notification numbers for urgent inquiries
    for (const phoneNumber of SMS_CONFIG.notificationNumbers) {
      const result = await this.sendSMS(phoneNumber, message)
      results.push({ phoneNumber, result })
    }

    return results
  }

  async sendCustomSMS(phoneNumber, message) {
    return await this.sendSMS(phoneNumber, message)
  }

  getStatus() {
    return {
      configured: this.isConfigured,
      mockMode: this.mockMode,
      notificationNumbers: SMS_CONFIG.notificationNumbers.length
    }
  }
}

export const smsService = new SMSService()
export default smsService