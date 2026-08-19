import { get, post, put, del } from './client';
import type { CategoryVo, CategoryUpsertRequest, CategoryEntity } from '@/types';

export const fetchCategories = async (): Promise<CategoryEntity[]> =>
  get<CategoryEntity[]>('/api/admin/categories');

export const fetchCategoryById = async (id: number, language?: string): Promise<CategoryVo> => {
  const params = language ? `?language=${language}` : '';
  return get<CategoryVo>(`/api/admin/categories/${id}${params}`);
};

export const createCategory = async (request: CategoryUpsertRequest): Promise<CategoryVo> =>
  post<CategoryVo>('/api/admin/categories', request);

export const updateCategory = async (id: number, request: CategoryUpsertRequest): Promise<CategoryVo> =>
  put<CategoryVo>(`/api/admin/categories/${id}`, request);

export const deleteCategory = async (id: number): Promise<void> =>
  del<void>(`/api/admin/categories/${id}`);
