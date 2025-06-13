import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedAdminRouteProps {
  redirectPath?: string;
}

/**
 * A wrapper component that protects admin routes
 * Redirects to login page if user is not authenticated as admin
 */
const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ 
  redirectPath = '/admin/login' 
}) => {
  const { isAdminAuthenticated } = useAuth();
  
  if (!isAdminAuthenticated()) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedAdminRoute;
