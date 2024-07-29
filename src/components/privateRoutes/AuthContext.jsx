import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      validateToken(token).then(isValid => {
        setLoading(false);
        if (isValid) {
          setIsAuthenticated(true);
        } else {
          logout();
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.post('https://sporti-services-backend.onrender.com/api/auth/validateToken', {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 200) {
        setUser(response.data.user);
        document.title = response.data.user.role;
        setIsAuthenticated(true);
        console.log(isAuthenticated);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const login = (token, userData) => {
    Cookies.set('token', token, {
      // httpOnly: true,
      secure: true, // Ensure this is only set to true if your site is served over HTTPS
      sameSite: 'Strict',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      //  domain: process.env.NODE_ENV === 'production'? '.sporti-services.com' : undefined,
      //  path: '/',
       });
    setIsAuthenticated(true);
    setUser(userData);
    navigate('/');
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, validateToken, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);