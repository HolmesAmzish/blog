import { get, post, put, del } from './client';
import type { CategoryVo, CategoryTreeNode, CategoryUpsertRequest, CategoryEntity } from '@blog/types';

export const fetchCategories = async (language?: string): Promise<CategoryVo[]> => {
  const params = language ? `?language=${language}` : '';
  return get<CategoryVo[]>(`/categories${params}`);
};

export const fetchCategoryEntities = async (): Promise<CategoryEntity[]> =>
  get<CategoryEntity[]>('/categories/entity');

export const fetchCategoryTree = async (language?: string): Promise<CategoryTreeNode> => {
  const params = language ? `?language=${language}` : '';
  return get<CategoryTreeNode>(`/categories/tree${params}`);
};

export const fetchCategoryById = async (id: number): Promise<CategoryVo> =>
  get<CategoryVo>(`/categories/${id}`);

export const createCategory = async (request: CategoryUpsertRequest): Promise<CategoryVo> =>
  post<CategoryVo>('/categories', request);

export const updateCategory = async (request: CategoryUpsertRequest): Promise<CategoryVo> =>
  put<CategoryVo>(`/categories/${request.id}`, request);

export const deleteCategory = async (id: number): Promise<void> =>
  del<void>(`/categories/${id}`);