/**
 * Article types — entity, Vo, summary, translation, mutation requests
 * Mirrors backend Article entity and common responses/requests
 */
import type { Language, ArticleStatus } from './common';
import type { CategoryVo } from './category';
import type { TagVo } from './tag';

// --- Author id embedded in Article entity ---

// --- Translations ---

export interface ArticleTranslation {
  id: number | null;
  language: Language;
  title: string;
  summary: string | null;
  content: string | null;
  isAiTranslated: boolean;
}

export interface ArticleTranslationUpsertRequest {
  id: number | null;
  language: Language | null;
  title: string;
  summary: string | null;
  content: string | null;
  isAiTranslated: boolean;
}

// --- Full Article entity (admin detail, mirrors backend Article) ---

export interface Article {
  id: number | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  status: ArticleStatus | null;
  viewCount: number;
  category: CategoryVo | null;
  authorId: string;
  translations: Record<Language, ArticleTranslation>;
  tags: TagVo[];
}

// --- List/summary item (mirrors backend ArticleSummaryVo) ---

export interface ArticleSummaryVo {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  status: ArticleStatus | null;
  viewCount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  category: CategoryVo | null;
  tags: Array<TagVo> | null;
}

// --- Mutation request (create: id null, update: id set; mirrors backend ArticleUpsertRequest) ---

export interface ArticleUpsertRequest {
  id: number | null;
  slug: string;
  status: ArticleStatus;
  categoryId: number | null;
  tagIds: number[];
  translations: Array<ArticleTranslationUpsertRequest>;
}
