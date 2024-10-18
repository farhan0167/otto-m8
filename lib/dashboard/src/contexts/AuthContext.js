import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false); // Done loading from localStorage
  }, []);

  const login = (authToken) => {
    setToken(authToken);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {!loading && children} {/* Render children only if loading is false */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
