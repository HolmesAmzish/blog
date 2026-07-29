/**
 * Public category API — read-only
 */
import { get } from './client';
import type { CategoryVo, CategoryTreeNode } from '@blog/types';

export const fetchCategories = async (language?: string): Promise<CategoryVo[]> => {
  const params = language ? `?language=${language}` : '';
  return get<CategoryVo[]>(`/categories${params}`);
};

export const fetchCategoryTree = async (language?: string): Promise<CategoryTreeNode> => {
  const params = language ? `?language=${language}` : '';
  return get<CategoryTreeNode>(`/categories/tree${params}`);
};