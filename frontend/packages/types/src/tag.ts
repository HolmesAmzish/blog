/**
 * Tag types — Vo and mutation requests
 */

// --- Tag Vo (public-facing) ---

export interface TagVo {
  id: number | null;
  name: string;
  slug: string;
}

// --- Mutation request ---

export interface TagUpsertRequest {
  id: number | null;
  name: string;
  slug: string;
}