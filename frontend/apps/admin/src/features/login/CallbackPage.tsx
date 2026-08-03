/**
 * OIDC Callback — exchanges the authorization code for tokens
 */
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleCallback, isAuthenticated } from '../../api/auth';

export function CallbackPage() {
  const navigate = useNavigate();
  // StrictMode runs effects twice — the auth code can only be exchanged once
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;
    handleCallback().then(async user => {
      const ok = !!user || (await isAuthenticated());
      navigate(ok ? '/admin' : '/login', { replace: true });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="text-center">
        <p className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          Completing login...
        </p>
        <div className="w-8 h-8 border-2 border-gray-200 dark:border-gray-700 border-t-[#0047FF] rounded-full animate-spin mx-auto" />
      </div>
    </div>
  );
}