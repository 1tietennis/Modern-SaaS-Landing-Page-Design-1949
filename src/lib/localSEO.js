// Local SEO & Google My Business Integration
export class LocalSEOService {
  constructor() {
    this.gmbProfiles = this.loadGMBProfiles()
    this.localKeywords = this.loadLocalKeywords()
    this.citations = this.loadCitations()
    this.reviews = this.loadReviews()
  }

  loadGMBProfiles() {
    try {
      const stored = localStorage.getItem('cyborgcrm_gmb_profiles')
      return stored ? JSON.parse(stored) : this.getDefaultGMBProfiles()
    } catch (error) {
      console.error('Error loading GMB profiles:', error)
      return this.getDefaultGMBProfiles()
    }
  }

  loadLocalKeywords() {
    return [
      { keyword: 'digital marketing agency near me', volume: 2400, difficulty: 65, ranking: 8 },
      { keyword: 'SEO services San Francisco', volume: 1800, difficulty: 72, ranking: 12 },
      { keyword: 'social media marketing company', volume: 3200, difficulty: 58, ranking: 5 },
      { keyword: 'local business marketing', volume: 1600, difficulty: 45, ranking: 3 },
      { keyword: 'website design services nearby', volume: 2100, difficulty: 52, ranking: 7 }
    ]
  }

  loadCitations() {
    return [
      { platform: 'Google My Business', status: 'verified', lastUpdated: '2024-01-15' },
      { platform: 'Yelp', status: 'claimed', lastUpdated: '2024-01-10' },
      { platform: 'Facebook Business', status: 'verified', lastUpdated: '2024-01-12' },
      { platform: 'Better Business Bureau', status: 'verified', lastUpdated: '2024-01-08' },
      { platform: 'Yellow Pages', status: 'pending', lastUpdated: '2024-01-14' },
      { platform: 'Bing Places', status: 'verified', lastUpdated: '2024-01-11' }
    ]
  }

  loadReviews() {
    return [
      {
        id: 1,
        platform: 'Google',
        rating: 5,
        author: 'Sarah Johnson',
        text: 'CyborgCRM transformed our marketing strategy. Highly recommend their services!',
        date: '2024-01-14',
        response: 'Thank you Sarah! We\'re thrilled to have helped your business grow.',
        helpful: 12
      },
      {
        id: 2,
        platform: 'Yelp',
        rating: 5,
        author: 'Mike Chen',
        text: 'Professional team with excellent results. Our ROI increased by 200%.',
        date: '2024-01-12',
        response: 'Thanks Mike! Your success is our priority.',
        helpful: 8
      },
      {
        id: 3,
        platform: 'Facebook',
        rating: 4,
        author: 'Emily Rodriguez',
        text: 'Great communication and solid results. Would work with them again.',
        date: '2024-01-10',
        response: null,
        helpful: 5
      }
    ]
  }

  getDefaultGMBProfiles() {
    return [
      {
        id: 1,
        businessName: 'CyborgCRM Digital Marketing',
        address: '123 Business Ave, Suite 100, San Francisco, CA 94105',
        phone: '+1 (555) 123-4567',
        website: 'https://cyborgcrm.com',
        category: 'Marketing Agency',
        description: 'AI-powered digital marketing solutions for modern businesses. Specializing in automation, social media marketing, and growth strategies.',
        hours: {
          monday: '9:00 AM - 6:00 PM',
          tuesday: '9:00 AM - 6:00 PM',
          wednesday: '9:00 AM - 6:00 PM',
          thursday: '9:00 AM - 6:00 PM',
          friday: '9:00 AM - 6:00 PM',
          saturday: '10:00 AM - 4:00 PM',
          sunday: 'Closed'
        },
        photos: [
          'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ],
        attributes: ['wheelchair_accessible', 'free_wifi', 'parking_available'],
        posts: [
          {
            id: 1,
            type: 'update',
            content: 'New AI-powered marketing automation tools now available! Book your free consultation today.',
            media: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            cta: 'Book Now',
            date: '2024-01-15'
          }
        ],
        insights: {
          views: 15600,
          searches: 8900,
          actions: 2340,
          calls: 156,
          directions: 234,
          websiteClicks: 890
        },
        rating: 4.8,
        reviewCount: 127,
        verified: true,
        lastUpdated: '2024-01-15'
      }
    ]
  }

  // GMB Management
  updateGMBProfile(profileId, updates) {
    const profile = this.gmbProfiles.find(p => p.id === profileId)
    if (profile) {
      Object.assign(profile, updates, { lastUpdated: new Date().toISOString().split('T')[0] })
      this.saveGMBProfiles()
      return profile
    }
    return null
  }

  addGMBPost(profileId, postData) {
    const profile = this.gmbProfiles.find(p => p.id === profileId)
    if (profile) {
      const newPost = {
        id: Date.now(),
        ...postData,
        date: new Date().toISOString().split('T')[0]
      }
      profile.posts.unshift(newPost)
      this.saveGMBProfiles()
      return newPost
    }
    return null
  }

  // Local Keyword Tracking
  trackLocalKeywords() {
    return this.localKeywords.map(keyword => ({
      ...keyword,
      trend: this.calculateKeywordTrend(keyword),
      opportunity: this.assessKeywordOpportunity(keyword)
    }))
  }

  calculateKeywordTrend(keyword) {
    // Mock trend calculation - in production, this would use real data
    const trends = ['up', 'down', 'stable']
    return trends[Math.floor(Math.random() * trends.length)]
  }

  assessKeywordOpportunity(keyword) {
    if (keyword.ranking > 10 && keyword.difficulty < 60) return 'high'
    if (keyword.ranking > 5 && keyword.difficulty < 70) return 'medium'
    return 'low'
  }

  // Citation Management
  getCitations() {
    return this.citations
  }

  updateCitation(platform, status) {
    const citation = this.citations.find(c => c.platform === platform)
    if (citation) {
      citation.status = status
      citation.lastUpdated = new Date().toISOString().split('T')[0]
      this.saveCitations()
    }
  }

  // Review Management
  getReviews() {
    return this.reviews.sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  respondToReview(reviewId, response) {
    const review = this.reviews.find(r => r.id === reviewId)
    if (review) {
      review.response = response
      this.saveReviews()
      return review
    }
    return null
  }

  // Local SEO Audit
  performLocalSEOAudit() {
    const gmbProfile = this.gmbProfiles[0]
    const audit = {
      score: 0,
      issues: [],
      recommendations: []
    }

    // Check GMB completeness
    let completeness = 0
    const requiredFields = ['businessName', 'address', 'phone', 'website', 'description', 'hours']
    requiredFields.forEach(field => {
      if (gmbProfile[field]) completeness += 16.67
    })

    if (completeness < 100) {
      audit.issues.push(`GMB profile is ${completeness.toFixed(0)}% complete`)
      audit.recommendations.push('Complete all GMB profile sections for better visibility')
    }

    // Check reviews
    const avgRating = this.reviews.reduce((sum, r) => sum + r.rating, 0) / this.reviews.length || 0
    if (avgRating < 4.5) {
      audit.issues.push('Average rating below 4.5 stars')
      audit.recommendations.push('Focus on improving customer satisfaction and encouraging positive reviews')
    }

    // Check citations
    const verifiedCitations = this.citations.filter(c => c.status === 'verified').length
    if (verifiedCitations < 4) {
      audit.issues.push('Insufficient verified citations')
      audit.recommendations.push('Claim and verify more local directory listings')
    }

    // Calculate overall score
    audit.score = Math.max(0, 100 - (audit.issues.length * 15))

    return audit
  }

  saveGMBProfiles() {
    localStorage.setItem('cyborgcrm_gmb_profiles', JSON.stringify(this.gmbProfiles))
  }

  saveCitations() {
    localStorage.setItem('cyborgcrm_citations', JSON.stringify(this.citations))
  }

  saveReviews() {
    localStorage.setItem('cyborgcrm_reviews', JSON.stringify(this.reviews))
  }
}

export const localSEOService = new LocalSEOService()
export default localSEOService