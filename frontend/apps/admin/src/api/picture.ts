import { get, post, put, del } from './client';
import type { PictureDTO } from '@/types';

export const fetchPictures = async (page = 0, size = 20): Promise<any> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return get<any>(`/api/pictures?${params}`);
};

export const uploadPicture = async (file: File): Promise<PictureDTO> => {
  const formData = new FormData();
  formData.append('file', file);
  return post<PictureDTO>('/api/pictures/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updatePictureAlt = async (id: number, alt: string): Promise<PictureDTO> =>
  put<PictureDTO>(`/api/pictures/${id}/alt`, { alt });

export const deletePicture = async (id: number): Promise<void> =>
  del<void>(`/api/pictures/${id}`);
