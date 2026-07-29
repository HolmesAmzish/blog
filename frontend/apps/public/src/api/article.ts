/**
 * Public article API — read-only
 * GET /api/articles, GET /api/articles/{slug}
 */
import { get } from './client';
import type { ArticleVo, ArticlePageResponse } from '@blog/types';

export const fetchPublishedArticles = async (
  page = 0, size = 10, categoryId?: number, language?: string, keyword?: string
): Promise<ArticlePageResponse> => {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (categoryId) params.set('categoryId', String(categoryId));
  if (language) params.set('language', language);
  if (keyword) params.set('keyword', keyword);
  return get<ArticlePageResponse>(`/articles?${params}`);
};

export const fetchArticleBySlug = async (slug: string, language?: string): Promise<ArticleVo> => {
  const params = language ? `?language=${language}` : '';
  return get<ArticleVo>(`/articles/${slug}${params}`);
};
