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

// Tag DTOs
export interface TagDTO {
  id: number | null;
  name: string;
  description: string | null;
  slug: string;
  articleCount: number | null;
}

export interface TagRequest {
  name: string;
  description: string | null;
  slug: string;
}

// Category DTOs
export interface CategoryDTO {
  id: number | null;
  name: string;
  slug: string;
  parentId: number | null;
  parentName: string | null;
  children: CategoryDTO[];
  articleCount: number | null;
}

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  parentId: number | null;
}

// Author interface (for Article entity)
export interface AuthorDTO {
  id: number | null;
  username: string;
  displayName: string | null;
}

// Article DTOs
export interface ArticleDTO {
  id: number | null;
  title: string;
  summary: string | null;
  content: string | null;
  slug: string;
  language: Language;
  status: ArticleStatus;
  viewCount: number;
  category: CategoryDTO | null;
  author: AuthorDTO | null;
  tags: TagDTO[];
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
}

export interface ArticleCreateRequest {
  title: string;
  summary: string | null;
  content: string | null;
  slug: string;
  language: Language;
  status: ArticleStatus;
  categoryId: number | null;
  tagIds: number[];
}

export interface ArticleUpdateRequest {
  id: number;
  title: string;
  summary: string | null;
  content: string | null;
  slug: string;
  language: Language;
  status: ArticleStatus;
  categoryId: number | null;
  tagIds: number[];
}

// Article ListItem for list views
export interface ArticleListItem {
  id: number;
  slug: string;
  title: string;
  summary: string | null;
  viewCount: number;
  createdAt: string | null;
  updatedAt: string | null;
  category: CategoryDTO | null;
  tags: TagDTO[];
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

// Image DTOs
export interface ImageDTO {
  id: number | null;
  filename: string;
  originalName: string;
  contentType: string;
  size: number;
  url: string;
  uploadedAt: string | null;
}

// Tree node for archive visualization
export interface ArchiveTreeNode {
  name: string;
  value?: number;
  children?: ArchiveTreeNode[];
  article?: ArticleDTO;
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
