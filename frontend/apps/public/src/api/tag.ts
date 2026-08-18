/**
 * Public tag API — read-only
 */
import { get } from './client';
import type { TagVo } from '@/types';

export const fetchTags = async (language?: string): Promise<TagVo[]> => {
  const params = language ? `?language=${language}` : '';
  return get<TagVo[]>(`/api/tags${params}`);
};
