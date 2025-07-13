// Checkout Optimization Service
import {supabaseService} from './supabaseService'

export class CheckoutOptimizationService {
  constructor() {
    this.optimizationTableName = 'checkout_optimization_crm2024'
    this.abTestsTableName = 'ab_tests_crm2024'
    this.heatmapsTableName = 'heatmaps_crm2024'
  }

  async getOptimizationData() {
    try {
      return {
        overview: {
          conversionRate: 3.2,
          cartAbandonmentRate: 68.5,
          averageOrderValue: 127.50,
          revenuePerVisitor: 4.08
        },
        criticalIssues: [
          {
            title: 'High Cart Abandonment at Payment Step',
            description: 'Users are dropping off at 73% rate during payment information entry',
            impact: 'Lost Revenue: $45,000/month'
          },
          {
            title: 'Mobile Checkout Performance',
            description: 'Mobile conversion rate 45% lower than desktop',
            impact: 'Mobile Revenue Gap: $23,000/month'
          }
        ],
        formAnalytics: [
          {
            name: 'Email Address',
            completionRate: 95,
            avgTimeSpent: 8,
            dropOffRate: 5
          },
          {
            name: 'Payment Information',
            completionRate: 67,
            avgTimeSpent: 45,
            dropOffRate: 33
          },
          {
            name: 'Billing Address',
            completionRate: 78,
            avgTimeSpent: 32,
            dropOffRate: 22
          }
        ]
      }
    } catch (error) {
      console.error('Error getting optimization data:', error)
      return this.getDefaultOptimizationData()
    }
  }

  async getFunnelData() {
    return [
      {
        name: 'Product View',
        visitors: 10000,
        conversionRate: 100,
        dropOffRate: 0,
        icon: 'FiEye'
      },
      {
        name: 'Add to Cart',
        visitors: 3500,
        conversionRate: 35,
        dropOffRate: 65,
        icon: 'FiShoppingCart'
      },
      {
        name: 'Checkout Start',
        visitors: 1750,
        conversionRate: 17.5,
        dropOffRate: 50,
        icon: 'FiCreditCard'
      },
      {
        name: 'Payment Info',
        visitors: 875,
        conversionRate: 8.75,
        dropOffRate: 50,
        icon: 'FiLock'
      },
      {
        name: 'Purchase Complete',
        visitors: 525,
        conversionRate: 5.25,
        dropOffRate: 40,
        icon: 'FiCheck'
      }
    ]
  }

  async getABTests() {
    try {
      return await supabaseService.getAll(this.abTestsTableName)
    } catch (error) {
      console.error('Error getting A/B tests:', error)
      return this.getDefaultABTests()
    }
  }

  async createABTest(testData) {
    try {
      const test = await supabaseService.create(this.abTestsTableName, {
        name: testData.name,
        description: testData.description || '',
        status: 'draft',
        variants: {
          control: {
            name: 'Control',
            visitors: 0,
            conversions: 0,
            conversionRate: 0
          },
          variant: {
            name: 'Variant A',
            visitors: 0,
            conversions: 0,
            conversionRate: 0
          }
        },
        confidence: 0,
        duration: 0,
        start_date: null,
        end_date: null
      })

      await supabaseService.logActivity(
        'create',
        'ab_test',
        test.id,
        `Created A/B test: ${test.name}`,
        {test_type: 'checkout_optimization'}
      )

      return test
    } catch (error) {
      console.error('Error creating A/B test:', error)
      throw error
    }
  }

  async toggleABTest(testId, active) {
    try {
      const status = active ? 'running' : 'paused'
      const updates = {
        status,
        start_date: active ? new Date().toISOString() : null
      }

      const test = await supabaseService.update(this.abTestsTableName, testId, updates)

      await supabaseService.logActivity(
        'update',
        'ab_test',
        testId,
        `${active ? 'Started' : 'Paused'} A/B test: ${test.name}`,
        {status}
      )

      return test
    } catch (error) {
      console.error('Error toggling A/B test:', error)
      throw error
    }
  }

  async getRecommendations() {
    return [
      {
        id: 1,
        title: 'Simplify Payment Form',
        description: 'Reduce payment form fields from 12 to 6 essential fields',
        priority: 'high',
        effort: 'low',
        expectedImpact: '15-25% conversion increase',
        icon: 'FiEdit',
        steps: [
          'Remove optional fields like company name',
          'Use address auto-complete',
          'Combine name fields into single field',
          'Make phone number optional'
        ]
      },
      {
        id: 2,
        title: 'Add Trust Signals',
        description: 'Display security badges and customer testimonials at checkout',
        priority: 'medium',
        effort: 'low',
        expectedImpact: '8-12% conversion increase',
        icon: 'FiShield',
        steps: [
          'Add SSL certificate badge',
          'Display customer reviews',
          'Show money-back guarantee',
          'Add security certifications'
        ]
      },
      {
        id: 3,
        title: 'Optimize Mobile Experience',
        description: 'Redesign checkout flow specifically for mobile devices',
        priority: 'high',
        effort: 'high',
        expectedImpact: '30-45% mobile conversion increase',
        icon: 'FiSmartphone',
        steps: [
          'Implement single-column layout',
          'Increase button sizes',
          'Optimize form inputs for mobile',
          'Add mobile payment options'
        ]
      }
    ]
  }

  getDefaultOptimizationData() {
    return {
      overview: {
        conversionRate: 3.2,
        cartAbandonmentRate: 68.5,
        averageOrderValue: 127.50,
        revenuePerVisitor: 4.08
      },
      criticalIssues: [],
      formAnalytics: []
    }
  }

  getDefaultABTests() {
    return [
      {
        id: 1,
        name: 'Simplified Checkout Form',
        description: 'Testing reduced form fields vs. current form',
        status: 'running',
        variants: {
          control: {
            visitors: 1250,
            conversions: 87,
            conversionRate: 6.96
          },
          variant: {
            visitors: 1189,
            conversions: 95,
            conversionRate: 7.99
          }
        },
        confidence: 78,
        duration: 14
      },
      {
        id: 2,
        name: 'Trust Badge Placement',
        description: 'Testing trust badges above vs. below payment form',
        status: 'completed',
        variants: {
          control: {
            visitors: 2340,
            conversions: 156,
            conversionRate: 6.67
          },
          variant: {
            visitors: 2298,
            conversions: 171,
            conversionRate: 7.44
          }
        },
        confidence: 92,
        duration: 21
      }
    ]
  }
}

export const checkoutOptimizationService = new CheckoutOptimizationService()
export default checkoutOptimizationService