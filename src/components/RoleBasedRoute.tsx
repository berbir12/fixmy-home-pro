import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export function RoleBasedRoute({ 
  children, 
  allowedRoles, 
  fallbackPath = "/dashboard" 
}: RoleBasedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log('🔗 RoleBasedRoute:', { 
    userRole: user?.role, 
    allowedRoles, 
    isAuthenticated, 
    isLoading,
    pathname: location.pathname,
    timestamp: new Date().toISOString()
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    console.log('🔗 RoleBasedRoute: Redirecting to auth (not authenticated)');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (!allowedRoles.includes(user.role || 'customer')) {
    console.log('🔗 RoleBasedRoute: Redirecting to fallback (insufficient permissions)');
    return <Navigate to={fallbackPath} replace />;
  }

  console.log('🔗 RoleBasedRoute: Rendering children (authorized)');
  return <>{children}</>;
}
