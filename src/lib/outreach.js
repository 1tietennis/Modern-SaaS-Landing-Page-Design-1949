// B2B Outreach Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class OutreachService {
  constructor() {
    this.prospectsTableName = 'prospects_crm2024'
    this.campaignsTableName = 'outreach_campaigns_crm2024'
    this.sequencesTableName = 'outreach_sequences_crm2024'
    this.messagesTableName = 'outreach_messages_crm2024'
  }

  async getProspects() {
    try {
      const prospects = await supabaseService.getAll(this.prospectsTableName)
      return prospects.length > 0 ? prospects : this.getMockProspects()
    } catch (error) {
      console.error('Error fetching prospects:', error)
      return this.getMockProspects()
    }
  }

  async createProspect(prospectData) {
    try {
      const prospect = await supabaseService.create(this.prospectsTableName, {
        name: prospectData.name,
        email: prospectData.email,
        title: prospectData.title || '',
        company: prospectData.company || '',
        industry: prospectData.industry || '',
        linkedin_url: prospectData.linkedin_url || '',
        phone: prospectData.phone || '',
        status: 'new',
        lead_score: this.calculateLeadScore(prospectData),
        last_contact: null,
        notes: prospectData.notes || '',
        tags: prospectData.tags || []
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'prospect',
        prospect.id,
        `Added new prospect: ${prospect.name}`,
        { company: prospect.company, lead_score: prospect.lead_score }
      )

      return prospect
    } catch (error) {
      console.error('Error creating prospect:', error)
      throw error
    }
  }

  async getCampaigns() {
    try {
      const campaigns = await supabaseService.getAll(this.campaignsTableName)
      return campaigns.length > 0 ? campaigns : this.getMockCampaigns()
    } catch (error) {
      console.error('Error fetching campaigns:', error)
      return this.getMockCampaigns()
    }
  }

  async createCampaign(campaignData) {
    try {
      const campaign = await supabaseService.create(this.campaignsTableName, {
        name: campaignData.name,
        description: campaignData.description || '',
        channels: campaignData.channels || [],
        sequence_id: campaignData.sequence_id || null,
        target_criteria: campaignData.target_criteria || {},
        personalization: campaignData.personalization || {},
        status: 'draft',
        total_prospects: 0,
        messages_sent: 0,
        replies: 0,
        response_rate: 0
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'campaign',
        campaign.id,
        `Created outreach campaign: ${campaign.name}`,
        { channels: campaign.channels }
      )

      return campaign
    } catch (error) {
      console.error('Error creating campaign:', error)
      throw error
    }
  }

  async getSequences() {
    try {
      const sequences = await supabaseService.getAll(this.sequencesTableName)
      return sequences.length > 0 ? sequences : this.getMockSequences()
    } catch (error) {
      console.error('Error fetching sequences:', error)
      return this.getMockSequences()
    }
  }

  async createSequence(sequenceData) {
    try {
      const sequence = await supabaseService.create(this.sequencesTableName, {
        name: sequenceData.name,
        description: sequenceData.description || '',
        steps: sequenceData.steps || [],
        active_prospects: 0,
        completion_rate: 0,
        response_rate: 0
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'sequence',
        sequence.id,
        `Created message sequence: ${sequence.name}`,
        { steps: sequence.steps.length }
      )

      return sequence
    } catch (error) {
      console.error('Error creating sequence:', error)
      throw error
    }
  }

  async startSequence(prospectId, sequenceId) {
    try {
      // Update prospect status
      await supabaseService.update(this.prospectsTableName, prospectId, {
        status: 'contacted',
        last_contact: new Date().toISOString(),
        current_sequence: sequenceId,
        sequence_step: 1
      })

      // Create first message
      const sequence = await supabaseService.getById(this.sequencesTableName, sequenceId)
      const prospect = await supabaseService.getById(this.prospectsTableName, prospectId)
      
      if (sequence && sequence.steps.length > 0) {
        const firstStep = sequence.steps[0]
        await this.sendMessage(prospectId, firstStep, prospect)
      }

      // Log activity
      await supabaseService.logActivity(
        'start',
        'sequence',
        sequenceId,
        `Started sequence for prospect: ${prospect.name}`,
        { prospect_id: prospectId }
      )

      return true
    } catch (error) {
      console.error('Error starting sequence:', error)
      throw error
    }
  }

  async sendMessage(prospectId, step, prospect) {
    try {
      const personalizedContent = this.personalizeMessage(step.content, prospect)
      const personalizedSubject = step.subject ? this.personalizeMessage(step.subject, prospect) : null

      const message = await supabaseService.create(this.messagesTableName, {
        prospect_id: prospectId,
        channel: step.channel,
        type: step.type,
        subject: personalizedSubject,
        content: personalizedContent,
        sent_at: new Date().toISOString(),
        status: 'sent'
      })

      // Simulate sending (in production, integrate with email/LinkedIn APIs)
      console.log(`📧 ${step.channel.toUpperCase()} sent to ${prospect.name}:`)
      console.log(`Subject: ${personalizedSubject}`)
      console.log(`Content: ${personalizedContent.substring(0, 100)}...`)

      return message
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  personalizeMessage(template, prospect) {
    const variables = {
      '{{first_name}}': prospect.name.split(' ')[0],
      '{{last_name}}': prospect.name.split(' ').slice(1).join(' '),
      '{{company_name}}': prospect.company,
      '{{job_title}}': prospect.title,
      '{{industry}}': prospect.industry,
      '{{recent_activity}}': this.getRecentActivity(prospect),
      '{{pain_point}}': this.getPainPoint(prospect.industry),
      '{{similar_company}}': this.getSimilarCompany(prospect.industry),
      '{{specific_result}}': this.getSpecificResult(prospect.industry),
      '{{our_company}}': 'CyborgCRM',
      '{{sender_name}}': 'John Smith',
      '{{case_study_link}}': 'https://cyborgcrm.com/case-studies'
    }

    let personalizedMessage = template
    Object.entries(variables).forEach(([variable, value]) => {
      personalizedMessage = personalizedMessage.replace(new RegExp(variable, 'g'), value)
    })

    return personalizedMessage
  }

  getRecentActivity(prospect) {
    const activities = [
      'expanding their team',
      'launching new products',
      'entering new markets',
      'raising funding',
      'implementing new technology'
    ]
    return activities[Math.floor(Math.random() * activities.length)]
  }

  getPainPoint(industry) {
    const painPoints = {
      'Technology': 'scaling customer acquisition',
      'Healthcare': 'patient engagement',
      'Finance': 'regulatory compliance',
      'Manufacturing': 'operational efficiency',
      'Retail': 'customer retention'
    }
    return painPoints[industry] || 'business growth'
  }

  getSimilarCompany(industry) {
    const companies = {
      'Technology': 'TechFlow Solutions',
      'Healthcare': 'MedCare Plus',
      'Finance': 'FinanceFirst',
      'Manufacturing': 'ProManufacturing',
      'Retail': 'RetailMax'
    }
    return companies[industry] || 'GrowthCorp'
  }

  getSpecificResult(industry) {
    const results = {
      'Technology': 'increase lead generation by 300%',
      'Healthcare': 'improve patient satisfaction by 45%',
      'Finance': 'reduce compliance costs by 60%',
      'Manufacturing': 'optimize production efficiency by 25%',
      'Retail': 'boost customer retention by 40%'
    }
    return results[industry] || 'accelerate business growth by 200%'
  }

  calculateLeadScore(prospect) {
    let score = 0

    // Company size (LinkedIn followers, employee count, etc.)
    if (prospect.company_size === 'enterprise') score += 30
    else if (prospect.company_size === 'growth') score += 20
    else score += 10

    // Job title importance
    const seniorTitles = ['ceo', 'cto', 'cmo', 'vp', 'director', 'head']
    const title = prospect.title.toLowerCase()
    if (seniorTitles.some(t => title.includes(t))) score += 25

    // Industry relevance
    const targetIndustries = ['technology', 'saas', 'software']
    if (targetIndustries.includes(prospect.industry.toLowerCase())) score += 20

    // Email domain (business vs personal)
    if (prospect.email && !['gmail', 'yahoo', 'hotmail'].some(domain => 
      prospect.email.includes(domain))) score += 15

    // LinkedIn profile completeness
    if (prospect.linkedin_url) score += 10

    return Math.min(score, 100)
  }

  async getAnalytics() {
    try {
      const prospects = await this.getProspects()
      const campaigns = await this.getCampaigns()
      const messages = await supabaseService.getAll(this.messagesTableName)

      return {
        total_prospects: prospects.length,
        messages_sent: messages.length,
        response_rate: messages.length > 0 ? Math.round((messages.filter(m => m.status === 'replied').length / messages.length) * 100) : 0,
        qualified_leads: prospects.filter(p => p.status === 'qualified').length,
        active_campaigns: campaigns.filter(c => c.status === 'active').length
      }
    } catch (error) {
      console.error('Error getting analytics:', error)
      return this.getMockAnalytics()
    }
  }

  // Mock data methods
  getMockProspects() {
    return [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.johnson@techcorp.com',
        title: 'VP of Marketing',
        company: 'TechCorp Inc.',
        industry: 'Technology',
        linkedin_url: 'https://linkedin.com/in/sarahjohnson',
        status: 'new',
        lead_score: 85,
        last_contact: null,
        tags: ['enterprise', 'high-priority']
      },
      {
        id: 2,
        name: 'Michael Chen',
        email: 'michael@dataflow.com',
        title: 'CTO',
        company: 'DataFlow Solutions',
        industry: 'Technology',
        linkedin_url: 'https://linkedin.com/in/michaelchen',
        status: 'contacted',
        lead_score: 92,
        last_contact: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['decision-maker', 'warm']
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.r@growthcorp.com',
        title: 'Head of Growth',
        company: 'GrowthCorp',
        industry: 'SaaS',
        linkedin_url: 'https://linkedin.com/in/emilyrodriguez',
        status: 'responded',
        lead_score: 78,
        last_contact: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        tags: ['interested', 'follow-up']
      }
    ]
  }

  getMockCampaigns() {
    return [
      {
        id: 1,
        name: 'Q1 SaaS Outreach',
        description: 'Targeting SaaS companies for lead generation',
        channels: ['email', 'linkedin'],
        status: 'active',
        total_prospects: 150,
        messages_sent: 450,
        replies: 32,
        response_rate: 7.1
      },
      {
        id: 2,
        name: 'Enterprise Expansion',
        description: 'Reaching out to enterprise clients',
        channels: ['email'],
        status: 'paused',
        total_prospects: 75,
        messages_sent: 225,
        replies: 18,
        response_rate: 8.0
      }
    ]
  }

  getMockSequences() {
    return [
      {
        id: 1,
        name: 'SaaS Introduction Sequence',
        description: 'Multi-touch sequence for SaaS prospects',
        steps: [
          {
            id: 1,
            channel: 'email',
            type: 'introduction',
            delay_days: 0,
            subject: 'Quick question about {{company_name}}',
            content: 'Hi {{first_name}},\n\nI noticed {{company_name}} is {{recent_activity}}...'
          },
          {
            id: 2,
            channel: 'linkedin',
            type: 'connection',
            delay_days: 2,
            content: 'Hi {{first_name}}, I\'d love to connect with you...'
          }
        ],
        active_prospects: 45,
        completion_rate: 78,
        response_rate: 12.5
      }
    ]
  }

  getMockAnalytics() {
    return {
      total_prospects: 328,
      messages_sent: 1250,
      response_rate: 8.5,
      qualified_leads: 42,
      active_campaigns: 3
    }
  }
}

export const outreachService = new OutreachService()
export default outreachService