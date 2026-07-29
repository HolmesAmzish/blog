import { get, put, del } from './client';
import type { UserDTO } from '@blog/types';

export const fetchUsers = async (): Promise<UserDTO[]> =>
  get<UserDTO[]>('/users');

export const deleteUser = async (id: number): Promise<void> =>
  del<void>(`/users/${id}`);

export const updateUserRole = async (id: number, role: string): Promise<UserDTO> =>
  put<UserDTO>(`/users/${id}/role?role=${role}`);

export const setUserEnabled = async (id: number, enabled: boolean): Promise<UserDTO> =>
  put<UserDTO>(`/users/${id}/enabled?enabled=${enabled}`);