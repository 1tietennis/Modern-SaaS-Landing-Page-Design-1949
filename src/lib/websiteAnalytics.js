// Website Analytics Service with Supabase Integration
import { supabaseService } from './supabaseService'
import { format, startOfDay, endOfDay, subDays, parseISO } from 'date-fns'

export class WebsiteAnalyticsService {
  constructor() {
    this.visitorsTableName = 'website_visitors_crm2024'
    this.pageViewsTableName = 'page_views_crm2024'
    this.clickEventsTableName = 'click_events_crm2024'
    this.sessionTableName = 'user_sessions_crm2024'
    
    // Initialize tracking if running in browser
    if (typeof window !== 'undefined') {
      this.initializeTracking()
    }
  }

  // Initialize tracking scripts
  initializeTracking() {
    // Create global tracking function
    window.CyborgCRM = window.CyborgCRM || this.trackEvent.bind(this)
    
    // Track page view on load
    this.trackPageView()
    
    // Track clicks
    this.initializeClickTracking()
    
    // Track time on page
    this.initializeTimeTracking()
    
    // Track session data
    this.initializeSessionTracking()
  }

  // Generate unique visitor ID
  generateVisitorId() {
    let visitorId = localStorage.getItem('cyborg_visitor_id')
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('cyborg_visitor_id', visitorId)
    }
    return visitorId
  }

  // Generate session ID
  generateSessionId() {
    let sessionId = sessionStorage.getItem('cyborg_session_id')
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
      sessionStorage.setItem('cyborg_session_id', sessionId)
    }
    return sessionId
  }

  // Track visitor data
  async trackVisitor(additionalData = {}) {
    try {
      const visitorId = this.generateVisitorId()
      const sessionId = this.generateSessionId()
      
      const visitorData = {
        visitor_id: visitorId,
        session_id: sessionId,
        ip_address: await this.getIPAddress(),
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        referrer: document.referrer || 'direct',
        landing_page: window.location.pathname,
        visit_date: new Date().toISOString().split('T')[0],
        visit_time: new Date().toISOString(),
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        operating_system: this.getOS(),
        ...additionalData
      }

      await supabaseService.create(this.visitorsTableName, visitorData)
      return visitorData
    } catch (error) {
      console.error('Error tracking visitor:', error)
    }
  }

  // Track page views with time spent
  async trackPageView(pageData = {}) {
    try {
      const visitorId = this.generateVisitorId()
      const sessionId = this.generateSessionId()
      
      const pageViewData = {
        visitor_id: visitorId,
        session_id: sessionId,
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
        entry_time: new Date().toISOString(),
        time_spent: 0, // Will be updated when user leaves
        scroll_depth: 0,
        exit_time: null,
        ...pageData
      }

      const pageView = await supabaseService.create(this.pageViewsTableName, pageViewData)
      
      // Store page view ID for updating time spent
      sessionStorage.setItem('current_page_view_id', pageView.id)
      sessionStorage.setItem('page_entry_time', new Date().getTime())
      
      return pageView
    } catch (error) {
      console.error('Error tracking page view:', error)
    }
  }

  // Update time spent on page
  async updateTimeSpent() {
    try {
      const pageViewId = sessionStorage.getItem('current_page_view_id')
      const entryTime = sessionStorage.getItem('page_entry_time')
      
      if (pageViewId && entryTime) {
        const timeSpent = Math.round((new Date().getTime() - parseInt(entryTime)) / 1000) // in seconds
        const scrollDepth = this.calculateScrollDepth()
        
        await supabaseService.update(this.pageViewsTableName, pageViewId, {
          time_spent: timeSpent,
          scroll_depth: scrollDepth,
          exit_time: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error updating time spent:', error)
    }
  }

  // Track click events
  async trackClick(element, eventData = {}) {
    try {
      const visitorId = this.generateVisitorId()
      const sessionId = this.generateSessionId()
      
      const clickData = {
        visitor_id: visitorId,
        session_id: sessionId,
        element_type: element.tagName.toLowerCase(),
        element_id: element.id || null,
        element_class: element.className || null,
        element_text: element.textContent?.slice(0, 100) || null,
        element_href: element.href || null,
        page_url: window.location.href,
        page_path: window.location.pathname,
        click_x: eventData.clientX || 0,
        click_y: eventData.clientY || 0,
        timestamp: new Date().toISOString(),
        ...eventData
      }

      await supabaseService.create(this.clickEventsTableName, clickData)
      return clickData
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  // Initialize click tracking
  initializeClickTracking() {
    document.addEventListener('click', (event) => {
      // Track all clicks but focus on important elements
      const element = event.target
      const isImportant = element.tagName.toLowerCase() === 'a' || 
                         element.tagName.toLowerCase() === 'button' ||
                         element.onclick ||
                         element.classList.contains('trackable')
      
      if (isImportant) {
        this.trackClick(element, {
          clientX: event.clientX,
          clientY: event.clientY,
          important: true
        })
      } else {
        // Track all clicks but mark as less important
        this.trackClick(element, {
          clientX: event.clientX,
          clientY: event.clientY,
          important: false
        })
      }
    })
  }

  // Initialize time tracking
  initializeTimeTracking() {
    // Update time spent before page unload
    window.addEventListener('beforeunload', () => {
      this.updateTimeSpent()
    })

    // Update time spent when tab becomes hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateTimeSpent()
      }
    })

    // Periodic updates for long sessions
    setInterval(() => {
      this.updateTimeSpent()
    }, 30000) // Update every 30 seconds
  }

  // Initialize session tracking
  initializeSessionTracking() {
    const sessionId = this.generateSessionId()
    const visitorId = this.generateVisitorId()
    
    // Track session start
    this.trackSessionStart(sessionId, visitorId)
    
    // Track session end
    window.addEventListener('beforeunload', () => {
      this.trackSessionEnd(sessionId)
    })
  }

  async trackSessionStart(sessionId, visitorId) {
    try {
      const sessionData = {
        session_id: sessionId,
        visitor_id: visitorId,
        start_time: new Date().toISOString(),
        end_time: null,
        duration: 0,
        page_count: 1,
        device_type: this.getDeviceType(),
        browser: this.getBrowser(),
        referrer: document.referrer || 'direct'
      }

      await supabaseService.create(this.sessionTableName, sessionData)
    } catch (error) {
      console.error('Error tracking session start:', error)
    }
  }

  async trackSessionEnd(sessionId) {
    try {
      const sessions = await supabaseService.getAll(this.sessionTableName, { session_id: sessionId })
      if (sessions.length > 0) {
        const session = sessions[0]
        const startTime = new Date(session.start_time)
        const endTime = new Date()
        const duration = Math.round((endTime - startTime) / 1000) // in seconds

        await supabaseService.update(this.sessionTableName, session.id, {
          end_time: endTime.toISOString(),
          duration: duration
        })
      }
    } catch (error) {
      console.error('Error tracking session end:', error)
    }
  }

  // Custom event tracking
  trackEvent(eventName, properties = {}) {
    const visitorId = this.generateVisitorId()
    const sessionId = this.generateSessionId()
    
    const eventData = {
      event_name: eventName,
      properties: {
        visitor_id: visitorId,
        session_id: sessionId,
        page_url: window.location.href,
        timestamp: new Date().toISOString(),
        ...properties
      }
    }

    // Log to console for debugging
    console.log('CyborgCRM Event:', eventData)
    
    // In production, send to analytics endpoint
    return eventData
  }

  // Get analytics data
  async getDailyVisitors(startDate, endDate) {
    try {
      const visitors = await supabaseService.getAll(this.visitorsTableName)
      
      const filteredVisitors = visitors.filter(visitor => {
        const visitDate = new Date(visitor.visit_date)
        return visitDate >= new Date(startDate) && visitDate <= new Date(endDate)
      })

      // Group by date
      const dailyStats = {}
      filteredVisitors.forEach(visitor => {
        const date = visitor.visit_date
        if (!dailyStats[date]) {
          dailyStats[date] = {
            date,
            unique_visitors: new Set(),
            total_visits: 0,
            new_visitors: 0,
            returning_visitors: 0
          }
        }
        
        dailyStats[date].unique_visitors.add(visitor.visitor_id)
        dailyStats[date].total_visits++
        
        // Determine if new or returning visitor
        const isNewVisitor = !localStorage.getItem(`visitor_${visitor.visitor_id}_seen`)
        if (isNewVisitor) {
          dailyStats[date].new_visitors++
          localStorage.setItem(`visitor_${visitor.visitor_id}_seen`, 'true')
        } else {
          dailyStats[date].returning_visitors++
        }
      })

      // Convert to array and add unique visitor counts
      return Object.values(dailyStats).map(day => ({
        ...day,
        unique_visitors: day.unique_visitors.size
      }))
    } catch (error) {
      console.error('Error getting daily visitors:', error)
      return []
    }
  }

  async getPageAnalytics(startDate, endDate) {
    try {
      const pageViews = await supabaseService.getAll(this.pageViewsTableName)
      
      const filteredViews = pageViews.filter(view => {
        const viewDate = new Date(view.entry_time)
        return viewDate >= new Date(startDate) && viewDate <= new Date(endDate)
      })

      // Group by page
      const pageStats = {}
      filteredViews.forEach(view => {
        const pagePath = view.page_path
        if (!pageStats[pagePath]) {
          pageStats[pagePath] = {
            page_path: pagePath,
            page_title: view.page_title,
            views: 0,
            unique_visitors: new Set(),
            total_time_spent: 0,
            average_time_spent: 0,
            bounce_rate: 0,
            exit_rate: 0
          }
        }
        
        pageStats[pagePath].views++
        pageStats[pagePath].unique_visitors.add(view.visitor_id)
        pageStats[pagePath].total_time_spent += view.time_spent || 0
      })

      // Calculate averages
      return Object.values(pageStats).map(page => ({
        ...page,
        unique_visitors: page.unique_visitors.size,
        average_time_spent: page.views > 0 ? Math.round(page.total_time_spent / page.views) : 0
      })).sort((a, b) => b.views - a.views)
    } catch (error) {
      console.error('Error getting page analytics:', error)
      return []
    }
  }

  async getClickAnalytics(startDate, endDate) {
    try {
      const clicks = await supabaseService.getAll(this.clickEventsTableName)
      
      const filteredClicks = clicks.filter(click => {
        const clickDate = new Date(click.timestamp)
        return clickDate >= new Date(startDate) && clickDate <= new Date(endDate)
      })

      // Group by element and page
      const clickStats = {}
      filteredClicks.forEach(click => {
        const key = `${click.page_path}_${click.element_type}_${click.element_text || click.element_id || 'unknown'}`
        if (!clickStats[key]) {
          clickStats[key] = {
            page_path: click.page_path,
            element_type: click.element_type,
            element_text: click.element_text,
            element_id: click.element_id,
            element_href: click.element_href,
            click_count: 0,
            unique_clickers: new Set()
          }
        }
        
        clickStats[key].click_count++
        clickStats[key].unique_clickers.add(click.visitor_id)
      })

      return Object.values(clickStats).map(stat => ({
        ...stat,
        unique_clickers: stat.unique_clickers.size
      })).sort((a, b) => b.click_count - a.click_count)
    } catch (error) {
      console.error('Error getting click analytics:', error)
      return []
    }
  }

  async getRealtimeData() {
    try {
      const now = new Date()
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)

      // Get recent page views
      const recentViews = await supabaseService.getAll(this.pageViewsTableName)
      const activeViews = recentViews.filter(view => {
        const entryTime = new Date(view.entry_time)
        return entryTime >= oneHourAgo && !view.exit_time
      })

      // Get recent visitors
      const recentVisitors = await supabaseService.getAll(this.visitorsTableName)
      const activeVisitors = recentVisitors.filter(visitor => {
        const visitTime = new Date(visitor.visit_time)
        return visitTime >= oneHourAgo
      })

      return {
        active_visitors: activeViews.length,
        total_visitors_last_hour: activeVisitors.length,
        top_pages: await this.getTopPagesLastHour(),
        recent_events: await this.getRecentEvents()
      }
    } catch (error) {
      console.error('Error getting realtime data:', error)
      return {
        active_visitors: 0,
        total_visitors_last_hour: 0,
        top_pages: [],
        recent_events: []
      }
    }
  }

  async getTopPagesLastHour() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const pageViews = await supabaseService.getAll(this.pageViewsTableName)
      
      const recentViews = pageViews.filter(view => {
        const entryTime = new Date(view.entry_time)
        return entryTime >= oneHourAgo
      })

      const pageStats = {}
      recentViews.forEach(view => {
        if (!pageStats[view.page_path]) {
          pageStats[view.page_path] = {
            page_path: view.page_path,
            page_title: view.page_title,
            views: 0
          }
        }
        pageStats[view.page_path].views++
      })

      return Object.values(pageStats).sort((a, b) => b.views - a.views).slice(0, 5)
    } catch (error) {
      console.error('Error getting top pages:', error)
      return []
    }
  }

  async getRecentEvents() {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      const clicks = await supabaseService.getAll(this.clickEventsTableName)
      
      return clicks
        .filter(click => new Date(click.timestamp) >= oneHourAgo)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10)
    } catch (error) {
      console.error('Error getting recent events:', error)
      return []
    }
  }

  // Utility functions
  calculateScrollDepth() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    return scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0
  }

  async getIPAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch (error) {
      return 'unknown'
    }
  }

  getDeviceType() {
    const width = window.innerWidth
    if (width < 768) return 'mobile'
    if (width < 1024) return 'tablet'
    return 'desktop'
  }

  getBrowser() {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome')) return 'Chrome'
    if (userAgent.includes('Firefox')) return 'Firefox'
    if (userAgent.includes('Safari')) return 'Safari'
    if (userAgent.includes('Edge')) return 'Edge'
    return 'Unknown'
  }

  getOS() {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Windows')) return 'Windows'
    if (userAgent.includes('Mac')) return 'macOS'
    if (userAgent.includes('Linux')) return 'Linux'
    if (userAgent.includes('Android')) return 'Android'
    if (userAgent.includes('iOS')) return 'iOS'
    return 'Unknown'
  }
}

export const websiteAnalyticsService = new WebsiteAnalyticsService()
export default websiteAnalyticsService