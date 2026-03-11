/**
 * Category API endpoints
 * Maps to backend CategoryController
 */
import { get, post, put, del } from './client';
import type { CategoryDTO, CategoryRequest } from '../types';

const BASE_PATH = '/categories';

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<CategoryDTO[]> => {
  return get<CategoryDTO[]>(BASE_PATH);
};

/**
 * Fetch category tree (hierarchical structure)
 */
export const fetchCategoryTree = async (): Promise<CategoryDTO[]> => {
  return get<CategoryDTO[]>(`${BASE_PATH}/tree`);
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
export const createCategory = async (request: CategoryRequest): Promise<CategoryDTO> => {
  return post<CategoryDTO, CategoryRequest>(BASE_PATH, request);
};

/**
 * Update existing category
 */
export const updateCategory = async (id: number, request: CategoryRequest): Promise<CategoryDTO> => {
  return put<CategoryDTO, CategoryRequest>(`${BASE_PATH}/${id}`, request);
};

/**
 * Delete category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};
