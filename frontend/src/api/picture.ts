/**
 * Picture API endpoints
 * Maps to backend PictureController
 */
import { get, post, del } from './client';
import type { PictureDTO, PicturePageResponse } from '../types';

const BASE_PATH = '/pictures';

/**
 * Fetch paginated pictures
 */
export const fetchPictures = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
  sortDir: string = 'desc'
): Promise<PicturePageResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sortBy', sortBy);
  params.append('sortDir', sortDir);

  return get<PicturePageResponse>(`${BASE_PATH}?${params.toString()}`);
};

/**
 * Fetch single picture by ID
 */
export const fetchPictureById = async (id: number): Promise<PictureDTO> => {
  return get<PictureDTO>(`${BASE_PATH}/${id}`);
};

/**
 * Upload picture
 */
export const uploadPicture = async (
  file: File,
  uploaderId?: number,
  alt?: string
): Promise<PictureDTO> => {
  const formData = new FormData();
  formData.append('file', file);
  if (uploaderId) formData.append('uploaderId', uploaderId.toString());
  if (alt) formData.append('alt', alt);

  return post<PictureDTO, FormData>(`${BASE_PATH}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/**
 * Update picture alt text
 */
export const updatePictureAlt = async (id: number, alt: string): Promise<PictureDTO> => {
  return post<PictureDTO>(`${BASE_PATH}/${id}/alt`, { alt });
};

/**
 * Delete picture
 */
export const deletePicture = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};
