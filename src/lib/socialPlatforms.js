// Social Media Platform Integrations
import {supabaseService} from './supabaseService'

export const PLATFORMS = {
  FACEBOOK: 'facebook',
  INSTAGRAM: 'instagram',
  TWITTER: 'twitter',
  LINKEDIN: 'linkedin',
  TIKTOK: 'tiktok',
  YOUTUBE: 'youtube',
  PINTEREST: 'pinterest'
}

export const POST_STATUS = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  FAILED: 'failed'
}

export class SocialPlatformService {
  constructor() {
    this.platformsTableName = 'social_platforms_crm2024'
    this.postsTableName = 'social_posts_crm2024'
    this.analyticsTableName = 'social_analytics_crm2024'
    this.engagementTableName = 'social_engagement_crm2024'
  }

  // Platform Connection Management
  async connectPlatform(platform, credentials) {
    try {
      const connection = await supabaseService.create(this.platformsTableName, {
        platform,
        account_name: credentials.accountName,
        account_id: credentials.accountId,
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken || null,
        expires_at: credentials.expiresAt || null,
        connected: true,
        last_sync: new Date().toISOString(),
        permissions: credentials.permissions || [],
        profile_data: credentials.profileData || {}
      })

      // Log activity
      await supabaseService.logActivity(
        'connect',
        'social_platform',
        connection.id,
        `Connected ${platform} account: ${credentials.accountName}`,
        {platform, account_name: credentials.accountName}
      )

      return connection
    } catch (error) {
      console.error('Error connecting platform:', error)
      throw error
    }
  }

  async disconnectPlatform(platformId) {
    try {
      const platform = await supabaseService.getById(this.platformsTableName, platformId)
      
      await supabaseService.update(this.platformsTableName, platformId, {
        connected: false,
        access_token: null,
        refresh_token: null,
        disconnected_at: new Date().toISOString()
      })

      // Log activity
      await supabaseService.logActivity(
        'disconnect',
        'social_platform',
        platformId,
        `Disconnected ${platform?.platform} account: ${platform?.account_name}`,
        {platform: platform?.platform}
      )

      return true
    } catch (error) {
      console.error('Error disconnecting platform:', error)
      throw error
    }
  }

  async getConnectedPlatforms() {
    return await supabaseService.getAll(this.platformsTableName, {connected: true})
  }

  // Content Scheduling
  async schedulePost(postData) {
    try {
      const post = await supabaseService.create(this.postsTableName, {
        content: postData.content,
        platforms: postData.platforms || [],
        media_urls: postData.mediaUrls || [],
        scheduled_for: postData.scheduledFor,
        status: POST_STATUS.SCHEDULED,
        hashtags: postData.hashtags || [],
        mentions: postData.mentions || [],
        campaign_id: postData.campaignId || null,
        auto_publish: postData.autoPublish || false,
        approval_required: postData.approvalRequired || false,
        approved_by: null,
        approved_at: null
      })

      // Schedule the post for publishing
      if (postData.autoPublish) {
        this.schedulePostPublication(post.id, postData.scheduledFor)
      }

      // Log activity
      await supabaseService.logActivity(
        'schedule',
        'social_post',
        post.id,
        `Scheduled post for ${new Date(postData.scheduledFor).toLocaleString()}`,
        {platforms: postData.platforms, scheduled_for: postData.scheduledFor}
      )

      return post
    } catch (error) {
      console.error('Error scheduling post:', error)
      throw error
    }
  }

  async publishPost(postId) {
    try {
      const post = await supabaseService.getById(this.postsTableName, postId)
      if (!post) throw new Error('Post not found')

      const results = []
      
      // Publish to each platform
      for (const platform of post.platforms) {
        try {
          const result = await this.publishToPlatform(platform, post)
          results.push({platform, success: true, postId: result.postId})
        } catch (error) {
          results.push({platform, success: false, error: error.message})
        }
      }

      // Update post status
      const allSuccessful = results.every(r => r.success)
      await supabaseService.update(this.postsTableName, postId, {
        status: allSuccessful ? POST_STATUS.PUBLISHED : POST_STATUS.FAILED,
        published_at: new Date().toISOString(),
        publish_results: results
      })

      // Log activity
      await supabaseService.logActivity(
        'publish',
        'social_post',
        postId,
        `Published post to ${results.filter(r => r.success).length}/${results.length} platforms`,
        {results}
      )

      return results
    } catch (error) {
      console.error('Error publishing post:', error)
      throw error
    }
  }

  async publishToPlatform(platform, post) {
    // Mock API calls - in production, use actual platform APIs
    switch (platform) {
      case PLATFORMS.FACEBOOK:
        return await this.publishToFacebook(post)
      case PLATFORMS.INSTAGRAM:
        return await this.publishToInstagram(post)
      case PLATFORMS.TWITTER:
        return await this.publishToTwitter(post)
      case PLATFORMS.LINKEDIN:
        return await this.publishToLinkedIn(post)
      case PLATFORMS.TIKTOK:
        return await this.publishToTikTok(post)
      case PLATFORMS.YOUTUBE:
        return await this.publishToYouTube(post)
      case PLATFORMS.PINTEREST:
        return await this.publishToPinterest(post)
      default:
        throw new Error(`Unsupported platform: ${platform}`)
    }
  }

  // Platform-specific publishing methods (mock implementations)
  async publishToFacebook(post) {
    // Mock Facebook API call
    console.log('Publishing to Facebook:', post.content)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {postId: `fb_${Date.now()}`, url: `https://facebook.com/posts/${Date.now()}`}
  }

  async publishToInstagram(post) {
    // Mock Instagram API call
    console.log('Publishing to Instagram:', post.content)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {postId: `ig_${Date.now()}`, url: `https://instagram.com/p/${Date.now()}`}
  }

  async publishToTwitter(post) {
    // Mock Twitter API call
    console.log('Publishing to Twitter:', post.content)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {postId: `tw_${Date.now()}`, url: `https://twitter.com/status/${Date.now()}`}
  }

  async publishToLinkedIn(post) {
    // Mock LinkedIn API call
    console.log('Publishing to LinkedIn:', post.content)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {postId: `li_${Date.now()}`, url: `https://linkedin.com/posts/${Date.now()}`}
  }

  async publishToTikTok(post) {
    // Mock TikTok API call
    console.log('Publishing to TikTok:', post.content)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {postId: `tt_${Date.now()}`, url: `https://tiktok.com/@user/video/${Date.now()}`}
  }

  async publishToYouTube(post) {
    // Mock YouTube API call
    console.log('Publishing to YouTube:', post.content)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {postId: `yt_${Date.now()}`, url: `https://youtube.com/watch?v=${Date.now()}`}
  }

  async publishToPinterest(post) {
    // Mock Pinterest API call
    console.log('Publishing to Pinterest:', post.content)
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {postId: `pt_${Date.now()}`, url: `https://pinterest.com/pin/${Date.now()}`}
  }

  // Analytics and Performance
  async getAnalytics(platform = null, timeframe = '30d') {
    try {
      let analytics = await supabaseService.getAll(this.analyticsTableName)
      
      if (platform) {
        analytics = analytics.filter(a => a.platform === platform)
      }

      // Calculate aggregated metrics
      const totalReach = analytics.reduce((sum, a) => sum + (a.reach || 0), 0)
      const totalEngagement = analytics.reduce((sum, a) => sum + (a.engagement || 0), 0)
      const totalClicks = analytics.reduce((sum, a) => sum + (a.clicks || 0), 0)
      const totalImpressions = analytics.reduce((sum, a) => sum + (a.impressions || 0), 0)

      return {
        overview: {
          totalReach,
          totalEngagement,
          totalClicks,
          totalImpressions,
          engagementRate: totalImpressions > 0 ? ((totalEngagement / totalImpressions) * 100).toFixed(2) : 0,
          clickThroughRate: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : 0
        },
        platformBreakdown: this.calculatePlatformBreakdown(analytics),
        topPosts: await this.getTopPerformingPosts(timeframe),
        trending: await this.getTrendingContent(timeframe)
      }
    } catch (error) {
      console.error('Error getting analytics:', error)
      return this.getMockAnalytics()
    }
  }

  calculatePlatformBreakdown(analytics) {
    const breakdown = {}
    
    Object.values(PLATFORMS).forEach(platform => {
      const platformAnalytics = analytics.filter(a => a.platform === platform)
      breakdown[platform] = {
        followers: Math.floor(Math.random() * 10000) + 1000,
        reach: platformAnalytics.reduce((sum, a) => sum + (a.reach || 0), 0),
        engagement: platformAnalytics.reduce((sum, a) => sum + (a.engagement || 0), 0),
        clicks: platformAnalytics.reduce((sum, a) => sum + (a.clicks || 0), 0),
        impressions: platformAnalytics.reduce((sum, a) => sum + (a.impressions || 0), 0)
      }
    })

    return breakdown
  }

  async getTopPerformingPosts(timeframe) {
    try {
      const posts = await supabaseService.getAll(this.postsTableName, {status: POST_STATUS.PUBLISHED})
      
      // Sort by engagement metrics
      return posts
        .sort((a, b) => (b.analytics?.engagement || 0) - (a.analytics?.engagement || 0))
        .slice(0, 10)
        .map(post => ({
          id: post.id,
          content: post.content.substring(0, 100) + '...',
          platforms: post.platforms,
          engagement: post.analytics?.engagement || 0,
          reach: post.analytics?.reach || 0,
          clicks: post.analytics?.clicks || 0
        }))
    } catch (error) {
      console.error('Error getting top posts:', error)
      return []
    }
  }

  async getTrendingContent(timeframe) {
    return {
      hashtags: ['#DigitalMarketing', '#AI', '#BusinessGrowth', '#SocialMedia', '#Automation'],
      topics: ['AI Marketing', 'Social Commerce', 'Video Content', 'Influencer Marketing'],
      bestTimes: {
        [PLATFORMS.FACEBOOK]: '2:00 PM - 4:00 PM',
        [PLATFORMS.INSTAGRAM]: '11:00 AM - 1:00 PM',
        [PLATFORMS.TWITTER]: '9:00 AM - 10:00 AM',
        [PLATFORMS.LINKEDIN]: '8:00 AM - 9:00 AM'
      }
    }
  }

  // Content Management
  async createContentCalendar(startDate, endDate, platforms) {
    const calendar = []
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const posts = await this.getPostsForDate(new Date(d))
      calendar.push({
        date: new Date(d).toISOString().split('T')[0],
        posts: posts,
        suggestedContent: this.generateContentSuggestions(new Date(d), platforms)
      })
    }

    return calendar
  }

  async getPostsForDate(date) {
    try {
      const posts = await supabaseService.getAll(this.postsTableName)
      const dateStr = date.toISOString().split('T')[0]
      
      return posts.filter(post => {
        const postDate = new Date(post.scheduled_for).toISOString().split('T')[0]
        return postDate === dateStr
      })
    } catch (error) {
      console.error('Error getting posts for date:', error)
      return []
    }
  }

  generateContentSuggestions(date, platforms) {
    const dayOfWeek = date.getDay()
    const suggestions = []

    // Different content types for different days
    switch (dayOfWeek) {
      case 1: // Monday
        suggestions.push({
          type: 'motivational',
          content: 'Start your week strong! Here\'s how to boost your productivity...',
          platforms: [PLATFORMS.LINKEDIN, PLATFORMS.FACEBOOK]
        })
        break
      case 3: // Wednesday
        suggestions.push({
          type: 'educational',
          content: 'Wednesday Wisdom: 5 marketing trends you need to know...',
          platforms: [PLATFORMS.TWITTER, PLATFORMS.LINKEDIN]
        })
        break
      case 5: // Friday
        suggestions.push({
          type: 'engagement',
          content: 'Friday Fun: What\'s your biggest marketing win this week?',
          platforms: [PLATFORMS.FACEBOOK, PLATFORMS.INSTAGRAM]
        })
        break
    }

    return suggestions
  }

  // Engagement Management
  async getEngagementData(timeframe = '7d') {
    try {
      const engagement = await supabaseService.getAll(this.engagementTableName)
      
      return {
        mentions: engagement.filter(e => e.type === 'mention'),
        comments: engagement.filter(e => e.type === 'comment'),
        messages: engagement.filter(e => e.type === 'message'),
        reviews: engagement.filter(e => e.type === 'review'),
        unresponded: engagement.filter(e => !e.responded_at),
        avgResponseTime: this.calculateAverageResponseTime(engagement)
      }
    } catch (error) {
      console.error('Error getting engagement data:', error)
      return this.getMockEngagementData()
    }
  }

  calculateAverageResponseTime(engagement) {
    const responded = engagement.filter(e => e.responded_at)
    if (responded.length === 0) return 0

    const totalTime = responded.reduce((sum, e) => {
      const created = new Date(e.created_at)
      const responded = new Date(e.responded_at)
      return sum + (responded - created)
    }, 0)

    return Math.round(totalTime / responded.length / (1000 * 60)) // minutes
  }

  async respondToEngagement(engagementId, response) {
    try {
      const engagement = await supabaseService.getById(this.engagementTableName, engagementId)
      
      await supabaseService.update(this.engagementTableName, engagementId, {
        response,
        responded_at: new Date().toISOString(),
        responded_by: 'current_user' // In production, use actual user ID
      })

      // Send response to platform
      await this.sendResponseToPlatform(engagement.platform, engagement.external_id, response)

      // Log activity
      await supabaseService.logActivity(
        'respond',
        'engagement',
        engagementId,
        `Responded to ${engagement.type} on ${engagement.platform}`,
        {platform: engagement.platform, type: engagement.type}
      )

      return true
    } catch (error) {
      console.error('Error responding to engagement:', error)
      throw error
    }
  }

  async sendResponseToPlatform(platform, externalId, response) {
    // Mock API calls - in production, use actual platform APIs
    console.log(`Sending response to ${platform}:`, response)
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
  }

  // Automation
  async setupAutoResponse(platform, trigger, response) {
    try {
      const autoResponse = await supabaseService.create('auto_responses_crm2024', {
        platform,
        trigger_type: trigger.type,
        trigger_keywords: trigger.keywords || [],
        response_template: response.template,
        active: true,
        conditions: trigger.conditions || {}
      })

      // Log activity
      await supabaseService.logActivity(
        'create',
        'auto_response',
        autoResponse.id,
        `Set up auto-response for ${platform}`,
        {platform, trigger_type: trigger.type}
      )

      return autoResponse
    } catch (error) {
      console.error('Error setting up auto-response:', error)
      throw error
    }
  }

  async processIncomingEngagement(engagementData) {
    try {
      // Store engagement
      const engagement = await supabaseService.create(this.engagementTableName, {
        platform: engagementData.platform,
        type: engagementData.type,
        external_id: engagementData.externalId,
        author: engagementData.author,
        content: engagementData.content,
        post_id: engagementData.postId,
        sentiment: await this.analyzeSentiment(engagementData.content),
        priority: this.calculatePriority(engagementData),
        requires_response: this.requiresResponse(engagementData)
      })

      // Check for auto-responses
      await this.checkAutoResponses(engagement)

      return engagement
    } catch (error) {
      console.error('Error processing engagement:', error)
      throw error
    }
  }

  async analyzeSentiment(content) {
    // Mock sentiment analysis - in production, use AI service
    const positiveWords = ['great', 'awesome', 'love', 'excellent', 'amazing']
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'worst']
    
    const words = content.toLowerCase().split(' ')
    const positiveCount = words.filter(word => positiveWords.includes(word)).length
    const negativeCount = words.filter(word => negativeWords.includes(word)).length
    
    if (positiveCount > negativeCount) return 'positive'
    if (negativeCount > positiveCount) return 'negative'
    return 'neutral'
  }

  calculatePriority(engagementData) {
    // High priority for complaints, urgent keywords, or VIP users
    const urgentKeywords = ['urgent', 'complaint', 'issue', 'problem', 'help']
    const content = engagementData.content.toLowerCase()
    
    if (urgentKeywords.some(keyword => content.includes(keyword))) {
      return 'high'
    }
    
    if (engagementData.type === 'review' && engagementData.rating < 3) {
      return 'high'
    }
    
    return 'medium'
  }

  requiresResponse(engagementData) {
    // Questions, complaints, and mentions typically require responses
    const content = engagementData.content.toLowerCase()
    return content.includes('?') || 
           content.includes('help') || 
           content.includes('question') ||
           engagementData.type === 'mention'
  }

  async checkAutoResponses(engagement) {
    try {
      const autoResponses = await supabaseService.getAll('auto_responses_crm2024', {
        platform: engagement.platform,
        active: true
      })

      for (const autoResponse of autoResponses) {
        if (this.matchesTrigger(engagement, autoResponse)) {
          const response = this.generateResponse(autoResponse.response_template, engagement)
          await this.respondToEngagement(engagement.id, response)
          break
        }
      }
    } catch (error) {
      console.error('Error checking auto-responses:', error)
    }
  }

  matchesTrigger(engagement, autoResponse) {
    const content = engagement.content.toLowerCase()
    return autoResponse.trigger_keywords.some(keyword => 
      content.includes(keyword.toLowerCase())
    )
  }

  generateResponse(template, engagement) {
    return template
      .replace('{author}', engagement.author)
      .replace('{content}', engagement.content.substring(0, 50))
  }

  // Mock data methods
  getMockAnalytics() {
    return {
      overview: {
        totalReach: 125000,
        totalEngagement: 8500,
        totalClicks: 2300,
        totalImpressions: 450000,
        engagementRate: 1.89,
        clickThroughRate: 0.51
      },
      platformBreakdown: {
        [PLATFORMS.FACEBOOK]: {
          followers: 5200,
          reach: 45000,
          engagement: 3200,
          clicks: 890,
          impressions: 120000
        },
        [PLATFORMS.INSTAGRAM]: {
          followers: 3800,
          reach: 38000,
          engagement: 2800,
          clicks: 650,
          impressions: 95000
        },
        [PLATFORMS.LINKEDIN]: {
          followers: 2100,
          reach: 25000,
          engagement: 1900,
          clicks: 520,
          impressions: 85000
        }
      },
      topPosts: [],
      trending: {
        hashtags: ['#DigitalMarketing', '#AI', '#BusinessGrowth'],
        topics: ['AI Marketing', 'Social Commerce'],
        bestTimes: {
          [PLATFORMS.FACEBOOK]: '2:00 PM - 4:00 PM',
          [PLATFORMS.INSTAGRAM]: '11:00 AM - 1:00 PM'
        }
      }
    }
  }

  getMockEngagementData() {
    return {
      mentions: [],
      comments: [],
      messages: [],
      reviews: [],
      unresponded: [],
      avgResponseTime: 45
    }
  }

  schedulePostPublication(postId, scheduledFor) {
    // In production, use a job queue like Bull or Agenda
    const delay = new Date(scheduledFor) - new Date()
    if (delay > 0) {
      setTimeout(() => {
        this.publishPost(postId)
      }, delay)
    }
  }
}

export const socialPlatformService = new SocialPlatformService()
export default socialPlatformService