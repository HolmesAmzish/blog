import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api/category';
import type { CategoryVo, CategoryUpsertRequest } from '@blog/types';

export const useCategories = (language?: string) =>
  useQuery<CategoryVo[], Error>({
    queryKey: ['admin-categories', language],
    queryFn: () => fetchCategories(language),
    staleTime: 10 * 60 * 1000,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CategoryUpsertRequest) => createCategory(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: CategoryUpsertRequest) => updateCategory(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-categories'] }),
  });
};
