/**
 * Protected Route Component
 * Guards admin routes, redirects to login if not authenticated
 */
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

/**
 * Protected Route Component
 */
export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}