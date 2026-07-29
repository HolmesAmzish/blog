import { useQuery } from '@tanstack/react-query';
import { fetchPublishedArticles, fetchArticleBySlug } from '../api/article';
import type { ArticlePageResponse, ArticleVo } from '@blog/types';

export const useArticles = (params: { page?: number; size?: number; categoryId?: number; language?: string; keyword?: string } = {}) => {
  const { page = 0, size = 10, categoryId, language, keyword } = params;
  return useQuery<ArticlePageResponse, Error>({
    queryKey: ['articles', { page, size, categoryId, language, keyword }],
    queryFn: () => fetchPublishedArticles(page, size, categoryId, language, keyword),
    staleTime: 5 * 60 * 1000,
  });
};

export const useArticleBySlug = (slug: string | null, language?: string) =>
  useQuery<ArticleVo, Error>({
    queryKey: ['article', 'slug', slug, language],
    queryFn: () => { if (!slug) throw new Error('slug required'); return fetchArticleBySlug(slug, language); },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });