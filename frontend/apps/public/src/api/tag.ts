/**
 * Public tag API — read-only
 */
import { get } from './client';
import type { TagVo } from '@blog/types';

export const fetchTags = async (language?: string): Promise<TagVo[]> => {
  const params = language ? `?language=${language}` : '';
  return get<TagVo[]>(`/tags${params}`);
};
