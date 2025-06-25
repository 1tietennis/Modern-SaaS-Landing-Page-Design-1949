import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import toast from 'react-hot-toast';

const { FiGlobe, FiCode, FiCopy, FiCheck, FiExternalLink, FiSettings, FiZap } = FiIcons;

const WebsiteConnection = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('tracking');
  const [copied, setCopied] = useState(false);

  const trackingCode = `<!-- CyborgCRM Tracking Code -->
<script>
  (function(c,y,b,o,r,g){
    c.CyborgCRM=c.CyborgCRM||function(){
      (c.CyborgCRM.q=c.CyborgCRM.q||[]).push(arguments)
    };
    c.CyborgCRM.l=1*new Date();
    g=y.createElement(b),o=y.getElementsByTagName(b)[0];
    g.async=1;g.src=r;o.parentNode.insertBefore(g,o)
  })(window,document,'script','https://cdn.cyborgcrm.com/tracking.js');
  
  CyborgCRM('init', 'YOUR_WEBSITE_ID');
  CyborgCRM('track', 'pageview');
</script>`;

  const pixelCode = `<!-- CyborgCRM Conversion Pixel -->
<script>
  CyborgCRM('track', 'conversion', {
    event: 'purchase',
    value: 99.99,
    currency: 'USD'
  });
</script>`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
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
                <SafeIcon icon={FiGlobe} className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Connect Your Website</h2>
                <p className="text-cyan-100">Track visitors, conversions, and optimize performance</p>
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
              { id: 'tracking', label: 'Tracking Code', icon: FiCode },
              { id: 'pixel', label: 'Conversion Pixel', icon: FiZap },
              { id: 'wordpress', label: 'WordPress Plugin', icon: FiSettings },
              { id: 'shopify', label: 'Shopify App', icon: FiExternalLink }
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
                <h3 className="text-xl font-semibold text-white mb-3">Universal Tracking Code</h3>
                <p className="text-gray-300 mb-4">
                  Add this code to the &lt;head&gt; section of every page on your website to start tracking visitors and their behavior.
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-green-400 font-mono text-sm">HTML</span>
                  <button
                    onClick={() => copyToClipboard(trackingCode)}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-300 text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{trackingCode}</code>
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">What it tracks:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Page views</li>
                    <li>• User sessions</li>
                    <li>• Traffic sources</li>
                    <li>• Device information</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Benefits:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Real-time analytics</li>
                    <li>• Visitor behavior insights</li>
                    <li>• Conversion tracking</li>
                    <li>• Performance optimization</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Privacy:</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• GDPR compliant</li>
                    <li>• Cookie consent ready</li>
                    <li>• Data anonymization</li>
                    <li>• Secure tracking</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'pixel' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Conversion Tracking Pixel</h3>
                <p className="text-gray-300 mb-4">
                  Add this code to your thank you pages, checkout completion pages, or any page where conversions happen.
                </p>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-blue-400 font-mono text-sm">JavaScript</span>
                  <button
                    onClick={() => copyToClipboard(pixelCode)}
                    className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={copied ? FiCheck : FiCopy} className="w-4 h-4 text-gray-300" />
                    <span className="text-gray-300 text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="text-gray-300 text-sm overflow-x-auto">
                  <code>{pixelCode}</code>
                </pre>
              </div>

              <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">💡 Pro Tip:</h4>
                <p className="text-gray-300 text-sm">
                  Customize the conversion tracking by changing the event type and adding relevant data like purchase value, product categories, or lead quality scores.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'wordpress' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">WordPress Plugin</h3>
                <p className="text-gray-300 mb-4">
                  Install our WordPress plugin for automatic tracking setup and advanced features.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiSettings} className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">CyborgCRM WordPress Plugin</h4>
                <p className="text-gray-300 text-sm mb-4">
                  One-click installation with automatic tracking, form integration, and WooCommerce support.
                </p>
                <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
                  Download Plugin
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Features:</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Automatic tracking code injection</li>
                    <li>• Contact form integration</li>
                    <li>• WooCommerce conversion tracking</li>
                    <li>• Lead scoring automation</li>
                    <li>• GDPR compliance tools</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Installation:</h4>
                  <ol className="text-gray-300 text-sm space-y-2">
                    <li>1. Download the plugin file</li>
                    <li>2. Upload via WordPress admin</li>
                    <li>3. Activate the plugin</li>
                    <li>4. Enter your API key</li>
                    <li>5. Configure tracking settings</li>
                  </ol>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'shopify' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Shopify Integration</h3>
                <p className="text-gray-300 mb-4">
                  Connect your Shopify store for complete e-commerce tracking and customer journey analytics.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SafeIcon icon={FiExternalLink} className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-white mb-2">CyborgCRM Shopify App</h4>
                <p className="text-gray-300 text-sm mb-4">
                  Advanced e-commerce analytics, customer segmentation, and automated marketing campaigns.
                </p>
                <button className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
                  Install from Shopify App Store
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">E-commerce Tracking:</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Product page views</li>
                    <li>• Add to cart events</li>
                    <li>• Checkout abandonment</li>
                    <li>• Purchase completion</li>
                    <li>• Customer lifetime value</li>
                  </ul>
                </div>
                <div className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-3">Marketing Automation:</h4>
                  <ul className="text-gray-300 text-sm space-y-2">
                    <li>• Abandoned cart recovery</li>
                    <li>• Post-purchase follow-up</li>
                    <li>• Customer segmentation</li>
                    <li>• Personalized recommendations</li>
                    <li>• Review request automation</li>
                  </ul>
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
              <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all">
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WebsiteConnection;