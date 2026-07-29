/**
 * Common enum types and shared infrastructure
 * Mirrors backend enums and framework-level types
 */

// --- Enums as const objects ---

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