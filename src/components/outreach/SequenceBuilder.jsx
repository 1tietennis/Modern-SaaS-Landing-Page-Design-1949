import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SafeIcon from '../../common/SafeIcon'
import * as FiIcons from 'react-icons/fi'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import toast from 'react-hot-toast'

const { FiPlus, FiMail, FiLinkedin, FiEdit, FiTrash2, FiMove, FiSave, FiClock, FiMessageSquare, FiUserPlus, FiEye } = FiIcons

const SequenceBuilder = ({ sequence, onSave, onCancel }) => {
  const [sequenceData, setSequenceData] = useState(sequence || {
    name: '',
    description: '',
    steps: []
  })
  const [showAddStep, setShowAddStep] = useState(false)
  const [editingStep, setEditingStep] = useState(null)

  const stepTemplates = {
    email: {
      introduction: {
        subject: "Quick question about {{company_name}}",
        content: `Hi {{first_name}},

I noticed {{company_name}} is {{recent_activity}}. I'm curious - how are you currently handling {{pain_point}}?

At {{our_company}}, we've helped similar companies like {{similar_company}} {{specific_result}}.

Would you be open to a brief 15-minute call to discuss how we might help {{company_name}} achieve similar results?

Best regards,
{{sender_name}}`
      },
      follow_up: {
        subject: "Re: {{company_name}} - Following up",
        content: `Hi {{first_name}},

I wanted to follow up on my previous email about helping {{company_name}} with {{pain_point}}.

I understand you're probably busy, but I thought you might find this relevant: {{case_study_link}}

This shows exactly how we helped {{similar_company}} {{specific_result}} in just {{timeframe}}.

Would next Tuesday or Wednesday work for a quick call?

Best,
{{sender_name}}`
      },
      value_add: {
        subject: "{{first_name}}, thought this might interest you",
        content: `Hi {{first_name}},

I came across this article about {{industry_trend}} and thought of {{company_name}}: {{article_link}}

It reminded me of our conversation about {{pain_point}}. The article mentions exactly what we discussed regarding {{specific_topic}}.

If you'd like to explore how {{company_name}} could leverage this trend, I'd be happy to share some specific strategies that have worked for companies in your space.

Best regards,
{{sender_name}}`
      }
    },
    linkedin: {
      connection: {
        content: `Hi {{first_name}}, I'd love to connect with you. I noticed {{company_name}} is {{recent_activity}} and thought we might have some interesting insights to share about {{industry_topic}}.`
      },
      message: {
        content: `Hi {{first_name}},

Thanks for connecting! I saw that {{company_name}} is {{recent_activity}}. 

We've been helping companies like {{similar_company}} {{specific_result}}. Would you be interested in a brief chat about how we might help {{company_name}} achieve similar outcomes?

Best regards,
{{sender_name}}`
      },
      follow_up: {
        content: `Hi {{first_name}},

Hope you're doing well! I wanted to follow up on my message about helping {{company_name}} with {{pain_point}}.

I just shared a case study with {{similar_company}} that might be relevant: {{case_study_link}}

Would love to hear your thoughts!

Best,
{{sender_name}}`
      }
    }
  }

  const StepForm = ({ step, onSave, onCancel }) => {
    const [formData, setFormData] = useState(step || {
      type: 'email',
      channel: 'email',
      delay_days: 0,
      subject: '',
      content: '',
      template: ''
    })

    const handleTemplateSelect = (templateKey) => {
      const template = stepTemplates[formData.channel][templateKey]
      setFormData(prev => ({
        ...prev,
        template: templateKey,
        subject: template.subject || '',
        content: template.content
      }))
    }

    const handleSubmit = (e) => {
      e.preventDefault()
      onSave(formData)
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      >
        <div className="bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-600">
            <h3 className="text-xl font-bold text-white">
              {step ? 'Edit Step' : 'Add New Step'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData(prev => ({ ...prev, channel: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="email">Email</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {formData.channel === 'email' && (
                    <>
                      <option value="introduction">Introduction</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="value_add">Value Add</option>
                    </>
                  )}
                  {formData.channel === 'linkedin' && (
                    <>
                      <option value="connection">Connection Request</option>
                      <option value="message">Direct Message</option>
                      <option value="follow_up">Follow Up</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Delay (Days)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.delay_days}
                  onChange={(e) => setFormData(prev => ({ ...prev, delay_days: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Quick Templates</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.keys(stepTemplates[formData.channel]).map(templateKey => (
                  <button
                    key={templateKey}
                    type="button"
                    onClick={() => handleTemplateSelect(templateKey)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      formData.template === templateKey
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <p className="font-medium text-white text-sm capitalize">{templateKey.replace('_', ' ')}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.channel === 'email' ? 'Email template' : 'LinkedIn template'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {formData.channel === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter email subject"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {formData.channel === 'email' ? 'Email Content' : 'LinkedIn Message'}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={12}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter message content..."
              />
            </div>

            {/* Personalization Variables */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-white mb-2">Available Variables</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                  '{{first_name}}', '{{last_name}}', '{{company_name}}',
                  '{{job_title}}', '{{industry}}', '{{recent_activity}}',
                  '{{pain_point}}', '{{similar_company}}', '{{specific_result}}',
                  '{{our_company}}', '{{sender_name}}', '{{case_study_link}}'
                ].map(variable => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea')
                      const start = textarea.selectionStart
                      const end = textarea.selectionEnd
                      const text = formData.content
                      const before = text.substring(0, start)
                      const after = text.substring(end)
                      setFormData(prev => ({
                        ...prev,
                        content: before + variable + after
                      }))
                    }}
                    className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-500 transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {step ? 'Update Step' : 'Add Step'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    )
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return

    const steps = Array.from(sequenceData.steps)
    const [reorderedStep] = steps.splice(result.source.index, 1)
    steps.splice(result.destination.index, 0, reorderedStep)

    setSequenceData(prev => ({ ...prev, steps }))
  }

  const addStep = (stepData) => {
    const newStep = {
      ...stepData,
      id: Date.now(),
      order: sequenceData.steps.length + 1
    }
    setSequenceData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }))
    setShowAddStep(false)
  }

  const updateStep = (stepData) => {
    setSequenceData(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === editingStep.id ? { ...step, ...stepData } : step
      )
    }))
    setEditingStep(null)
  }

  const deleteStep = (stepId) => {
    setSequenceData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Sequence Name</label>
            <input
              type="text"
              value={sequenceData.name}
              onChange={(e) => setSequenceData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter sequence name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <input
              type="text"
              value={sequenceData.description}
              onChange={(e) => setSequenceData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Brief description"
            />
          </div>
        </div>
      </div>

      {/* Sequence Steps */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-600">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Sequence Steps</h3>
          <button
            onClick={() => setShowAddStep(true)}
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors flex items-center"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4 mr-2" />
            Add Step
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sequence-steps">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {sequenceData.steps.map((step, index) => (
                  <Draggable key={step.id} draggableId={step.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-gray-700 rounded-lg p-4 border border-gray-600 ${
                          snapshot.isDragging ? 'shadow-2xl' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <div
                              {...provided.dragHandleProps}
                              className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-move"
                            >
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <SafeIcon 
                                  icon={step.channel === 'email' ? FiMail : FiLinkedin}
                                  className={`w-5 h-5 ${step.channel === 'email' ? 'text-blue-400' : 'text-blue-500'}`}
                                />
                                <span className="font-medium text-white capitalize">
                                  {step.type.replace('_', ' ')}
                                </span>
                                <span className="text-gray-400 text-sm">
                                  {step.delay_days === 0 ? 'Immediate' : `Day ${step.delay_days}`}
                                </span>
                              </div>
                              {step.subject && (
                                <p className="text-gray-300 text-sm mb-1">
                                  <strong>Subject:</strong> {step.subject}
                                </p>
                              )}
                              <p className="text-gray-400 text-sm line-clamp-2">
                                {step.content.substring(0, 120)}...
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setEditingStep(step)}
                              className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                              <SafeIcon icon={FiEdit} className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteStep(step.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {sequenceData.steps.length === 0 && (
          <div className="text-center py-12">
            <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No steps added yet</p>
            <button
              onClick={() => setShowAddStep(true)}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
            >
              Add Your First Step
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(sequenceData)}
          className="flex-1 bg-primary-500 text-white py-3 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4 mr-2" />
          Save Sequence
        </button>
      </div>

      {/* Add Step Modal */}
      <AnimatePresence>
        {showAddStep && (
          <StepForm
            onSave={addStep}
            onCancel={() => setShowAddStep(false)}
          />
        )}
      </AnimatePresence>

      {/* Edit Step Modal */}
      <AnimatePresence>
        {editingStep && (
          <StepForm
            step={editingStep}
            onSave={updateStep}
            onCancel={() => setEditingStep(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default SequenceBuilder