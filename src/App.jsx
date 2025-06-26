import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { QuestProvider } from '@questlabs/react-sdk'
import '@questlabs/react-sdk/dist/style.css'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import LoginPage from './components/auth/LoginPage'
import OnboardingPage from './components/auth/OnboardingPage'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import GetStarted from './pages/GetStarted'
import Outreach from './pages/Outreach'
import ClientPortalPage from './pages/ClientPortal'
import Proposals from './pages/Proposals'
import Contacts from './pages/Contacts'
import Projects from './pages/Projects'
import Todos from './pages/Todos'
import Goals from './pages/Goals'
import MultiSites from './pages/MultiSites'
import Websites from './pages/Websites'
import Packages from './pages/Packages'
import Contact from './pages/Contact'
import Tickets from './pages/Tickets'
import Sales from './pages/Sales'
import Marketing from './pages/Marketing'
import Automation from './pages/Automation'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import AIAgent from './components/ai/AIAgent'
import HelpHub from './components/help/HelpHub'
import { questConfig } from './config/questConfig'

function App() {
  const [showAIAgent, setShowAIAgent] = useState(false)
  const [leads, setLeads] = useState([])

  const handleLeadCapture = (leadData) => {
    setLeads(prev => [...prev, { ...leadData, id: Date.now() }])
    console.log('Lead captured via AI:', leadData)
  }

  return (
    <AuthProvider>
      <QuestProvider
        apiKey={questConfig.APIKEY}
        entityId={questConfig.ENTITYID}
        apiType="PRODUCTION"
      >
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />

          {/* Protected Routes */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/get-started" element={<GetStarted />} />
                  <Route path="/outreach" element={<Outreach />} />
                  <Route path="/client-portal" element={<ClientPortalPage />} />
                  <Route path="/proposals" element={<Proposals />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/todos" element={<Todos />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/multi-sites" element={<MultiSites />} />
                  <Route path="/websites" element={<Websites />} />
                  <Route path="/packages" element={<Packages />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/tickets" element={<Tickets />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/marketing" element={<Marketing />} />
                  <Route path="/automation" element={<Automation />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Layout>
              {/* Help Hub - Only show when authenticated */}
              <HelpHub />
            </ProtectedRoute>
          } />
        </Routes>

        {/* AI Agent - Only show when authenticated */}
        <AIAgent 
          isOpen={showAIAgent}
          onToggle={() => setShowAIAgent(!showAIAgent)}
          onLeadCapture={handleLeadCapture}
        />

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#ffffff',
              border: '1px solid #374151'
            }
          }}
        />
      </QuestProvider>
    </AuthProvider>
  )
}

export default App