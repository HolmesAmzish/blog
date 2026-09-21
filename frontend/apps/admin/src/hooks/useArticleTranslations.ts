import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
    fetchArticleTranslations,
    upsertArticleTranslation,
    deleteArticleTranslation,
    translateArticle,
} from '../api/articleTranslation';
import {ARTICLES_QUERY} from './useArticles';
import type {ArticleTranslation, ArticleTranslationUpsertRequest, Language} from '@/types';

export const ARTICLE_TRANSLATIONS_QUERY = 'admin-article-translations';

export const useArticleTranslations = (articleId: number | null) =>
    useQuery<ArticleTranslation[], Error>({
        queryKey: [ARTICLE_TRANSLATIONS_QUERY, articleId],
        queryFn: () => {
            if (articleId === null) throw new Error('articleId required');
            return fetchArticleTranslations(articleId);
        },
        enabled: articleId !== null,
    });

export const useUpsertArticleTranslation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({articleId, req}: { articleId: number; req: ArticleTranslationUpsertRequest }) =>
            upsertArticleTranslation(articleId, req),
        onSuccess: (_data, {articleId}) => {
            qc.invalidateQueries({queryKey: [ARTICLE_TRANSLATIONS_QUERY, articleId]});
            qc.invalidateQueries({queryKey: [ARTICLES_QUERY]});
        },
    });
};

export const useDeleteArticleTranslation = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({articleId, language}: { articleId: number; language: Language }) =>
            deleteArticleTranslation(articleId, language),
        onSuccess: (_data, {articleId}) => {
            qc.invalidateQueries({queryKey: [ARTICLE_TRANSLATIONS_QUERY, articleId]});
            qc.invalidateQueries({queryKey: [ARTICLES_QUERY]});
        },
    });
};

export const useTranslateArticle = () => {
    return useMutation({
        mutationFn: ({articleId, language}: { articleId: number; language: Language }) =>
            translateArticle(articleId, language),
        // no invalidation: translate does not write anything server-side;
        // the caller fills the editor with the returned markdown
    });
};