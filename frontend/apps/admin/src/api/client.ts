/**
 * Admin axios client — OIDC token injection
 */
import axios, { type AxiosRequestConfig } from 'axios';
import { getUserManager } from './auth';

const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  try {
    const mgr = getUserManager();
    const user = await mgr.getUser();
    if (user?.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }
  } catch {}
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const mgr = getUserManager();
      mgr.signinRedirect();
    }
    return Promise.reject(error);
  }
);

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

export const post = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

export const put = async <T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

export { apiClient };