import React, { useState } from 'react'
import ClientPortal from '../components/clients/ClientPortal'
import DigitalAssistant from '../components/documents/DigitalAssistant'

const ClientPortalPage = () => {
  const [showAssistant, setShowAssistant] = useState(false)

  // Mock client data - in production, this would come from authentication
  const clientData = {
    name: 'Sarah Johnson',
    company: 'TechStart Inc.',
    email: 'sarah@techstart.com'
  }

  return (
    <>
      <ClientPortal />
      <DigitalAssistant 
        isOpen={showAssistant}
        onToggle={() => setShowAssistant(!showAssistant)}
        clientData={clientData}
      />
    </>
  )
}

export default ClientPortalPage