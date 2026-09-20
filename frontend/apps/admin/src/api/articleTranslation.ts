/**
 * Admin article translation API — fine-grained management of single translations
 * Mirrors ArticleTranslationAdminController (/api/admin/articles/{articleId}/translations)
 */
import {get, put, del} from './client';
import type {ArticleTranslation, ArticleTranslationUpsertRequest, Language} from '@/types';

export const fetchArticleTranslations = async (articleId: number): Promise<ArticleTranslation[]> =>
    get<ArticleTranslation[]>(`/api/admin/articles/${articleId}/translations`);

export const fetchArticleTranslation = async (articleId: number, language: Language): Promise<ArticleTranslation> =>
    get<ArticleTranslation>(`/api/admin/articles/${articleId}/translations/${language}`);

export const upsertArticleTranslation = async (
    articleId: number,
    request: ArticleTranslationUpsertRequest
): Promise<void> =>
    put<void>(`/api/admin/articles/${articleId}/translations`, request);

export const deleteArticleTranslation = async (articleId: number, language: Language): Promise<void> =>
    del<void>(`/api/admin/articles/${articleId}/translations/${language}`);

/**
 * PUT /api/admin/articles/translate/{id} — translate the article into the target language with LLM
 * (admin-only; the public frontend never calls this)
 */
export const translateArticle = async (articleId: number, language: Language): Promise<void> =>
    put<void>(`/api/admin/articles/translate/${articleId}`, language);