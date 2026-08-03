import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../api/category';
import type { CategoryEntity, CategoryUpsertRequest } from '@/types';

export const useCategories = () =>
  useQuery<CategoryEntity[], Error>({
    queryKey: ['admin-categories'],
    queryFn: fetchCategories,
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
    mutationFn: ({ id, req }: { id: number; req: CategoryUpsertRequest }) => updateCategory(id, req),
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
