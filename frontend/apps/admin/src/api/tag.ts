import { get, post, put, del } from './client';
import type { TagVo, TagUpsertRequest } from '@blog/types';

export const fetchTags = async (language?: string): Promise<TagVo[]> => {
  const params = language ? `?language=${language}` : '';
  return get<TagVo[]>(`/tags${params}`);
};

export const fetchTagEntities = async (): Promise<TagVo[]> =>
  get<TagVo[]>('/tags/entity');

export const createTag = async (request: TagUpsertRequest): Promise<TagVo> =>
  post<TagVo>('/tags', request);

export const updateTag = async (request: TagUpsertRequest): Promise<TagVo> =>
  put<TagVo>(`/tags/${request.id}`, request);

export const deleteTag = async (id: number): Promise<void> =>
  del<void>(`/tags/${id}`);