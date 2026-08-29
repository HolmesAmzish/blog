import { get } from './client';
import type { PictureVo } from '@/types/picture';
import type { PageResponse } from '@/types/common';

export const fetchGallery = async (page = 0, size = 24): Promise<PageResponse<PictureVo>> =>
  get<PageResponse<PictureVo>>(`/api/pictures?page=${page}&size=${size}&sort=createdAt,desc`);

export const fetchPicture = async (id: number): Promise<PictureVo> =>
  get<PictureVo>(`/api/pictures/${id}`);
