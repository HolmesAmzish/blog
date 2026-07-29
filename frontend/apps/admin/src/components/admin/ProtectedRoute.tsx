/**
 * Protected Route — OIDC-based guard for admin pages
 */
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setAuthed);
  }, []);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#0047FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (!authed) return <Navigate to="/login" replace />;

  return <>{children}</>;
}