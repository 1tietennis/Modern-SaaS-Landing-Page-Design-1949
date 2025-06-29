import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import checkoutOptimizationService from '../../lib/checkoutOptimization'

const { FiShoppingCart, FiTrendingUp, FiUsers, FiDollarSign, FiZap, FiTarget, FiBarChart3, FiSettings, FiEye, FiMousePointer, FiClock, FiAlertTriangle, FiCheckCircle, FiX, FiRefreshCw, FiEdit, FiPlay, FiPause } = FiIcons

const CheckoutOptimizer = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [optimizationData, setOptimizationData] = useState({})
  const [abTests, setAbTests] = useState([])
  const [funnelData, setFunnelData] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOptimizationData()
  }, [])

  const loadOptimizationData = async () => {
    setIsLoading(true)
    try {
      const [optimization, tests, funnel, recs] = await Promise.all([
        checkoutOptimizationService.getOptimizationData(),
        checkoutOptimizationService.getABTests(),
        checkoutOptimizationService.getFunnelData(),
        checkoutOptimizationService.getRecommendations()
      ])
      
      setOptimizationData(optimization)
      setAbTests(tests)
      setFunnelData(funnel)
      setRecommendations(recs)
    } catch (error) {
      console.error('Error loading optimization data:', error)
      toast.error('Failed to load optimization data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateTest = async (testData) => {
    try {
      const newTest = await checkoutOptimizationService.createABTest(testData)
      setAbTests(prev => [newTest, ...prev])
      toast.success('A/B test created successfully!')
    } catch (error) {
      toast.error('Failed to create A/B test')
    }
  }

  const handleToggleTest = async (testId, active) => {
    try {
      const updatedTest = await checkoutOptimizationService.toggleABTest(testId, active)
      setAbTests(prev => prev.map(test => test.id === testId ? updatedTest : test))
      toast.success(active ? 'Test activated!' : 'Test paused!')
    } catch (error) {
      toast.error('Failed to update test')
    }
  }

  const getStepColor = (conversionRate) => {
    if (conversionRate >= 80) return 'text-green-400'
    if (conversionRate >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Overall Conversion Rate',
            value: `${optimizationData.overview?.conversionRate || 0}%`,
            change: '+2.3%',
            icon: FiTrendingUp,
            color: 'from-green-400 to-emerald-500'
          },
          {
            label: 'Cart Abandonment',
            value: `${optimizationData.overview?.cartAbandonmentRate || 0}%`,
            change: '-1.5%',
            icon: FiShoppingCart,
            color: 'from-red-400 to-pink-500'
          },
          {
            label: 'Average Order Value',
            value: `$${optimizationData.overview?.averageOrderValue || 0}`,
            change: '+8.2%',
            icon: FiDollarSign,
            color: 'from-blue-400 to-cyan-500'
          },
          {
            label: 'Revenue Per Visitor',
            value: `$${optimizationData.overview?.revenuePerVisitor || 0}`,
            change: '+12.7%',
            icon: FiUsers,
            color: 'from-purple-400 to-indigo-500'
          }
        ].map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-r ${metric.color} rounded-xl`}>
                <SafeIcon icon={metric.icon} className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {metric.change}
              </span>
            </div>
            <div>
              <h3 className="text-gray-400 text-sm font-medium mb-1">{metric.label}</h3>
              <p className="text-2xl font-bold text-white">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Conversion Funnel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-xl font-bold text-white mb-6">Checkout Conversion Funnel</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {funnelData.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative">
                <div className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center mb-3 ${
                  step.conversionRate >= 80 ? 'border-green-400 bg-green-400/20' :
                  step.conversionRate >= 60 ? 'border-yellow-400 bg-yellow-400/20' :
                  'border-red-400 bg-red-400/20'
                }`}>
                  <SafeIcon icon={step.icon} className={`w-8 h-8 ${getStepColor(step.conversionRate)}`} />
                </div>
                {index < funnelData.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gray-600 -z-10"></div>
                )}
              </div>
              <h4 className="font-semibold text-white mb-1">{step.name}</h4>
              <p className="text-2xl font-bold text-white mb-1">{step.visitors.toLocaleString()}</p>
              <p className={`text-sm font-medium ${getStepColor(step.conversionRate)}`}>
                {step.conversionRate}% conversion
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {step.dropOffRate}% drop-off
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Top Issues & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Critical Issues</h3>
          <div className="space-y-3">
            {optimizationData.criticalIssues?.map((issue, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <SafeIcon icon={FiAlertTriangle} className="w-5 h-5 text-red-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{issue.title}</h4>
                  <p className="text-gray-300 text-sm">{issue.description}</p>
                  <p className="text-red-400 text-sm font-medium mt-1">Impact: {issue.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Quick Wins</h3>
          <div className="space-y-3">
            {recommendations.filter(rec => rec.effort === 'low').slice(0, 3).map((rec, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <SafeIcon icon={FiZap} className="w-5 h-5 text-green-400 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-white">{rec.title}</h4>
                  <p className="text-gray-300 text-sm">{rec.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-green-400 text-sm font-medium">+{rec.expectedImpact}</span>
                    <button className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors text-sm">
                      Implement
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )

  const renderABTests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">A/B Tests</h2>
        <button
          onClick={() => handleCreateTest({
            name: 'New Checkout Test',
            type: 'checkout_flow',
            status: 'draft'
          })}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
        >
          <SafeIcon icon={FiTarget} className="w-4 h-4 mr-2" />
          Create Test
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {abTests.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-700 rounded-xl p-6 border border-gray-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white mb-1">{test.name}</h3>
                <p className="text-gray-400 text-sm">{test.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  test.status === 'running' ? 'bg-green-500/20 text-green-400' :
                  test.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {test.status}
                </span>
                <button
                  onClick={() => handleToggleTest(test.id, test.status !== 'running')}
                  className={`p-2 rounded-lg transition-colors ${
                    test.status === 'running' ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'
                  }`}
                >
                  <SafeIcon icon={test.status === 'running' ? FiPause : FiPlay} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-600 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Control</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visitors:</span>
                    <span className="text-white">{test.variants.control.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conversions:</span>
                    <span className="text-white">{test.variants.control.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span className="text-white">{test.variants.control.conversionRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-600 rounded-lg p-3">
                <h4 className="text-white font-medium mb-2">Variant</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Visitors:</span>
                    <span className="text-white">{test.variants.variant.visitors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Conversions:</span>
                    <span className="text-white">{test.variants.variant.conversions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rate:</span>
                    <span className={`${test.variants.variant.conversionRate > test.variants.control.conversionRate ? 'text-green-400' : 'text-red-400'}`}>
                      {test.variants.variant.conversionRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                Confidence: {test.confidence}% | Duration: {test.duration} days
              </div>
              <div className="flex space-x-2">
                <button className="bg-gray-600 text-white py-1 px-3 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                  <SafeIcon icon={FiEye} className="w-3 h-3 mr-1 inline" />
                  View
                </button>
                <button className="bg-blue-500 text-white py-1 px-3 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  <SafeIcon icon={FiEdit} className="w-3 h-3 mr-1 inline" />
                  Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const renderHeatmaps = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">User Behavior Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Click Heatmap</h3>
          <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiMousePointer} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Click heatmap visualization</p>
              <p className="text-gray-500 text-sm">Shows where users click most</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
        >
          <h3 className="text-lg font-bold text-white mb-4">Scroll Heatmap</h3>
          <div className="bg-gray-700 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <SafeIcon icon={FiEye} className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-400">Scroll depth visualization</p>
              <p className="text-gray-500 text-sm">Shows how far users scroll</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <h3 className="text-lg font-bold text-white mb-4">Form Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {optimizationData.formAnalytics?.map((field, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">{field.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Completion Rate:</span>
                  <span className={`${field.completionRate >= 80 ? 'text-green-400' : field.completionRate >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {field.completionRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Time:</span>
                  <span className="text-white">{field.avgTimeSpent}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Drop-off Rate:</span>
                  <span className="text-red-400">{field.dropOffRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )

  const renderRecommendations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Optimization Recommendations</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {recommendations.map((rec, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  rec.priority === 'high' ? 'bg-red-500/20' :
                  rec.priority === 'medium' ? 'bg-yellow-500/20' :
                  'bg-green-500/20'
                }`}>
                  <SafeIcon icon={rec.icon} className={`w-5 h-5 ${
                    rec.priority === 'high' ? 'text-red-400' :
                    rec.priority === 'medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{rec.title}</h3>
                  <p className="text-gray-300 text-sm mb-2">{rec.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      rec.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {rec.priority} priority
                    </span>
                    <span className="text-gray-400">
                      Effort: {rec.effort}
                    </span>
                    <span className="text-green-400">
                      Expected: +{rec.expectedImpact}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition-colors text-sm">
                  Details
                </button>
                <button className="bg-primary-500 text-white px-3 py-1 rounded-lg hover:bg-primary-600 transition-colors text-sm">
                  Implement
                </button>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Implementation Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
                {rec.steps?.map((step, stepIndex) => (
                  <li key={stepIndex}>{step}</li>
                ))}
              </ol>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiBarChart3 },
    { id: 'abtests', label: 'A/B Tests', icon: FiTarget },
    { id: 'heatmaps', label: 'User Behavior', icon: FiEye },
    { id: 'recommendations', label: 'Recommendations', icon: FiZap }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-2xl p-6 border border-gray-600"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Checkout Optimization</h1>
            <p className="text-gray-400">Analyze and optimize your checkout funnel for maximum conversions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={loadOptimizationData}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
            >
              <SafeIcon icon={FiRefreshCw} className="w-4 h-4 mr-2" />
              Refresh Data
            </button>
            <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
              Export Report
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <SafeIcon icon={tab.icon} className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'abtests' && renderABTests()}
        {activeTab === 'heatmaps' && renderHeatmaps()}
        {activeTab === 'recommendations' && renderRecommendations()}
      </motion.div>
    </div>
  )
}

export default CheckoutOptimizer