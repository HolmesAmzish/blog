/**
 * useAuth Hook
 * Manages authentication state and operations
 */
import { useState, useEffect, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as authApi from '../api/auth';
import type { LoginRequest, RegisterRequest, UserDTO } from '../types';

/**
 * Hook for managing authentication state
 */
export function useAuth() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (request: LoginRequest) => {
      await authApi.login(request);
      // After successful login, fetch user info
      const userInfo = await authApi.fetchCurrentUser();
      return userInfo;
    },
    onSuccess: (userInfo) => {
      setUser(userInfo);
      navigate('/admin');
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (request: RegisterRequest) => authApi.register(request),
    onSuccess: () => {
      // Registration successful - user needs to login
      navigate('/admin/login');
    },
  });

  // Logout function
  const handleLogout = useCallback(() => {
    authApi.logout();
    setUser(null);
    navigate('/admin/login');
  }, [navigate]);

  // Check if authenticated (has token)
  const isAuthenticated = authApi.isAuthenticated();

  // Check if user is admin
  const isAdmin = authApi.isAdmin();

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: handleLogout,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}
