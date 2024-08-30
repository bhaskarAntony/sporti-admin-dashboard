import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../popup/Loading';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    console.log('token', token);
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
      const response = await axios.post(`https://sporti-backend-live-p00l.onrender.com/api/auth/validateToken`, {}, {
        withCredentials: true
      });
      console.log(response);
      if (response.status === 200) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    console.log(process.env.REACT_APP_BACKEND_URL);
    try {
      const response = await axios.post(`https://sporti-backend-live-p00l.onrender.com/api/admin/login`, { username, password }, { withCredentials: true });
      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        toast.success('Login is successfull')
        navigate('/');
        setLoading(false)

      }
    } catch (error) {
      setLoading(false)
      toast.error('Login is failed, please try again later')
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };
  if(loading){
    return <Loading/>
}

  return (
    <AuthContext.Provider value={{ isAuthenticated, user,login, logout, validateToken, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);