/**
 * Admin article API — full CRUD on /api/admin/article
 */
import { get, post, put, del } from './client';
import type { ArticleUpsertRequest, Article, PageResponse, ArticleSummaryVo } from '@/types';

export const fetchArticles = async (page = 0, size = 10): Promise<PageResponse<ArticleSummaryVo>> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return get<PageResponse<ArticleSummaryVo>>(`/api/admin/article?${params}`);
};

export const fetchArticleById = async (id: number): Promise<Article> =>
  get<Article>(`/api/admin/article/${id}`);

export const createArticle = async (request: ArticleUpsertRequest): Promise<void> =>
  post<void>('/api/admin/article', request);

export const updateArticle = async (id: number, request: ArticleUpsertRequest): Promise<void> =>
  put<void>(`/api/admin/article/${id}`, request);

export const deleteArticle = async (id: number): Promise<void> =>
  del<void>(`/api/admin/article/${id}`);
