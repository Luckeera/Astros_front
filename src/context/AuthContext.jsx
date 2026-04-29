import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { API_BASE_URL } from '../services/api';
import LoginScreen from '../pages/LoginScreen';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (!res.ok) throw new Error('Token expirado');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.detail || 'Falha no login');
    }

    const { access_token } = await res.json();
    localStorage.setItem('token', access_token);
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const authValue = useMemo(() => ({ user, token, login, logout, loading }), [user, token, loading]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center font-bold gap-4 bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA900]"></div>
      <span className="text-gray-600 font-black uppercase tracking-widest text-xs">Sincronizando Astros...</span>
    </div>
  );

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
