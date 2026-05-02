/**
 * Tags Hooks
 * React Query hooks for tag operations
 */
import { useQuery } from '@tanstack/react-query';
import { fetchTags, fetchTagBySlug } from '../api/tag';
import type { TagVo } from '../types';

const TAGS_KEY = 'tags';

/**
 * Hook to fetch all tags
 */
export const useTags = () => {
  return useQuery<TagVo[], Error>({
    queryKey: [TAGS_KEY],
    queryFn: fetchTags,
  });
};

/**
 * Hook to fetch a tag by slug
 */
export const useTagBySlug = (slug: string | null) => {
  return useQuery<TagVo, Error>({
    queryKey: [TAGS_KEY, 'slug', slug],
    queryFn: () => fetchTagBySlug(slug!),
    enabled: !!slug,
  });
};
