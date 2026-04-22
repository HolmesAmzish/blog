/**
 * Image API endpoints
 * Maps to backend ImageController
 */
import { get, post, del } from './client';
import type { ImageDTO, ImagePageResponse } from '../types';

const BASE_PATH = '/images';

/**
 * Fetch paginated images
 */
export const fetchImages = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
  sortDir: string = 'desc'
): Promise<ImagePageResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sortBy', sortBy);
  params.append('sortDir', sortDir);

  return get<ImagePageResponse>(`${BASE_PATH}?${params.toString()}`);
};

/**
 * Fetch single image by ID
 */
export const fetchImageById = async (id: number): Promise<ImageDTO> => {
  return get<ImageDTO>(`${BASE_PATH}/${id}`);
};

/**
 * Upload image
 */
export const uploadImage = async (
  file: File,
  uploaderId?: number,
  alt?: string
): Promise<ImageDTO> => {
  const formData = new FormData();
  formData.append('file', file);
  if (uploaderId) formData.append('uploaderId', uploaderId.toString());
  if (alt) formData.append('alt', alt);

  return post<ImageDTO, FormData>(`${BASE_PATH}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Update image alt text
 */
export const updateImageAlt = async (id: number, alt: string): Promise<ImageDTO> => {
  return post<ImageDTO>(`${BASE_PATH}/${id}/alt`, { alt });
};

/**
 * Delete image
 */
export const deleteImage = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};
