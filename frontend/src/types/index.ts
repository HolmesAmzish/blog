/**
 * Type definitions mirroring backend DTOs
 * Strictly typed - no 'any' allowed
 */

// Enums as const objects for better TypeScript compatibility
export const Language = {
  ZH: 'ZH' as const,
  EN: 'EN' as const,
};

export type Language = typeof Language[keyof typeof Language];

export const ArticleStatus = {
  DRAFT: 'DRAFT' as const,
  PUBLISHED: 'PUBLISHED' as const,
  ARCHIVED: 'ARCHIVED' as const,
};

export type ArticleStatus = typeof ArticleStatus[keyof typeof ArticleStatus];

export const UserRole = {
  ADMIN: 'ADMIN' as const,
  EDITOR: 'EDITOR' as const,
  USER: 'USER' as const,
};

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Article Translation
export interface ArticleTranslation {
  language: Language;
  title: string;
  summary: string | null;
  content: string | null;
}

export interface ArticleTranslationUpsertRequest {
  id: number | null;
  language: Language | null;
  title: string;
  summary: string | null;
  content: string | null;
}

// Tag DTOs
export interface TagUpsertRequest {
  id: number | null;
  name: string;
  slug: string;
}

// Category DTOs
export interface CategoryDTO {
  id: number | null;
  names: Record<Language, string>;
  slug: string;
  parentId: number | null;
  parentName: string | null;
  children: CategoryDTO[];
}

export interface CategoryUpsertRequest {
  id: number | null;
  names: Record<Language, string>;
  slug: string;
  parentId: number | null;
}

// CategoryEntity - matches backend Category entity (raw entity data)
export interface CategoryEntity {
  id: number | null;
  names: Record<Language, string>;
  slug: string;
  parent: { id: number | null } | null;
}

// Author interface (for Article entity)
export interface AuthorDTO {
  id: number | null;
  username: string;
  displayName: string | null;
}

// Article DTOs - multilingual with translations map
export interface ArticleDTO {
  id: number | null;
  slug: string;
  status: ArticleStatus;
  viewCount: number;
  translations: Record<Language, ArticleTranslation>;
  category: CategoryDTO | null;
  author: AuthorDTO | null;
  tags: TagVo[];
  createdAt: string | null;
  updatedAt: string | null;
}

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

// Article ListItem for list views
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

// ArticleVo - matches backend ArticleVo (article detail)
export interface ArticleVo {
  id: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  title: string;
  summary: string;
  content: string;
  language: Language;
  category: CategoryVo | null;
  tags: Array<TagVo>;
}

// CategoryVo - matches backend CategoryVo
export interface CategoryVo {
  id: number | null;
  name: string;
  slug: string;
  parentId: number | null;
}

// TagVo - matches backend TagVo
export interface TagVo {
  id: number | null;
  name: string;
  slug: string;
}

// CategoryTreeNode - matches backend CategoryTreeNode
export interface CategoryTreeNode {
  id: number;
  name: string;
  slug: string;
  children: Array<CategoryTreeNode>;
}

export interface ArticlePageResponse {
  content: ArticleListItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

// User DTOs
export interface UserDTO {
  id: number | null;
  username: string;
  email: string;
  displayName: string | null;
  avatar: string | null;
  bio: string | null;
  role: UserRole;
  isEnabled: boolean;
  createdAt: string | null;
}

export interface UserRequest {
  username: string;
  email: string;
  password: string | null;
  displayName: string | null;
  bio: string | null;
  avatar: string | null;
  role: UserRole;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
}

// Auth DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  displayName: string | null;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface RegisterResponse {
  message: string;
  username: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  user: UserDTO;
}

// Picture DTOs
export interface PictureDTO {
  id: number | null;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  uploaderId: number | null;
  uploaderName: string | null;
  createdAt: string | null;
}

export interface PicturePageResponse {
  content: PictureDTO[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
  isLast: boolean;
}

// Tree node for archive visualization
export interface ArchiveTreeNode {
  name: string;
  value?: number;
  children?: ArchiveTreeNode[];
  article?: ArticleDTO | ArticleListItem;
}

// Site Statistics
export interface SiteStatistics {
  id: number;
  viewDate: string;
  totalArticleView: number;
  totalArticles: number;
  totalCategories: number;
  totalTags: number;
}
