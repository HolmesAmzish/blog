/**
 * Article types — all article-related types in one file
 * Mirrors backend article domain: Vo, DTO, entity, mutation requests
 */
import type { Language, ArticleStatus } from './common';
import type { CategoryVo } from './category';
import type { TagVo } from './tag';

// --- Author embedded in ArticleDTO ---

export interface AuthorDTO {
  id: number | null;
  username: string;
  displayName: string | null;
}

// --- Translations ---

export interface ArticleTranslation {
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

// --- Full Article DTO (admin detail / editor) ---

export interface ArticleDTO {
  id: number | null;
  slug: string;
  status: ArticleStatus;
  viewCount: number;
  translations: Record<Language, ArticleTranslation>;
  category: CategoryVo | null;
  author: AuthorDTO | null;
  tags: TagVo[];
  createdAt: string | null;
  updatedAt: string | null;
}

// --- List item for list views ---

export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  status: string | null;
  viewCount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  category: CategoryVo | null;
  tags: Array<TagVo> | null;
}

// --- Article Vo (public-facing article detail) ---

export interface ArticleVo {
  id: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isAiTranslated: boolean;
  title: string;
  summary: string;
  content: string;
  language: Language;
  category: CategoryVo | null;
  tags: Array<TagVo>;
}

// --- Mutation requests ---

export interface ArticleCreateRequest {
  slug: string;
  status: ArticleStatus;
  categoryId: number | null;
  tagIds: number[];
  translations: Array<ArticleTranslationUpsertRequest>;
}

export interface ArticleUpdateRequest {
  id: number;
  slug: string;
  status: ArticleStatus;
  categoryId: number | null;
  tagIds: number[];
  translations: Array<ArticleTranslationUpsertRequest>;
}

// --- Paginated response ---

export interface ArticlePageResponse {
  content: ArticleListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// --- Archive tree node (for echarts tree visualization) ---

export interface ArchiveTreeNode {
  name: string;
  value?: number;
  children?: ArchiveTreeNode[];
  article?: ArticleListItem;
}