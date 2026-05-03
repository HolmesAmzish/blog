/**
 * Custom hook for article data fetching using TanStack Query
 * Handles caching, loading states, and error handling
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchArticles,
  fetchPublishedArticles,
  fetchArticleById,
  fetchArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../api/article';
import type { ArticleCreateRequest, ArticleUpdateRequest, ArticlePageResponse, ArticleDTO, ArticleVo } from '../types';
import { type SupportedLanguage } from '../context/LanguageContext';

const ARTICLES_QUERY_KEY = 'articles';
const ARTICLE_QUERY_KEY = 'article';

interface UseArticlesParams {
  page?: number;
  size?: number;
  categoryId?: number;
  tagId?: number;
  language?: SupportedLanguage;
  isAdmin?: boolean;
}

export const ARTICLES_QUERY = ARTICLES_QUERY_KEY;

/**
 * Hook for fetching paginated articles
 * When isAdmin is true, fetches all articles (including drafts)
 * When isAdmin is false, fetches only published articles
 */
export const useArticles = (params: UseArticlesParams = {}) => {
  const { page = 0, size = 10, categoryId, tagId, language, isAdmin = false } = params;

  if (isAdmin) {
    // Fetch all articles for admin
    return useQuery<ArticlePageResponse, Error>({
      queryKey: [ARTICLES_QUERY_KEY, { page, size, categoryId, tagId, language, isAdmin }],
      queryFn: () => fetchArticles(page, size, 'createdAt', 'desc', categoryId, tagId, language),
      staleTime: 5 * 60 * 1000,
    });
  } else {
    // Fetch only published articles for users
    return useQuery<ArticlePageResponse, Error>({
      queryKey: [ARTICLES_QUERY_KEY, { page, size, categoryId, language }],
      queryFn: () => fetchPublishedArticles(page, size, categoryId, language),
      staleTime: 5 * 60 * 1000,
    });
  }
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
export const useArticleBySlug = (slug: string | null, language?: SupportedLanguage) => {
  return useQuery<ArticleVo, Error>({
    queryKey: [ARTICLE_QUERY_KEY, 'slug', slug, language],
    queryFn: () => {
      if (!slug) throw new Error('Article slug is required');
      return fetchArticleBySlug(slug, language);
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

  return useMutation<ArticleDTO, Error, ArticleCreateRequest>({
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

  return useMutation<ArticleDTO, Error, { id: number; request: ArticleUpdateRequest }>({
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
