/**
 * Category API endpoints
 * Maps to backend CategoryController
 */
import { get, post, put, del } from './client';
import type { CategoryVo, CategoryTreeNode, CategoryUpsertRequest, CategoryEntity } from '../types';

const BASE_PATH = '/categories';

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<CategoryVo[]> => {
  return get<CategoryVo[]>(BASE_PATH);
};

/**
 * Fetch all category entities (raw entity data for admin)
 */
export const fetchCategoryEntities = async (): Promise<CategoryEntity[]> => {
  return get<CategoryEntity[]>(`${BASE_PATH}/entity`);
};

/**
 * Fetch category tree (hierarchical structure with unlimited depth)
 */
export const fetchCategoryTree = async (): Promise<CategoryTreeNode> => {
  return get<CategoryTreeNode>(`${BASE_PATH}/tree`);
};

/**
 * Fetch single category by ID
 */
export const fetchCategoryById = async (id: number): Promise<CategoryDTO> => {
  return get<CategoryDTO>(`${BASE_PATH}/${id}`);
};

/**
 * Fetch category by slug
 */
export const fetchCategoryBySlug = async (slug: string): Promise<CategoryDTO> => {
  return get<CategoryDTO>(`${BASE_PATH}/slug/${slug}`);
};

/**
 * Create new category
 */
export const createCategory = async (request: CategoryUpsertRequest): Promise<CategoryDTO> => {
  return post<CategoryDTO, CategoryUpsertRequest>(BASE_PATH, request);
};

/**
 * Update existing category
 */
export const updateCategory = async (request: CategoryUpsertRequest): Promise<CategoryDTO> => {
  return put<CategoryDTO, CategoryUpsertRequest>(`${BASE_PATH}/${request.id}`, request);
};

/**
 * Delete category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};
