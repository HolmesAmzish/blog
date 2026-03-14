/**
 * Auth API
 * Corresponds to backend AuthController
 */
import { post, get } from './client';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, UserDTO } from '../types';

const BASE_URL = '/auth';

/**
 * Login - returns accessToken
 */
export const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await post<LoginResponse>(`${BASE_URL}/login`, request);
  // Store token in localStorage
  if (response.accessToken) {
    localStorage.setItem('auth_token', response.accessToken);
  }
  return response;
};

/**
 * Register
 */
export const register = async (request: RegisterRequest): Promise<RegisterResponse> => {
  const response = await post<RegisterResponse>(`${BASE_URL}/register`, request);
  return response;
};

/**
 * Logout
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = '/admin/login';
};

/**
 * Get current user info from API
 */
export const fetchCurrentUser = async (): Promise<UserDTO> => {
  const response = await get<UserDTO>(`${BASE_URL}/me`);
  // Store user info in localStorage
  localStorage.setItem('user', JSON.stringify(response));
  return response;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): UserDTO | null => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr) as UserDTO;
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};

/**
 * Check if user has admin role
 */
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'ADMIN';
};

/**
 * Get auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};