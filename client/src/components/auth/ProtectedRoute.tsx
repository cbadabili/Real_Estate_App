import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldIcon, LockIcon } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requiredPermissions?: string[];
  requireAdmin?: boolean;
  requireModerator?: boolean;
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAdmin = false,
  requireModerator = false,
  fallbackPath = '/login'
}) => {
  const { user, isLoading, isAdmin, isModerator, hasPermission } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <ShieldIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <CardTitle className="text-red-600">Admin Access Required</CardTitle>
            <CardDescription>
              You need administrator privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check moderator requirement
  if (requireModerator && !isModerator()) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <ShieldIcon className="w-16 h-16 mx-auto text-orange-500 mb-4" />
            <CardTitle className="text-orange-600">Moderator Access Required</CardTitle>
            <CardDescription>
              You need moderator or admin privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <LockIcon className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <CardTitle className="text-blue-600">Role Access Required</CardTitle>
            <CardDescription>
              Your current role ({user.role}) doesn't have access to this page.
              Required roles: {requiredRoles.join(', ')}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <LockIcon className="w-16 h-16 mx-auto text-purple-500 mb-4" />
              <CardTitle className="text-purple-600">Permission Required</CardTitle>
              <CardDescription>
                You don't have the required permissions to access this page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }
  }

  return <>{children}</>;
};

interface RoleBasedComponentProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  allowedPermissions?: string[];
  requireAdmin?: boolean;
  requireModerator?: boolean;
  fallback?: React.ReactNode;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
  children,
  allowedRoles = [],
  allowedPermissions = [],
  requireAdmin = false,
  requireModerator = false,
  fallback = null
}) => {
  const { user, isAdmin, isModerator, hasPermission } = useAuth();

  if (!user) return fallback;

  // Check admin requirement
  if (requireAdmin && !isAdmin()) return fallback;

  // Check moderator requirement
  if (requireModerator && !isModerator()) return fallback;

  // Check role requirements
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return fallback;

  // Check permission requirements
  if (allowedPermissions.length > 0) {
    const hasAllPermissions = allowedPermissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) return fallback;
  }

  return <>{children}</>;
};

// Utility component for property creation authorization
export const PropertyCreationGuard: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback = null 
}) => {
  const { user } = useAuth();
  
  const canCreateProperty = user && ['seller', 'agent', 'fsbo', 'admin'].includes(user.userType);
  
  return canCreateProperty ? <>{children}</> : fallback;
};