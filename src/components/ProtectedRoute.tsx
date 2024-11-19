import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Check if user is trying to access master admin area
  if (location.pathname.startsWith('/master-admin') && user.role !== 'master') {
    return <Navigate to="/login" replace />;
  }

  // Check if user is trying to access site admin area
  if (location.pathname.startsWith('/omniakid-admin') && user.role !== 'servant') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;