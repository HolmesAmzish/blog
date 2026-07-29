/**
 * Category types — Vo, Entity, tree, and mutation requests
 */
import type { Language } from './common';

// --- Category Vo (public-facing, flattened) ---

export interface CategoryVo {
  id: number | null;
  name: string;
  slug: string;
  parentId: number | null;
}

// --- Full Category DTO (with multilingual names and children) ---

export interface CategoryDTO {
  id: number | null;
  names: Record<Language, string>;
  slug: string;
  parentId: number | null;
  parentName: string | null;
  children: CategoryDTO[];
}

// --- Raw entity (admin, mirrors backend JPA entity) ---

export interface CategoryEntity {
  id: number | null;
  names: Record<Language, string>;
  slug: string;
  parent: { id: number | null } | null;
}

// --- Tree node (recursive, for category tree widget) ---

export interface CategoryTreeNode {
  id: number;
  name: string;
  slug: string;
  children: Array<CategoryTreeNode>;
}

// --- Mutation request ---

export interface CategoryUpsertRequest {
  id: number | null;
  names: Record<Language, string>;
  slug: string;
  parentId: number | null;
}