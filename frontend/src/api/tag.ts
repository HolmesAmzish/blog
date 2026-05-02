/**
 * Tag API endpoints
 * Maps to backend TagController
 */
import { get, post, put, del } from './client';
import type { TagVo, TagUpsertRequest } from '../types';

const BASE_PATH = '/tags';

/**
 * Fetch all tags
 */
export const fetchTags = async (): Promise<TagVo[]> => {
  return get<TagVo[]>(BASE_PATH);
};

/**
 * Fetch all tag entities (raw entity data for admin)
 */
export const fetchTagEntities = async (): Promise<TagVo[]> => {
  return get<TagVo[]>(`${BASE_PATH}/entity`);
};

/**
 * Fetch single tag by ID
 */
export const fetchTagById = async (id: number): Promise<TagVo> => {
  return get<TagVo>(`${BASE_PATH}/${id}`);
};

/**
 * Fetch tag by slug
 */
export const fetchTagBySlug = async (slug: string): Promise<TagVo> => {
  return get<TagVo>(`${BASE_PATH}/slug/${slug}`);
};

/**
 * Create new tag
 */
export const createTag = async (request: TagUpsertRequest): Promise<TagVo> => {
  return post<TagVo, TagUpsertRequest>(BASE_PATH, request);
};

/**
 * Update existing tag
 */
export const updateTag = async (request: TagUpsertRequest): Promise<TagVo> => {
  return put<TagVo, TagUpsertRequest>(`${BASE_PATH}/${request.id}`, request);
};

/**
 * Delete tag
 */
export const deleteTag = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};
