import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');

        if (userId && token) {
          setIsAuthenticated(true);
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid data
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (userData) => {
    try {
      setIsAuthenticated(true);
      setUser(userData);
      
      // Store authentication data
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      console.log('User logged in:', userData);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    try {
      setIsAuthenticated(false);
      setUser(null);
      
      // Clear authentication data
      localStorage.removeItem('userId');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;