import { get, post, put, del } from './client';
import type { TagVo, TagUpsertRequest } from '@/types';

export const fetchTags = async (language?: string): Promise<TagVo[]> => {
  const params = language ? `?language=${language}` : '';
  return get<TagVo[]>(`/api/tags${params}`);
};

export const fetchTagEntities = async (): Promise<TagVo[]> =>
  get<TagVo[]>('/api/tags/entity');

export const createTag = async (request: TagUpsertRequest): Promise<TagVo> =>
  post<TagVo>('/api/tags', request);

export const updateTag = async (request: TagUpsertRequest): Promise<TagVo> =>
  put<TagVo>(`/api/tags/${request.id}`, request);

export const deleteTag = async (id: number): Promise<void> =>
  del<void>(`/api/tags/${id}`);
