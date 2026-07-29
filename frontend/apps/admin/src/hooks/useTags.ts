import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTags, createTag, updateTag, deleteTag } from '../api/tag';
import type { TagVo, TagUpsertRequest } from '@blog/types';

export const useTags = (language?: string) =>
  useQuery<TagVo[], Error>({
    queryKey: ['admin-tags', language],
    queryFn: () => fetchTags(language),
    staleTime: 10 * 60 * 1000,
  });

export const useCreateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: TagUpsertRequest) => createTag(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-tags'] }),
  });
};

export const useUpdateTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: TagUpsertRequest) => updateTag(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-tags'] }),
  });
};

export const useDeleteTag = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteTag(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-tags'] }),
  });
};
