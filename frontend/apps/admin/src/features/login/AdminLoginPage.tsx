/**
 * Admin Login — redirects to Keycloak OIDC
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../../api/auth';

export function AdminLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated().then(authed => {
      if (authed) navigate('/admin', { replace: true });
      else login();
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Redirecting to login...
        </p>
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#0047FF] rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}