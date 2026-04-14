/**
 * Custom hook for category data fetching using TanStack Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchCategories,
  fetchCategoryTree,
  fetchCategoryById,
  fetchCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/category';
import type { CategoryDTO, CategoryRequest } from '../types';

const CATEGORIES_QUERY_KEY = 'categories';
const CATEGORY_QUERY_KEY = 'category';

/**
 * Hook for fetching all categories
 */
export const useCategories = () => {
  return useQuery<CategoryDTO[], Error>({
    queryKey: [CATEGORIES_QUERY_KEY],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories rarely change
  });
};

/**
 * Hook for fetching category tree
 */
export const useCategoryTree = () => {
  return useQuery<CategoryDTO, Error>({
    queryKey: [CATEGORIES_QUERY_KEY, 'tree'],
    queryFn: fetchCategoryTree,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching single category by ID
 */
export const useCategoryById = (id: number | null) => {
  return useQuery<CategoryDTO, Error>({
    queryKey: [CATEGORY_QUERY_KEY, id],
    queryFn: () => {
      if (id === null) throw new Error('Category ID is required');
      return fetchCategoryById(id);
    },
    enabled: id !== null,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for fetching category by slug
 */
export const useCategoryBySlug = (slug: string | null) => {
  return useQuery<CategoryDTO, Error>({
    queryKey: [CATEGORY_QUERY_KEY, 'slug', slug],
    queryFn: () => {
      if (!slug) throw new Error('Category slug is required');
      return fetchCategoryBySlug(slug);
    },
    enabled: slug !== null && slug !== '',
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Hook for creating category
 */
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoryDTO, Error, CategoryRequest>({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
};

/**
 * Hook for updating category
 */
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<CategoryDTO, Error, { id: number; request: CategoryRequest }>({
    mutationFn: ({ id, request }) => updateCategory(id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
};

/**
 * Hook for deleting category
 */
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
    },
  });
};
