/**
 * Category API endpoints
 * Maps to backend CategoryController
 */
import { get, post, put, del } from './client';
import type { CategoryDTO, CategoryCreateRequest } from '../types';

const BASE_PATH = '/categories';

/**
 * Fetch all categories
 */
export const fetchCategories = async (): Promise<CategoryDTO[]> => {
  return get<CategoryDTO[]>(BASE_PATH);
};

/**
 * Fetch category tree (hierarchical structure with unlimited depth)
 */
export const fetchCategoryTree = async (): Promise<CategoryDTO> => {
  return get<CategoryDTO>(`${BASE_PATH}/tree`);
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
export const createCategory = async (request: CategoryCreateRequest): Promise<CategoryDTO> => {
  return post<CategoryDTO, CategoryCreateRequest>(BASE_PATH, request);
};

/**
 * Update existing category (uses Category entity directly)
 */
export const updateCategory = async (id: number, request: CategoryDTO): Promise<CategoryDTO> => {
  return put<CategoryDTO, CategoryDTO>(`${BASE_PATH}/${id}`, request);
};

/**
 * Delete category
 */
export const deleteCategory = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};
