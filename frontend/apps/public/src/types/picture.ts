/**
 * Picture types — DTO
 * Mirrors backend Picture entity
 */

export interface PictureDTO {
  id: number | null;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  alt: string | null;
  createdAt: string;
}
