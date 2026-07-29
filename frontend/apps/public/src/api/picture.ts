/**
 * Public picture API — read-only
 */
import { get } from './client';
import type { PictureDTO } from '@blog/types';

export const fetchPictureById = async (id: number): Promise<PictureDTO> =>
  get<PictureDTO>(`/pictures/${id}`);
