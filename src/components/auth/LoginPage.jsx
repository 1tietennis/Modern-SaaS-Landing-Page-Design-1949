import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { QuestLogin } from '@questlabs/react-sdk';
import { useAuth } from '../../context/AuthContext';
import { questConfig } from '../../config/questConfig';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiZap, FiShield, FiTrendingUp, FiUsers } = FiIcons;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Auto-signin configuration
  const AUTO_SIGNIN_CONFIG = {
    enabled: true, // Set to false to disable auto-signin
    email: 'demo@cyborgcrm.com',
    password: 'demo123'
  };

  useEffect(() => {
    // Auto-signin after component mounts
    if (AUTO_SIGNIN_CONFIG.enabled) {
      const timer = setTimeout(() => {
        handleAutoSignin();
      }, 1000); // 1 second delay to show the page briefly

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAutoSignin = () => {
    // Simulate successful login with auto-signin credentials
    const userData = {
      userId: questConfig.USER_ID,
      token: questConfig.TOKEN,
      email: AUTO_SIGNIN_CONFIG.email,
      newUser: false,
      loginTime: new Date().toISOString(),
      autoSignin: true
    };

    console.log('Auto-signin successful:', userData);
    
    // Update auth context
    login(userData);
    
    // Navigate to dashboard
    navigate('/');
  };

  const handleLogin = ({ userId, token, newUser }) => {
    console.log('Manual login successful:', { userId, token, newUser });
    
    // Create user data object
    const userData = {
      userId,
      token,
      newUser,
      loginTime: new Date().toISOString()
    };

    // Update auth context
    login(userData);

    // Navigate based on user status
    if (newUser) {
      console.log('New user detected, redirecting to onboarding');
      navigate('/onboarding');
    } else {
      console.log('Existing user, redirecting to dashboard');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }}
          ></div>
        </div>

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
              Welcome Back to the Future of
              <span className="block bg-gradient-to-r from-cyan-200 to-white bg-clip-text text-transparent">
                Digital Marketing
              </span>
            </h1>

            <p className="text-xl text-primary-100 mb-12 leading-relaxed">
              Transform your business with AI-powered marketing automation, advanced analytics, and seamless customer management.
            </p>

            {/* Auto-signin notification */}
            {AUTO_SIGNIN_CONFIG.enabled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mb-8 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <SafeIcon icon={FiZap} className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Auto-Signin Enabled</h3>
                    <p className="text-primary-100 text-sm">Signing you in automatically with demo credentials...</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Features */}
            <div className="space-y-6">
              {[
                { icon: FiZap, title: 'AI-Powered Automation', desc: 'Smart workflows that work 24/7' },
                { icon: FiTrendingUp, title: 'Advanced Analytics', desc: 'Data-driven insights for growth' },
                { icon: FiShield, title: 'Enterprise Security', desc: 'Bank-level protection for your data' },
                { icon: FiUsers, title: 'Team Collaboration', desc: 'Seamless teamwork across projects' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-4"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <SafeIcon icon={feature.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{feature.title}</h3>
                    <p className="text-primary-100 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-32 w-16 h-16 bg-cyan-400/20 rounded-full backdrop-blur-sm"
        />
      </div>

      {/* Right Section - Login Form */}
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
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <span className="text-2xl font-bold text-gray-900">CyborgCRM</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-600">
              Enter your credentials to access your dashboard
            </p>
            
            {/* Auto-signin status for mobile */}
            {AUTO_SIGNIN_CONFIG.enabled && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-700 text-sm font-medium">
                  🚀 Auto-signin enabled - Logging you in automatically!
                </p>
              </div>
            )}
          </motion.div>

          {/* Quest Login Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white rounded-2xl"
            style={{ minHeight: '400px' }}
          >
            <QuestLogin
              onSubmit={handleLogin}
              email={true}
              google={false}
              accent={questConfig.PRIMARY_COLOR}
            />
          </motion.div>

          {/* Demo Credentials Display */}
          {AUTO_SIGNIN_CONFIG.enabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 p-4 bg-gray-50 rounded-lg"
            >
              <h4 className="font-semibold text-gray-900 mb-2">Demo Credentials:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Email:</strong> {AUTO_SIGNIN_CONFIG.email}</p>
                <p><strong>Password:</strong> {AUTO_SIGNIN_CONFIG.password}</p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Auto-signin will use these credentials automatically
              </p>
            </motion.div>
          )}

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;