/**
 * Admin article API — full CRUD on /api/admin/article
 */
import { get, post, put, del } from './client';
import type { ArticleCreateRequest, ArticleUpdateRequest } from '@blog/types';

const BASE_PATH = '/admin/article';

export const fetchArticles = async (page = 0, size = 10): Promise<any> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return get<any>(`${BASE_PATH}?${params}`);
};

export const fetchArticleById = async (id: number): Promise<any> =>
  get<any>(`${BASE_PATH}/${id}`);

export const createArticle = async (request: ArticleCreateRequest): Promise<void> =>
  post<void>(BASE_PATH, request);

export const updateArticle = async (id: number, request: ArticleUpdateRequest): Promise<void> =>
  put<void>(`${BASE_PATH}/${id}`, request);

export const deleteArticle = async (id: number): Promise<void> =>
  del<void>(`${BASE_PATH}/${id}`);