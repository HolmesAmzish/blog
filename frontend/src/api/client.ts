/**
 * Axios client configuration
 * Centralized HTTP client for all API requests
 */
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const API_BASE_URL = '/api';

/**
 * Create configured axios instance
 */
const createAxiosClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - add auth token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Only redirect to login for auth-related endpoints or admin endpoints
        const requestUrl = error.config.url || '';
        if (requestUrl.includes('/auth/me') || requestUrl.includes('/admin')) {
          localStorage.removeItem('auth_token');
          window.location.href = '/admin/login';
        } else {
          // For public endpoints, just remove the token but don't redirect
          localStorage.removeItem('auth_token');
        }
      }
      return Promise.reject(error);
    }
  );

  return client;
};

export const apiClient = createAxiosClient();

/**
 * Generic GET request
 */
export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

/**
 * Generic POST request
 */
export const post = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

/**
 * Generic PUT request
 */
export const put = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

/**
 * Generic DELETE request
 */
export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};
