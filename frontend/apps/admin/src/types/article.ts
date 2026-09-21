/**
 * Article types — entity, Vo, summary, translation, mutation requests
 * Mirrors backend Article entity and common responses/requests
 */
import type {Language, ArticleStatus} from './common';
import type {CategoryVo} from './category';
import type {TagVo} from './tag';

// --- Translations ---

/** Mirrors backend ArticleTranslationAdminVo: markdown source only, no rendered HTML */
export interface ArticleTranslation {
    id: number | null;
    language: Language;
    title: string;
    summary: string | null;
    originalContent: string;
    isAiTranslated: boolean;
}

/** Mirrors backend ArticleTranslationUpsertRequest: admin renders markdown → HTML on save and sends both */
export interface ArticleTranslationUpsertRequest {
    id: number | null;
    language: Language | null;
    title: string;
    summary: string | null;
    originalContent: string;
    content: string;
    isAiTranslated: boolean;
}

/** Mirrors backend LlmArticleTranslationResponse: translated markdown returned by the LLM */
export interface LlmArticleTranslationResponse {
    title: string;
    summary: string;
    content: string;
}

// --- Article metadata entity (admin detail, mirrors backend Article) ---
// translations are @JsonIgnore'd on the backend; fetch them via the
// dedicated /api/admin/articles/{id}/translations endpoints instead

export interface Article {
    id: number | null;
    slug: string;
    createdAt: string;
    updatedAt: string;
    status: ArticleStatus | null;
    category: CategoryVo | null;
    authorId: string;
    tags: TagVo[];
}

// --- List/summary item (mirrors backend ArticleSummaryVo) ---

export interface ArticleSummaryVo {
    id: number;
    slug: string;
    title: string;
    summary: string | null;
    status: ArticleStatus | null;
    createdAt: string | null;
    updatedAt: string | null;
    category: CategoryVo | null;
    tags: Array<TagVo> | null;
}

// --- Mutation request (metadata only; create: id null, update: id set; mirrors backend ArticleUpsertRequest) ---

export interface ArticleUpsertRequest {
    id: number | null;
    slug: string;
    status: ArticleStatus;
    categoryId: number | null;
    tagIds: number[];
}