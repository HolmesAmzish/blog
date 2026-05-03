/**
 * Category API endpoints
 * Maps to backend CategoryController
 */
import { get, post, put, del } from './client';
import type { CategoryVo, CategoryTreeNode, CategoryUpsertRequest, CategoryEntity } from '../types';
import { type SupportedLanguage } from '../context/LanguageContext';

const BASE_PATH = '/categories';

/**
 * Fetch all categories
 */
export const fetchCategories = async (language?: SupportedLanguage): Promise<CategoryVo[]> => {
  const params = new URLSearchParams();
  if (language && typeof language === 'string') {
    params.append('language', language);
  }
  const queryString = params.toString();
  return get<CategoryVo[]>(`${BASE_PATH}${queryString ? `?${queryString}` : ''}`);
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
export const fetchCategoryTree = async (language?: SupportedLanguage): Promise<CategoryTreeNode> => {
  const params = new URLSearchParams();
  if (language && typeof language === 'string') {
    params.append('language', language);
  }
  const queryString = params.toString();
  return get<CategoryTreeNode>(`${BASE_PATH}/tree${queryString ? `?${queryString}` : ''}`);
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
