/**
 * Picture types — DTOs and paginated response
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