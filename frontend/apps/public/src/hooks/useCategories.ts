import { useQuery } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryTree } from '../api/category';
import type { CategoryVo, CategoryTreeNode } from '@/types';

export const useCategories = (language?: string) =>
  useQuery<CategoryVo[], Error>({
    queryKey: ['categories', language],
    queryFn: () => fetchCategories(language),
    staleTime: 10 * 60 * 1000,
  });

export const useCategoryTree = (language?: string) =>
  useQuery<CategoryTreeNode, Error>({
    queryKey: ['categories', 'tree', language],
    queryFn: () => fetchCategoryTree(language),
    staleTime: 10 * 60 * 1000,
  });