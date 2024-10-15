import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const RequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Render child routes if authenticated
};

export default RequireAuth;
