/**
 * Public axios client — bare instance, no auth
 */
import axios, { type AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

export { apiClient };
