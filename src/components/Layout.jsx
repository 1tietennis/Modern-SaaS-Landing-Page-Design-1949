import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';
import WebsiteConnection from './website/WebsiteConnection';

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWebsiteConnection, setShowWebsiteConnection] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onConnectWebsite={() => setShowWebsiteConnection(true)} />
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Website Connection Modal */}
      <AnimatePresence>
        {showWebsiteConnection && (
          <WebsiteConnection
            isOpen={showWebsiteConnection}
            onClose={() => setShowWebsiteConnection(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;