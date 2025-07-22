import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import  useAuth  from '../hooks/UseAuth';
import ComponentLoader from '../components/ComponentLoader'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <ComponentLoader></ComponentLoader>; // Or a spinner component
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;