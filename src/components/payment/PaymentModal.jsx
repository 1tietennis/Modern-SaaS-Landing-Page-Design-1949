import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'

const { FiX, FiCreditCard, FiLock, FiCheck } = FiIcons

const CheckoutForm = ({ packageInfo, onSuccess, onCancel }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState(null)
  const [clientSecret, setClientSecret] = useState('')

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError(null)

    try {
      // In a real app, you'd create the payment intent on your server
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: packageInfo.price * 100, // Convert to cents
          currency: 'usd',
          metadata: {
            package_id: packageInfo.id,
            package_name: packageInfo.name
          }
        })
      })

      const { client_secret } = await response.json()

      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      })

      if (result.error) {
        setError(result.error.message)
        toast.error(result.error.message)
      } else {
        setSucceeded(true)
        toast.success('Payment successful!')
        onSuccess(result.paymentIntent)
      }
    } catch (err) {
      setError('Payment failed. Please try again.')
      toast.error('Payment failed. Please try again.')
    }

    setProcessing(false)
  }

  if (succeeded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <SafeIcon icon={FiCheck} className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600 mb-6">
          Thank you for choosing our {packageInfo.name} package. Our team will contact you within 24 hours to get started.
        </p>
        <button
          onClick={onCancel}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Close
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-2">{packageInfo.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold text-gray-900">${packageInfo.price}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Information
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <SafeIcon icon={FiLock} className="w-4 h-4 mr-2" />
        <span>Your payment information is secure and encrypted</span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700">
          {error}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-top-transparent mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <SafeIcon icon={FiCreditCard} className="w-4 h-4 mr-2" />
              Pay ${packageInfo.price}
            </>
          )}
        </button>
      </div>
    </form>
  )
}

const PaymentModal = ({ isOpen, onClose, packageInfo, stripePromise }) => {
  const handleSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent)
    // Here you would typically:
    // 1. Update your database
    // 2. Send confirmation email
    // 3. Update user's account
    setTimeout(onClose, 2000) // Close modal after 2 seconds
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Complete Payment</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                packageInfo={packageInfo}
                onSuccess={handleSuccess}
                onCancel={onClose}
              />
            </Elements>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PaymentModal