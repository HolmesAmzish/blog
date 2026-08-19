/**
 * User admin API — aligns with backend UserController @RequestMapping("/api/users")
 * @see /home/cacc/Repositories/blog/backend/blog-app/src/main/kotlin/cn/arorms/blog/app/controllers/admin/UserController.kt:12
 * NOTE: backend currently all endpoints commented out → admin UI will 404 until backend re-enabled.
 * If backend moves to /api/admin/users, update these paths accordingly.
 */
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
