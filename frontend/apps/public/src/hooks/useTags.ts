import { useQuery } from '@tanstack/react-query';
import { fetchTags } from '../api/tag';
import type { TagVo } from '@blog/types';

export const useTags = (language?: string) =>
  useQuery<TagVo[], Error>({
    queryKey: ['tags', language],
    queryFn: () => fetchTags(language),
    staleTime: 5 * 60 * 1000,
  });