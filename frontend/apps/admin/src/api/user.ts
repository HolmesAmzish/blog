import { get, put, del } from './client';
import type { UserVo } from '@/types';

export const fetchUsers = async (): Promise<UserVo[]> =>
  get<UserVo[]>('/api/users');

export const deleteUser = async (id: number): Promise<void> =>
  del<void>(`/api/users/${id}`);

export const updateUserRole = async (id: number, role: string): Promise<UserVo> =>
  put<UserVo>(`/api/users/${id}/role?role=${role}`);

export const setUserEnabled = async (id: number, enabled: boolean): Promise<UserVo> =>
  put<UserVo>(`/api/users/${id}/enabled?enabled=${enabled}`);
