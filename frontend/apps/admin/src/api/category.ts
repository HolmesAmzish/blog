import { get, post, put, del } from './client';
import type { CategoryVo, CategoryUpsertRequest, CategoryEntity } from '@/types';

export const fetchCategories = async (): Promise<CategoryEntity[]> =>
    get<CategoryEntity[]>('/api/admin/categories');

export const fetchCategoryById = async (id: number): Promise<CategoryVo> =>
  get<CategoryVo>(`/api/categories/${id}`);

export const createCategory = async (request: CategoryUpsertRequest): Promise<CategoryVo> =>
  post<CategoryVo>('/api/categories', request);

export const updateCategory = async (id: number, request: CategoryUpsertRequest): Promise<CategoryVo> =>
  put<CategoryVo>(`/api/categories/${id}`, request);

export const deleteCategory = async (id: number): Promise<void> =>
  del<void>(`/api/categories/${id}`);
