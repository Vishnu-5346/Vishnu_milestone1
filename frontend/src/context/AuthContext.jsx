import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// Create Auth Context
const AuthContext = createContext();

// Set axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user token from storage on startup
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Configure axios authorization header globally
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register User
  const register = async (userData) => {
    setError(null);
    try {
      const response = await axios.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    }
  };

  // Login User
  const login = async (email, password, rememberMe) => {
    setError(null);
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { token: userToken, user: loggedUser } = response.data;

      // Store credentials based on rememberMe checkbox
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('token', userToken);
      storage.setItem('user', JSON.stringify(loggedUser));

      setToken(userToken);
      setUser(loggedUser);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;

      return loggedUser;
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password.';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        register,
        login,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'Administrator',
        isManager: user?.role === 'Campaign Manager',
        isCommTeam: user?.role === 'Communication Team'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
  return useContext(AuthContext);
};
