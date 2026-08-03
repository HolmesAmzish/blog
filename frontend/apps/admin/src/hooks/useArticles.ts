import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArticles, fetchArticleById, createArticle, updateArticle, deleteArticle } from '../api/article';
import type { ArticleUpsertRequest, PageResponse, ArticleSummaryVo } from '@/types';

export const ARTICLES_QUERY = 'admin-articles';

interface UseArticlesParams { page?: number; size?: number; isAdmin?: boolean; }

export const useArticles = (params: UseArticlesParams = {}) => {
  const { page = 0, size = 10 } = params;
  return useQuery<PageResponse<ArticleSummaryVo>, Error>({
    queryKey: [ARTICLES_QUERY, { page, size }],
    queryFn: () => fetchArticles(page, size),
  });
};

export const useArticleById = (id: number | null) =>
  useQuery({
    queryKey: [ARTICLES_QUERY, id],
    queryFn: () => { if (id === null) throw new Error('id required'); return fetchArticleById(id); },
    enabled: id !== null,
  });

export const useCreateArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (req: ArticleUpsertRequest) => createArticle(req),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ARTICLES_QUERY] }),
  });
};

export const useUpdateArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, req }: { id: number; req: ArticleUpsertRequest }) => updateArticle(id, req),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ARTICLES_QUERY] }),
  });
};

export const useDeleteArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteArticle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ARTICLES_QUERY] }),
  });
};
