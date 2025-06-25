import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { OnBoarding } from '@questlabs/react-sdk';
import { questConfig } from '../../config/questConfig';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiCheckCircle, FiTrendingUp, FiZap, FiTarget, FiUsers } = FiIcons;

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  
  // Get user data from localStorage
  const userId = localStorage.getItem('userId') || questConfig.USER_ID;
  const token = localStorage.getItem('token') || questConfig.TOKEN;

  const getAnswers = () => {
    console.log('Onboarding completed with answers:', answers);
    
    // Mark onboarding as completed
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Navigate to main dashboard
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Visual/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-500 via-cyan-500 to-blue-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-11.046-8.954-20-20-20v20h20z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>
        </div>

        {/* Glass Effect Overlay */}
        <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <span className="text-3xl font-bold">CyborgCRM</span>
              </div>
            </div>

            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Let's Get Started!
              <span className="block bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
                We're Setting Things Up
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              We'll customize your CyborgCRM experience based on your business needs. 
              This quick setup will help us tailor the perfect solution for you.
            </p>

            {/* Setup Steps */}
            <div className="space-y-6">
              {[
                { icon: FiTarget, title: 'Define Your Goals', desc: 'Tell us what you want to achieve' },
                { icon: FiUsers, title: 'Setup Your Team', desc: 'Configure user roles and permissions' },
                { icon: FiZap, title: 'Choose Your Tools', desc: 'Select the features you need most' },
                { icon: FiTrendingUp, title: 'Launch & Grow', desc: 'Start scaling your business today' }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <SafeIcon icon={step.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                    <p className="text-white/80 text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="mt-12 p-6 bg-white/10 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center space-x-3 mb-3">
                <SafeIcon icon={FiCheckCircle} className="w-5 h-5 text-green-300" />
                <span className="text-white font-medium">Quick & Easy Setup</span>
              </div>
              <p className="text-white/80 text-sm">
                Takes less than 5 minutes to complete. You can always modify these settings later.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-15, 15, -15], rotate: [0, 180, 360] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 right-24 w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [15, -15, 15], rotate: [360, 180, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-40 right-16 w-16 h-16 bg-yellow-400/20 rounded-full backdrop-blur-sm"
        />
      </div>

      {/* Right Section - Onboarding Component */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            {/* Mobile Logo */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">CyborgCRM</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Aboard!</h2>
            <p className="text-gray-600">
              Let's personalize your experience in just a few steps
            </p>
          </motion.div>

          {/* Quest Onboarding Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl"
            style={{ minHeight: '400px' }}
          >
            <OnBoarding
              userId={userId}
              token={token}
              questId={questConfig.QUEST_ONBOARDING_QUESTID}
              answer={answers}
              setAnswer={setAnswers}
              getAnswers={getAnswers}
              accent={questConfig.PRIMARY_COLOR}
              singleChoose="modal1"
              multiChoice="modal2"
            >
              <OnBoarding.Header />
              <OnBoarding.Content />
              <OnBoarding.Footer />
            </OnBoarding>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@cyborgcrm.com" className="text-primary-600 hover:text-primary-700">
                support@cyborgcrm.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;