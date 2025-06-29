import React, { useState } from 'react'
import { motion } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import toast from 'react-hot-toast'

const { FiCode, FiCopy, FiCheck, FiSettings, FiEye } = FiIcons

const TrackingCodeGenerator = ({ onClose }) => {
  const [copied, setCopied] = useState(false)
  const [trackingSettings, setTrackingSettings] = useState({
    trackPageViews: true,
    trackClicks: true,
    trackScrollDepth: true,
    trackTimeOnPage: true,
    trackFormSubmissions: true,
    trackFileDownloads: true
  })

  const generateTrackingCode = () => {
    const settings = Object.entries(trackingSettings)
      .filter(([key, value]) => value)
      .map(([key]) => key)

    return `<!-- CyborgCRM Advanced Website Tracking -->
<script>
(function(c,y,b,o,r,g){
  c.CyborgCRM=c.CyborgCRM||function(){
    (c.CyborgCRM.q=c.CyborgCRM.q||[]).push(arguments)
  };
  c.CyborgCRM.l=1*new Date();
  g=y.createElement(b),o=y.getElementsByTagName(b)[0];
  g.async=1;g.src=r;o.parentNode.insertBefore(g,o)
})(window,document,'script','https://cdn.cyborgcrm.com/analytics.js');

// Initialize tracking with your site ID
CyborgCRM('init', 'SITE_${Date.now()}', {
  // Tracking configuration
  trackPageViews: ${trackingSettings.trackPageViews},
  trackClicks: ${trackingSettings.trackClicks},
  trackScrollDepth: ${trackingSettings.trackScrollDepth},
  trackTimeOnPage: ${trackingSettings.trackTimeOnPage},
  trackFormSubmissions: ${trackingSettings.trackFormSubmissions},
  trackFileDownloads: ${trackingSettings.trackFileDownloads},
  
  // Privacy settings
  respectDNT: true,
  anonymizeIP: true,
  cookieConsent: true
});

${trackingSettings.trackPageViews ? `
// Track page view
CyborgCRM('track', 'pageview', {
  page_title: document.title,
  page_url: window.location.href,
  referrer: document.referrer
});` : ''}

${trackingSettings.trackClicks ? `
// Track important clicks
CyborgCRM('trackClicks', {
  buttons: true,
  links: true,
  forms: true
});` : ''}

${trackingSettings.trackFormSubmissions ? `
// Track form submissions
CyborgCRM('trackForms', {
  onSubmit: function(formData) {
    CyborgCRM('track', 'form_submission', {
      form_id: formData.form_id,
      form_name: formData.form_name,
      fields: formData.fields
    });
  }
});` : ''}

${trackingSettings.trackScrollDepth ? `
// Track scroll depth
CyborgCRM('trackScroll', {
  thresholds: [25, 50, 75, 90, 100]
});` : ''}

// Custom event tracking function
window.trackEvent = function(eventName, properties) {
  CyborgCRM('track', eventName, properties);
};

// Track conversions
window.trackConversion = function(conversionData) {
  CyborgCRM('track', 'conversion', {
    value: conversionData.value,
    currency: conversionData.currency || 'USD',
    event_category: conversionData.category,
    event_label: conversionData.label
  });
};

console.log('🚀 CyborgCRM Analytics loaded successfully!');
</script>

<!-- Optional: E-commerce tracking -->
<script>
// Track e-commerce events (if applicable)
window.trackPurchase = function(purchaseData) {
  CyborgCRM('track', 'purchase', {
    transaction_id: purchaseData.transaction_id,
    value: purchaseData.value,
    currency: purchaseData.currency,
    items: purchaseData.items
  });
};

// Track add to cart
window.trackAddToCart = function(item) {
  CyborgCRM('track', 'add_to_cart', {
    item_id: item.id,
    item_name: item.name,
    category: item.category,
    quantity: item.quantity,
    value: item.price
  });
};
</script>

<!-- Status: ✅ READY FOR DEPLOYMENT -->`
  }

  const copyToClipboard = () => {
    const code = generateTrackingCode()
    navigator.clipboard.writeText(code)
    setCopied(true)
    toast.success('Tracking code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div className="bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Advanced Tracking Code Generator</h3>
              <p className="text-gray-400">Customize your website tracking configuration</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <SafeIcon icon={FiCode} className="w-5 h-5 rotate-45" />
            </button>
          </div>
        </div>

        <div className="flex">
          {/* Settings Panel */}
          <div className="w-1/3 p-6 border-r border-gray-600">
            <h4 className="font-semibold text-white mb-4 flex items-center">
              <SafeIcon icon={FiSettings} className="w-4 h-4 mr-2" />
              Tracking Features
            </h4>
            
            <div className="space-y-4">
              {[
                { key: 'trackPageViews', label: 'Page Views', description: 'Track when users visit pages' },
                { key: 'trackClicks', label: 'Click Events', description: 'Track button and link clicks' },
                { key: 'trackScrollDepth', label: 'Scroll Depth', description: 'Track how far users scroll' },
                { key: 'trackTimeOnPage', label: 'Time on Page', description: 'Track session duration' },
                { key: 'trackFormSubmissions', label: 'Form Submissions', description: 'Track form completions' },
                { key: 'trackFileDownloads', label: 'File Downloads', description: 'Track PDF and file downloads' }
              ].map((setting) => (
                <label key={setting.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={trackingSettings[setting.key]}
                    onChange={(e) => setTrackingSettings(prev => ({
                      ...prev,
                      [setting.key]: e.target.checked
                    }))}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">{setting.label}</p>
                    <p className="text-gray-400 text-xs">{setting.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-700 rounded-lg">
              <h5 className="font-medium text-white mb-2">Privacy Compliant</h5>
              <div className="space-y-1 text-xs text-gray-300">
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-3 h-3 mr-2 text-green-400" />
                  GDPR Compliant
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-3 h-3 mr-2 text-green-400" />
                  Cookie Consent Ready
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-3 h-3 mr-2 text-green-400" />
                  IP Anonymization
                </div>
                <div className="flex items-center">
                  <SafeIcon icon={FiCheck} className="w-3 h-3 mr-2 text-green-400" />
                  Respect Do Not Track
                </div>
              </div>
            </div>
          </div>

          {/* Code Panel */}
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-white flex items-center">
                <SafeIcon icon={FiCode} className="w-4 h-4 mr-2" />
                Generated Tracking Code
              </h4>
              <button
                onClick={copyToClipboard}
                className="flex items-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 border border-gray-600 max-h-96 overflow-y-auto">
              <pre className="text-green-400 text-sm">
                <code>{generateTrackingCode()}</code>
              </pre>
            </div>

            <div className="mt-4 space-y-3">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <h5 className="font-medium text-blue-400 mb-2">📋 Installation Instructions</h5>
                <ol className="text-sm text-gray-300 space-y-1">
                  <li>1. Copy the generated code above</li>
                  <li>2. Paste it in the &lt;head&gt; section of every page</li>
                  <li>3. Replace SITE_ID with your actual site identifier</li>
                  <li>4. Test the tracking using the analytics dashboard</li>
                </ol>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h5 className="font-medium text-green-400 mb-2">✨ Custom Event Tracking</h5>
                <div className="text-sm text-gray-300 space-y-1">
                  <p><code className="bg-gray-800 px-2 py-1 rounded">trackEvent('button_click', {'{button_name: "signup"}'});</code></p>
                  <p><code className="bg-gray-800 px-2 py-1 rounded">trackConversion({'{value: 99.99, category: "purchase"}'});</code></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-600 bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-300">
              <SafeIcon icon={FiEye} className="w-4 h-4 mr-2 inline" />
              Track everything your visitors do with privacy-first analytics
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
                  copyToClipboard()
                  toast.success('Ready to implement! Check your analytics dashboard in 5 minutes.')
                }}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Deploy Tracking
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default TrackingCodeGenerator