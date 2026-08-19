import { get, post, put, del } from './client';
import type { TagVo, TagUpsertRequest } from '@/types';

/** GET /api/admin/tags — returns raw Tag entities (admin view) */
export const fetchTags = async (_language?: string): Promise<TagVo[]> =>
  get<TagVo[]>('/api/admin/tags');

export const fetchTagEntities = async (): Promise<TagVo[]> =>
  get<TagVo[]>('/api/admin/tags');

export const createTag = async (request: TagUpsertRequest): Promise<TagVo> =>
  post<TagVo>('/api/admin/tags', request);

export const updateTag = async (request: TagUpsertRequest): Promise<TagVo> =>
  put<TagVo>(`/api/admin/tags/${request.id}`, request);

export const deleteTag = async (id: number): Promise<void> =>
  del<void>(`/api/admin/tags/${id}`);
