/**
 * Custom hook for article data fetching using TanStack Query
 * Handles caching, loading states, and error handling
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchArticles,
  fetchArticleById,
  fetchArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../api/article';
import type { ArticleRequest, ArticlePageResponse, ArticleDTO } from '../types';
import { type SupportedLanguage } from '../context/LanguageContext';

const ARTICLES_QUERY_KEY = 'articles';
const ARTICLE_QUERY_KEY = 'article';

interface UseArticlesParams {
  page?: number;
  size?: number;
  categoryId?: number;
  tagId?: number;
  language?: SupportedLanguage;
}

/**
 * Hook for fetching paginated articles
 */
export const useArticles = (params: UseArticlesParams = {}) => {
  const { page = 0, size = 10, categoryId, tagId, language } = params;

  return useQuery<ArticlePageResponse, Error>({
    queryKey: [ARTICLES_QUERY_KEY, { page, size, categoryId, tagId, language }],
    queryFn: () => fetchArticles(page, size, categoryId, tagId, language),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook for fetching single article by ID
 */
export const useArticleById = (id: number | null) => {
  return useQuery<ArticleDTO, Error>({
    queryKey: [ARTICLE_QUERY_KEY, id],
    queryFn: () => {
      if (id === null) throw new Error('Article ID is required');
      return fetchArticleById(id);
    },
    enabled: id !== null,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for fetching single article by slug
 */
export const useArticleBySlug = (slug: string | null) => {
  return useQuery<ArticleDTO, Error>({
    queryKey: [ARTICLE_QUERY_KEY, 'slug', slug],
    queryFn: () => {
      if (!slug) throw new Error('Article slug is required');
      return fetchArticleBySlug(slug);
    },
    enabled: slug !== null && slug !== '',
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook for creating article
 */
export const useCreateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation<ArticleDTO, Error, ArticleRequest>({
    mutationFn: createArticle,
    onSuccess: () => {
      // Invalidate articles list cache
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY_KEY] });
    },
  });
};

/**
 * Hook for updating article
 */
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();

  return useMutation<ArticleDTO, Error, { id: number; request: ArticleRequest }>({
    mutationFn: ({ id, request }) => updateArticle(id, request),
    onSuccess: (_, variables) => {
      // Invalidate specific article and articles list
      queryClient.invalidateQueries({ queryKey: [ARTICLE_QUERY_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY_KEY] });
    },
  });
};

/**
 * Hook for deleting article
 */
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: deleteArticle,
    onSuccess: () => {
      // Invalidate articles list cache
      queryClient.invalidateQueries({ queryKey: [ARTICLES_QUERY_KEY] });
    },
  });
};
