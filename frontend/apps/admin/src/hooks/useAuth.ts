/**
 * useAuth Hook — OIDC-based authentication via Keycloak
 */
import { useState, useEffect, useCallback } from 'react';
import { login, logout, isAuthenticated, getUserInfo } from '../api/auth';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: { username: string; email: string } | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      const authed = await isAuthenticated();
      const user = authed ? await getUserInfo() : null;
      if (mounted) setState({ isAuthenticated: authed, loading: false, user });
    };
    check();
    return () => { mounted = false; };
  }, []);

  const handleLogin = useCallback(() => login(), []);
  const handleLogout = useCallback(() => logout(), []);

  return {
    ...state,
    login: handleLogin,
    logout: handleLogout,
  };
}