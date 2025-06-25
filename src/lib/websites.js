// Multi-Site Management Service
export class WebsiteService {
  constructor() {
    this.websites = this.loadWebsites()
    this.funnels = this.loadFunnels()
    this.microsites = this.loadMicrosites()
  }

  loadWebsites() {
    try {
      const stored = localStorage.getItem('cyborgcrm_websites')
      return stored ? JSON.parse(stored) : this.getDefaultWebsites()
    } catch (error) {
      console.error('Error loading websites:', error)
      return this.getDefaultWebsites()
    }
  }

  loadFunnels() {
    try {
      const stored = localStorage.getItem('cyborgcrm_funnels')
      return stored ? JSON.parse(stored) : this.getDefaultFunnels()
    } catch (error) {
      console.error('Error loading funnels:', error)
      return this.getDefaultFunnels()
    }
  }

  loadMicrosites() {
    try {
      const stored = localStorage.getItem('cyborgcrm_microsites')
      return stored ? JSON.parse(stored) : this.getDefaultMicrosites()
    } catch (error) {
      console.error('Error loading microsites:', error)
      return this.getDefaultMicrosites()
    }
  }

  getDefaultWebsites() {
    return [
      {
        id: 1,
        name: 'Main Business Website',
        description: 'Primary business website with full service offerings',
        template: 'business-professional',
        domain: 'cyborgcrm.com',
        status: 'live',
        mobileOptimized: true,
        seoOptimized: true,
        fastLoading: true,
        analytics: {
          visitors: '12.5k',
          conversions: 234,
          speed: 1.2
        },
        createdAt: new Date().toISOString(),
        lastDeployed: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Agency Portfolio',
        description: 'Showcase of successful client projects and case studies',
        template: 'creative-portfolio',
        domain: 'portfolio.cyborgcrm.com',
        status: 'live',
        mobileOptimized: true,
        seoOptimized: true,
        fastLoading: true,
        analytics: {
          visitors: '8.9k',
          conversions: 156,
          speed: 0.9
        },
        createdAt: new Date().toISOString(),
        lastDeployed: new Date().toISOString()
      }
    ]
  }

  getDefaultFunnels() {
    return [
      {
        id: 1,
        name: 'Lead Generation Funnel',
        description: 'High-converting funnel for capturing marketing qualified leads',
        template: 'lead-gen-pro',
        domain: 'leads.cyborgcrm.com',
        status: 'live',
        mobileOptimized: true,
        seoOptimized: true,
        fastLoading: true,
        analytics: {
          visitors: '15.2k',
          conversions: 892,
          speed: 0.8
        },
        steps: [
          { name: 'Landing Page', conversionRate: 25.8 },
          { name: 'Lead Magnet', conversionRate: 67.3 },
          { name: 'Thank You Page', conversionRate: 95.2 }
        ],
        createdAt: new Date().toISOString(),
        lastDeployed: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Webinar Registration',
        description: 'Automated webinar registration and follow-up sequence',
        template: 'webinar-funnel',
        domain: 'webinar.cyborgcrm.com',
        status: 'deploying',
        mobileOptimized: true,
        seoOptimized: true,
        fastLoading: true,
        analytics: {
          visitors: '3.7k',
          conversions: 445,
          speed: 1.1
        },
        steps: [
          { name: 'Registration Page', conversionRate: 18.4 },
          { name: 'Confirmation Page', conversionRate: 89.7 },
          { name: 'Reminder Sequence', conversionRate: 72.1 }
        ],
        createdAt: new Date().toISOString(),
        lastDeployed: null
      }
    ]
  }

  getDefaultMicrosites() {
    return [
      {
        id: 1,
        name: 'Holiday Campaign 2024',
        description: 'Special holiday marketing campaign landing page',
        template: 'campaign-holiday',
        domain: 'holiday2024.cyborgcrm.com',
        status: 'live',
        mobileOptimized: true,
        seoOptimized: false,
        fastLoading: true,
        analytics: {
          visitors: '5.8k',
          conversions: 234,
          speed: 0.7
        },
        campaign: {
          startDate: '2024-11-15',
          endDate: '2024-12-31',
          budget: 15000,
          spent: 8750
        },
        createdAt: new Date().toISOString(),
        lastDeployed: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Product Launch Page',
        description: 'Dedicated page for new AI marketing tool launch',
        template: 'product-launch',
        domain: 'ai-tools.cyborgcrm.com',
        status: 'draft',
        mobileOptimized: true,
        seoOptimized: true,
        fastLoading: true,
        analytics: {
          visitors: '0',
          conversions: 0,
          speed: 0.6
        },
        campaign: {
          startDate: '2024-02-01',
          endDate: '2024-03-31',
          budget: 25000,
          spent: 0
        },
        createdAt: new Date().toISOString(),
        lastDeployed: null
      }
    ]
  }

  async createWebsite(websiteData) {
    const newWebsite = {
      id: Date.now(),
      ...websiteData,
      status: 'draft',
      analytics: {
        visitors: '0',
        conversions: 0,
        speed: Math.random() * 0.5 + 0.5 // Random speed between 0.5-1.0s
      },
      createdAt: new Date().toISOString(),
      lastDeployed: null
    }

    this.websites.unshift(newWebsite)
    this.saveWebsites()
    return newWebsite
  }

  async createFunnel(funnelData) {
    const newFunnel = {
      id: Date.now(),
      ...funnelData,
      status: 'draft',
      analytics: {
        visitors: '0',
        conversions: 0,
        speed: Math.random() * 0.5 + 0.5
      },
      steps: this.generateFunnelSteps(funnelData.template),
      createdAt: new Date().toISOString(),
      lastDeployed: null
    }

    this.funnels.unshift(newFunnel)
    this.saveFunnels()
    return newFunnel
  }

  async createMicrosite(micrositeData) {
    const newMicrosite = {
      id: Date.now(),
      ...micrositeData,
      status: 'draft',
      analytics: {
        visitors: '0',
        conversions: 0,
        speed: Math.random() * 0.3 + 0.4 // Microsites are typically faster
      },
      campaign: {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days
        budget: 10000,
        spent: 0
      },
      createdAt: new Date().toISOString(),
      lastDeployed: null
    }

    this.microsites.unshift(newMicrosite)
    this.saveMicrosites()
    return newMicrosite
  }

  generateFunnelSteps(template) {
    const stepTemplates = {
      'lead-gen': [
        { name: 'Landing Page', conversionRate: 0 },
        { name: 'Lead Capture', conversionRate: 0 },
        { name: 'Thank You Page', conversionRate: 0 }
      ],
      'sales': [
        { name: 'Sales Page', conversionRate: 0 },
        { name: 'Order Form', conversionRate: 0 },
        { name: 'Upsell Page', conversionRate: 0 },
        { name: 'Confirmation', conversionRate: 0 }
      ],
      'webinar': [
        { name: 'Registration Page', conversionRate: 0 },
        { name: 'Confirmation Page', conversionRate: 0 },
        { name: 'Reminder Sequence', conversionRate: 0 }
      ],
      'squeeze': [
        { name: 'Squeeze Page', conversionRate: 0 },
        { name: 'Download Page', conversionRate: 0 }
      ]
    }

    return stepTemplates[template] || stepTemplates['lead-gen']
  }

  async deploySite(siteId, type) {
    let site
    let collection

    switch (type) {
      case 'website':
        site = this.websites.find(w => w.id === siteId)
        collection = this.websites
        break
      case 'funnel':
        site = this.funnels.find(f => f.id === siteId)
        collection = this.funnels
        break
      case 'microsite':
        site = this.microsites.find(m => m.id === siteId)
        collection = this.microsites
        break
      default:
        throw new Error('Invalid site type')
    }

    if (!site) throw new Error('Site not found')

    // Simulate deployment process
    site.status = 'deploying'
    this.saveSites(type)

    // Simulate deployment delay
    setTimeout(() => {
      site.status = 'live'
      site.lastDeployed = new Date().toISOString()
      this.saveSites(type)
    }, 3000)

    return site
  }

  async updateSite(siteId, type, updates) {
    let site

    switch (type) {
      case 'website':
        site = this.websites.find(w => w.id === siteId)
        break
      case 'funnel':
        site = this.funnels.find(f => f.id === siteId)
        break
      case 'microsite':
        site = this.microsites.find(m => m.id === siteId)
        break
    }

    if (!site) throw new Error('Site not found')

    Object.assign(site, updates, {
      updatedAt: new Date().toISOString()
    })

    this.saveSites(type)
    return site
  }

  async deleteSite(siteId, type) {
    switch (type) {
      case 'website':
        this.websites = this.websites.filter(w => w.id !== siteId)
        this.saveWebsites()
        break
      case 'funnel':
        this.funnels = this.funnels.filter(f => f.id !== siteId)
        this.saveFunnels()
        break
      case 'microsite':
        this.microsites = this.microsites.filter(m => m.id !== siteId)
        this.saveMicrosites()
        break
    }

    return true
  }

  // Performance optimization methods
  async optimizeForMobile(siteId, type) {
    const site = this.getSiteById(siteId, type)
    if (!site) throw new Error('Site not found')

    site.mobileOptimized = true
    site.analytics.speed = Math.max(site.analytics.speed - 0.2, 0.3)

    this.saveSites(type)
    return site
  }

  async optimizeForSpeed(siteId, type) {
    const site = this.getSiteById(siteId, type)
    if (!site) throw new Error('Site not found')

    site.fastLoading = true
    site.analytics.speed = Math.max(site.analytics.speed - 0.3, 0.2)

    this.saveSites(type)
    return site
  }

  getSiteById(siteId, type) {
    switch (type) {
      case 'website':
        return this.websites.find(w => w.id === siteId)
      case 'funnel':
        return this.funnels.find(f => f.id === siteId)
      case 'microsite':
        return this.microsites.find(m => m.id === siteId)
      default:
        return null
    }
  }

  getWebsites() {
    return this.websites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getFunnels() {
    return this.funnels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getMicrosites() {
    return this.microsites.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getAllSites() {
    return [
      ...this.websites.map(w => ({ ...w, type: 'website' })),
      ...this.funnels.map(f => ({ ...f, type: 'funnel' })),
      ...this.microsites.map(m => ({ ...m, type: 'microsite' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  getPerformanceStats() {
    const allSites = this.getAllSites()
    
    return {
      totalSites: allSites.length,
      liveSites: allSites.filter(s => s.status === 'live').length,
      totalVisitors: allSites.reduce((sum, site) => {
        const visitors = typeof site.analytics.visitors === 'string' 
          ? parseFloat(site.analytics.visitors.replace('k', '')) * 1000
          : site.analytics.visitors
        return sum + visitors
      }, 0),
      averageSpeed: allSites.reduce((sum, site) => sum + site.analytics.speed, 0) / allSites.length,
      mobileOptimized: allSites.filter(s => s.mobileOptimized).length,
      seoOptimized: allSites.filter(s => s.seoOptimized).length
    }
  }

  saveSites(type) {
    switch (type) {
      case 'website':
        this.saveWebsites()
        break
      case 'funnel':
        this.saveFunnels()
        break
      case 'microsite':
        this.saveMicrosites()
        break
    }
  }

  saveWebsites() {
    localStorage.setItem('cyborgcrm_websites', JSON.stringify(this.websites))
  }

  saveFunnels() {
    localStorage.setItem('cyborgcrm_funnels', JSON.stringify(this.funnels))
  }

  saveMicrosites() {
    localStorage.setItem('cyborgcrm_microsites', JSON.stringify(this.microsites))
  }
}

export const websiteService = new WebsiteService()
export default websiteService