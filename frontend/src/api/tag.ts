/**
 * Tag API endpoints
 * Maps to backend TagController
 */
import { get, post, put, del } from './client';
import type { TagDTO, TagRequest } from '../types';

const BASE_PATH = '/tags';

/**
 * Fetch all tags
 */
export const fetchTags = async (): Promise<TagDTO[]> => {
  return get<TagDTO[]>(BASE_PATH);
};

/**
 * Fetch single tag by ID
 */
export const fetchTagById = async (id: number): Promise<TagDTO> => {
  return get<TagDTO>(`${BASE_PATH}/${id}`);
};

/**
 * Fetch tag by slug
 */
export const fetchTagBySlug = async (slug: string): Promise<TagDTO> => {
  return get<TagDTO>(`${BASE_PATH}/slug/${slug}`);
};

/**
 * Create new tag
 */
export const createTag = async (request: TagRequest): Promise<TagDTO> => {
  return post<TagDTO, TagRequest>(BASE_PATH, request);
};

/**
 * Update existing tag
 */
export const updateTag = async (id: number, request: TagRequest): Promise<TagDTO> => {
  return put<TagDTO, TagRequest>(`${BASE_PATH}/${id}`, request);
};

/**
 * Delete tag
 */
export const deleteTag = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};
