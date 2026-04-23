/**
 * User API
 * Corresponds to backend UserController
 */
import { get, put, del } from './client';
import type { UserDTO, PasswordChangeRequest } from '../types';

const BASE_URL = '/users';

/**
 * Get all users
 */
export const getAllUsers = async (): Promise<UserDTO[]> => {
  return get<UserDTO[]>(BASE_URL);
};

/**
 * Get user by ID
 */
export const getUserById = async (id: number): Promise<UserDTO> => {
  return get<UserDTO>(`${BASE_URL}/${id}`);
};

/**
 * Get user by username
 */
export const getUserByUsername = async (username: string): Promise<UserDTO> => {
  return get<UserDTO>(`${BASE_URL}/username/${username}`);
};

/**
 * Delete user
 */
export const deleteUser = async (id: number): Promise<void> => {
  return del<void>(`${BASE_URL}/${id}`);
};

/**
 * Change user password
 */
export const changePassword = async (id: number, request: PasswordChangeRequest): Promise<void> => {
  return put<void>(`${BASE_URL}/${id}/password`, request);
};

/**
 * Update user role
 */
export const updateUserRole = async (id: number, role: string): Promise<UserDTO> => {
  return put<UserDTO>(`${BASE_URL}/${id}/role?role=${role}`);
};

/**
 * Set user enabled status
 */
export const setUserEnabled = async (id: number, enabled: boolean): Promise<UserDTO> => {
  return put<UserDTO>(`${BASE_URL}/${id}/enabled?enabled=${enabled}`);
};