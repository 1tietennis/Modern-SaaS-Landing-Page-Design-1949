import { loadStripe } from '@stripe/stripe-js'

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key_here')

export default stripePromise

export const createPaymentIntent = async (amount, currency = 'usd', metadata = {}) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency,
        metadata
      })
    })
    
    return await response.json()
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export const marketingPackages = [
  {
    id: 'starter',
    name: 'Starter Package',
    price: 997,
    description: 'Perfect for small businesses getting started',
    features: [
      'Custom Website Design',
      'Basic SEO Setup',
      'Social Media Management (2 platforms)',
      'Monthly Analytics Report',
      'Email Marketing Setup'
    ],
    popular: false
  },
  {
    id: 'professional',
    name: 'Professional Package',
    price: 2497,
    description: 'Comprehensive marketing for growing businesses',
    features: [
      'Premium Website Design & Development',
      'Advanced SEO & Local SEO',
      'Social Media Management (5 platforms)',
      'Google Ads Management',
      'Email Marketing Automation',
      'Content Creation (8 posts/month)',
      'Monthly Strategy Call',
      'Detailed Analytics & Reporting'
    ],
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    price: 4997,
    description: 'Full-service marketing for established companies',
    features: [
      'Custom Web Application',
      'Enterprise SEO Strategy',
      'Omnichannel Social Media',
      'Multi-Platform Ad Management',
      'Advanced Marketing Automation',
      'Content Marketing Strategy',
      'Video Marketing',
      'Weekly Strategy Calls',
      'Real-time Dashboard Access',
      'Dedicated Account Manager'
    ],
    popular: false
  }
]