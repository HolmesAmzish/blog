/**
 * Admin article translation API — fine-grained management of single translations
 * Mirrors ArticleTranslationAdminController (/api/admin/articles/{articleId}/translations)
 */
import {get, put, del} from './client';
import {getUserManager} from './auth';
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
 * PUT .../translate/title — non-streaming translation of the saved original title
 */
export const translateArticleTitle = async (articleId: number, language: Language): Promise<string> =>
    put<string, Language>(`/api/admin/articles/${articleId}/translations/translate/title`, language);

/**
 * PUT .../translate/summary — non-streaming translation of the saved original
 * summary; empty string if the original has none
 */
export const translateArticleSummary = async (articleId: number, language: Language): Promise<string> =>
    put<string, Language>(`/api/admin/articles/${articleId}/translations/translate/summary`, language);

/**
 * PUT .../translate/content — SSE stream of translated markdown chunks.
 * Chunks are delivered to onChunk as they arrive so the editor can render
 * the translation progressively. Resolves when the stream ends.
 * fetch is used instead of axios because axios has no streaming response API.
 */
export const translateArticleContent = async (
    articleId: number,
    language: Language,
    onChunk: (chunk: string) => void
): Promise<void> => {
    const user = await getUserManager().getUser();
    const response = await fetch(`/api/admin/articles/${articleId}/translations/translate/content`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...(user?.access_token ? {Authorization: `Bearer ${user.access_token}`} : {}),
        },
        body: JSON.stringify(language),
    });
    if (!response.ok || !response.body) {
        throw new Error(`Translation stream failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let pending = '';

    // SSE frames: one event = consecutive "data:" lines (joined with \n), events separated by a blank line
    const handleFrame = (raw: string) => {
        pending += raw.replace(/\r\n/g, '\n');
        const frames = pending.split('\n\n');
        pending = frames.pop() ?? '';
        for (const frame of frames) {
            // Spring's SseEmitter writes "data:<value>" with NO space after the
            // colon — do NOT strip a leading space, LLM tokens often start with
            // one and it is part of the content
            const dataLines = frame
                .split('\n')
                .filter((line) => line.startsWith('data:'))
                .map((line) => line.slice('data:'.length));
            if (dataLines.length > 0) onChunk(dataLines.join('\n'));
        }
    };

    for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        handleFrame(decoder.decode(value, {stream: true}));
    }
    handleFrame(decoder.decode());
};