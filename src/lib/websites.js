// Multi-Site Management Service with Supabase Integration
import { supabaseService } from './supabaseService'

export class WebsiteService {
  constructor() {
    this.tableName = 'websites_crm2024'
  }

  async createWebsite(websiteData) {
    try {
      const website = await supabaseService.create(this.tableName, {
        name: websiteData.name,
        description: websiteData.description || '',
        type: 'website',
        template: websiteData.template || 'business',
        domain: websiteData.domain || '',
        status: 'draft',
        mobile_optimized: websiteData.mobileOptimized || true,
        seo_optimized: websiteData.seoOptimized || true,
        fast_loading: websiteData.fastLoading || true,
        analytics: {
          visitors: '0',
          conversions: 0,
          speed: Math.random() * 0.5 + 0.5 // Random speed between 0.5-1.0s
        }
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'website',
        website.id,
        `Created website: ${website.name}`,
        { template: website.template, domain: website.domain }
      )

      return website
    } catch (error) {
      console.error('Error creating website:', error)
      throw error
    }
  }

  async createFunnel(funnelData) {
    try {
      const funnel = await supabaseService.create(this.tableName, {
        name: funnelData.name,
        description: funnelData.description || '',
        type: 'funnel',
        template: funnelData.template || 'lead-gen',
        domain: funnelData.domain || '',
        status: 'draft',
        mobile_optimized: funnelData.mobileOptimized || true,
        seo_optimized: funnelData.seoOptimized || true,
        fast_loading: funnelData.fastLoading || true,
        analytics: {
          visitors: '0',
          conversions: 0,
          speed: Math.random() * 0.5 + 0.5
        },
        steps: this.generateFunnelSteps(funnelData.template)
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'funnel',
        funnel.id,
        `Created funnel: ${funnel.name}`,
        { template: funnel.template, domain: funnel.domain }
      )

      return funnel
    } catch (error) {
      console.error('Error creating funnel:', error)
      throw error
    }
  }

  async createMicrosite(micrositeData) {
    try {
      const microsite = await supabaseService.create(this.tableName, {
        name: micrositeData.name,
        description: micrositeData.description || '',
        type: 'microsite',
        template: micrositeData.template || 'landing',
        domain: micrositeData.domain || '',
        status: 'draft',
        mobile_optimized: micrositeData.mobileOptimized || true,
        seo_optimized: micrositeData.seoOptimized || true,
        fast_loading: micrositeData.fastLoading || true,
        analytics: {
          visitors: '0',
          conversions: 0,
          speed: Math.random() * 0.3 + 0.4 // Microsites are typically faster
        },
        campaign_data: {
          start_date: new Date().toISOString().split('T')[0],
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days
          budget: 10000,
          spent: 0
        }
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'microsite',
        microsite.id,
        `Created microsite: ${microsite.name}`,
        { template: microsite.template, domain: microsite.domain }
      )

      return microsite
    } catch (error) {
      console.error('Error creating microsite:', error)
      throw error
    }
  }

  async getWebsites() {
    return await supabaseService.getAll(this.tableName, { type: 'website' })
  }

  async getFunnels() {
    return await supabaseService.getAll(this.tableName, { type: 'funnel' })
  }

  async getMicrosites() {
    return await supabaseService.getAll(this.tableName, { type: 'microsite' })
  }

  async getAllSites() {
    return await supabaseService.getAll(this.tableName)
  }

  async deploySite(siteId, type) {
    try {
      // Update status to deploying
      await supabaseService.update(this.tableName, siteId, {
        status: 'deploying'
      })

      // Simulate deployment delay
      setTimeout(async () => {
        try {
          await supabaseService.update(this.tableName, siteId, {
            status: 'live',
            last_deployed: new Date().toISOString()
          })

          // Log activity
          await supabaseService.logActivity(
            'deploy',
            type,
            siteId,
            `Deployed ${type} successfully`,
            { deployment_time: new Date().toISOString() }
          )
        } catch (error) {
          console.error('Error completing deployment:', error)
        }
      }, 3000)

      return true
    } catch (error) {
      console.error('Error deploying site:', error)
      throw error
    }
  }

  async updateSite(siteId, updates) {
    try {
      const site = await supabaseService.update(this.tableName, siteId, updates)

      // Log activity
      await supabaseService.logActivity(
        'update',
        site.type,
        siteId,
        `Updated ${site.type}: ${site.name}`,
        updates
      )

      return site
    } catch (error) {
      console.error('Error updating site:', error)
      throw error
    }
  }

  async deleteSite(siteId) {
    try {
      const site = await supabaseService.getById(this.tableName, siteId)
      await supabaseService.delete(this.tableName, siteId)

      // Log activity
      await supabaseService.logActivity(
        'delete',
        site.type,
        siteId,
        `Deleted ${site.type}: ${site?.name || 'Unknown'}`,
        { site_id: siteId }
      )

      return true
    } catch (error) {
      console.error('Error deleting site:', error)
      throw error
    }
  }

  generateFunnelSteps(template) {
    const stepTemplates = {
      'lead-gen': [
        { name: 'Landing Page', conversion_rate: 0 },
        { name: 'Lead Capture', conversion_rate: 0 },
        { name: 'Thank You Page', conversion_rate: 0 }
      ],
      'sales': [
        { name: 'Sales Page', conversion_rate: 0 },
        { name: 'Order Form', conversion_rate: 0 },
        { name: 'Upsell Page', conversion_rate: 0 },
        { name: 'Confirmation', conversion_rate: 0 }
      ],
      'webinar': [
        { name: 'Registration Page', conversion_rate: 0 },
        { name: 'Confirmation Page', conversion_rate: 0 },
        { name: 'Reminder Sequence', conversion_rate: 0 }
      ],
      'squeeze': [
        { name: 'Squeeze Page', conversion_rate: 0 },
        { name: 'Download Page', conversion_rate: 0 }
      ]
    }

    return stepTemplates[template] || stepTemplates['lead-gen']
  }

  async getPerformanceStats() {
    try {
      const allSites = await this.getAllSites()
      
      return {
        totalSites: allSites.length,
        liveSites: allSites.filter(s => s.status === 'live').length,
        totalVisitors: allSites.reduce((sum, site) => {
          const visitors = typeof site.analytics.visitors === 'string' 
            ? parseFloat(site.analytics.visitors.replace('k', '')) * 1000 
            : site.analytics.visitors
          return sum + visitors
        }, 0),
        averageSpeed: allSites.length > 0 
          ? allSites.reduce((sum, site) => sum + site.analytics.speed, 0) / allSites.length 
          : 0,
        mobileOptimized: allSites.filter(s => s.mobile_optimized).length,
        seoOptimized: allSites.filter(s => s.seo_optimized).length
      }
    } catch (error) {
      console.error('Error getting performance stats:', error)
      return { totalSites: 0, liveSites: 0, totalVisitors: 0, averageSpeed: 0, mobileOptimized: 0, seoOptimized: 0 }
    }
  }
}

export const websiteService = new WebsiteService()
export default websiteService