import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import TrackingCodeGenerator from './TrackingCodeGenerator';
import toast from 'react-hot-toast';

const { FiGlobe, FiCode, FiCopy, FiCheck, FiExternalLink, FiSettings, FiZap, FiActivity } = FiIcons;

const WebsiteConnection = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [copied, setCopied] = useState(false);
  const [showTrackingGenerator, setShowTrackingGenerator] = useState(false);

  const trackingCode = `<!-- CyborgCRM Advanced Analytics -->
<script>
(function(c,y,b,o,r,g){
  c.CyborgCRM=c.CyborgCRM||function(){
    (c.CyborgCRM.q=c.CyborgCRM.q||[]).push(arguments)
  };
  c.CyborgCRM.l=1*new Date();
  g=y.createElement(b),o=y.getElementsByTagName(b)[0];
  g.async=1;g.src=r;o.parentNode.insertBefore(g,o)
})(window,document,'script','https://cdn.cyborgcrm.com/analytics.js');

// Initialize with comprehensive tracking
CyborgCRM('init', 'YOUR_SITE_ID', {
  trackPageViews: true,
  trackClicks: true,
  trackScrollDepth: true,
  trackTimeOnPage: true,
  trackConversions: true
});

// Track page view with visitor data
CyborgCRM('track', 'pageview', {
  page_title: document.title,
  page_url: window.location.href,
  visitor_id: CyborgCRM.getVisitorId(),
  session_id: CyborgCRM.getSessionId()
});

console.log('🚀 CyborgCRM Analytics Active');
</script>`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
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
          className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <SafeIcon icon={FiActivity} className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Advanced Website Analytics</h2>
                  <p className="text-cyan-100">Track visitors, clicks, time spent, and conversions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <SafeIcon icon={FiCode} className="w-5 h-5 rotate-45" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-gray-700 px-6 py-4">
            <div className="flex space-x-1">
              {[
                { id: 'tracking', label: 'Analytics Tracking', icon: FiActivity },
                { id: 'features', label: 'Features', icon: FiZap },
                { id: 'setup', label: 'Quick Setup', icon: FiSettings },
                { id: 'examples', label: 'Examples', icon: FiCode }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-cyan-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'tracking' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Comprehensive Analytics Tracking</h3>
                  <p className="text-gray-300 mb-4">
                    Monitor every aspect of your website performance with our advanced tracking system:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: FiActivity, title: 'Real-time Visitors', desc: 'Track active users and their journey' },
                    { icon: FiZap, title: 'Click Tracking', desc: 'Monitor all button and link interactions' },
                    { icon: FiGlobe, title: 'Page Performance', desc: 'Measure time spent on each page' },
                    { icon: FiSettings, title: 'Conversion Events', desc: 'Track form submissions and goals' }
                  ].map((feature, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <SafeIcon icon={feature.icon} className="w-5 h-5 text-cyan-400" />
                        <h4 className="font-medium text-white">{feature.title}</h4>
                      </div>
                      <p className="text-gray-300 text-sm">{feature.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-green-400 font-mono text-sm">HTML/JavaScript</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowTrackingGenerator(true)}
                        className="flex items-center space-x-2 bg-cyan-500 hover:bg-cyan-600 px-3 py-1 rounded-lg transition-colors text-sm"
                      >
                        <SafeIcon icon={FiSettings} className="w-4 h-4" />
                        <span>Customize</span>
                      </button>
                      <button
                        onClick={() => copyToClipboard(trackingCode)}
                        className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors"
                      >
                        <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-300 text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                  <pre className="text-gray-300 text-sm overflow-x-auto">
                    <code>{trackingCode}</code>
                  </pre>
                </div>
              </motion.div>
            )}

            {activeTab === 'features' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Analytics Features</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">📊 Visitor Analytics</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Daily unique visitors tracking</li>
                      <li>• Session duration monitoring</li>
                      <li>• Device and browser detection</li>
                      <li>• Geographic location data</li>
                      <li>• Return vs new visitor analysis</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">🖱️ Interaction Tracking</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Click heatmap generation</li>
                      <li>• Button and link tracking</li>
                      <li>• Form interaction monitoring</li>
                      <li>• Scroll depth measurement</li>
                      <li>• Exit intent detection</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">⏱️ Time Analytics</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Page visit duration</li>
                      <li>• Average session time</li>
                      <li>• Time-based engagement metrics</li>
                      <li>• Peak activity hours</li>
                      <li>• Bounce rate calculation</li>
                    </ul>
                  </div>

                  <div className="bg-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-4">🎯 Conversion Tracking</h4>
                    <ul className="space-y-2 text-gray-300 text-sm">
                      <li>• Goal completion tracking</li>
                      <li>• Form submission monitoring</li>
                      <li>• E-commerce event tracking</li>
                      <li>• Custom event logging</li>
                      <li>• Conversion funnel analysis</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-2">🔒 Privacy First</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    Our analytics system is built with privacy in mind, ensuring compliance with GDPR, CCPA, and other privacy regulations.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-400" />
                      <span className="text-green-100">IP Anonymization</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-400" />
                      <span className="text-green-100">Cookie Consent</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-4 h-4 text-green-400" />
                      <span className="text-green-100">Data Retention Control</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'setup' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Quick Setup Guide</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      step: '1',
                      title: 'Copy Tracking Code',
                      description: 'Copy the analytics tracking code from the Tracking tab',
                      action: 'Copy Code'
                    },
                    {
                      step: '2',
                      title: 'Install on Website',
                      description: 'Paste the code in the <head> section of every page',
                      action: 'View Guide'
                    },
                    {
                      step: '3',
                      title: 'Verify Installation',
                      description: 'Check that tracking is working in the analytics dashboard',
                      action: 'Test Now'
                    },
                    {
                      step: '4',
                      title: 'Monitor Results',
                      description: 'View real-time data and visitor analytics',
                      action: 'Open Dashboard'
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                      <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <p className="text-gray-300 text-sm">{item.description}</p>
                      </div>
                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors text-sm">
                        {item.action}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-400 mb-3">💡 Pro Tips</h4>
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li>• Install tracking on all pages for complete visitor journey mapping</li>
                    <li>• Use custom events to track specific business goals</li>
                    <li>• Set up conversion goals to measure success</li>
                    <li>• Regular monitoring helps optimize user experience</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'examples' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-semibold text-white mb-6">Implementation Examples</h3>
                
                <div className="space-y-6">
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                    <h4 className="font-medium text-white mb-3">Custom Event Tracking</h4>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{`// Track custom events
CyborgCRM('track', 'button_click', {
  button_name: 'signup',
  page_section: 'header',
  user_type: 'visitor'
});

// Track form submissions
CyborgCRM('track', 'form_submission', {
  form_name: 'contact_form',
  form_fields: ['name', 'email', 'phone'],
  lead_score: 85
});

// Track conversions
CyborgCRM('track', 'conversion', {
  conversion_type: 'purchase',
  value: 99.99,
  currency: 'USD',
  product_id: 'premium_plan'
});`}</code>
                    </pre>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                    <h4 className="font-medium text-white mb-3">E-commerce Tracking</h4>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{`// Track product views
CyborgCRM('track', 'product_view', {
  product_id: 'SKU123',
  product_name: 'Premium Widget',
  category: 'Electronics',
  price: 49.99
});

// Track add to cart
CyborgCRM('track', 'add_to_cart', {
  product_id: 'SKU123',
  quantity: 2,
  value: 99.98
});

// Track purchases
CyborgCRM('track', 'purchase', {
  transaction_id: 'TXN789',
  value: 149.97,
  currency: 'USD',
  items: [{
    product_id: 'SKU123',
    quantity: 3,
    price: 49.99
  }]
});`}</code>
                    </pre>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                    <h4 className="font-medium text-white mb-3">Advanced User Tracking</h4>
                    <pre className="text-green-400 text-sm overflow-x-auto">
                      <code>{`// Set user properties
CyborgCRM('identify', {
  user_id: 'user_123',
  email: 'user@example.com',
  plan: 'premium',
  signup_date: '2024-01-15'
});

// Track user journey
CyborgCRM('track', 'page_view', {
  page_category: 'product',
  time_on_page: 120,
  scroll_depth: 75,
  previous_page: '/landing'
});`}</code>
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-700 px-6 py-4 border-t border-gray-600">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-300">
                Need help? Contact our support team at{' '}
                <span className="text-cyan-400">support@cyborgcrm.com</span>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    copyToClipboard(trackingCode)
                    toast.success('Ready to track! Install the code and check analytics in 5 minutes.')
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {showTrackingGenerator && (
        <TrackingCodeGenerator onClose={() => setShowTrackingGenerator(false)} />
      )}
    </>
  );
};

export default WebsiteConnection;