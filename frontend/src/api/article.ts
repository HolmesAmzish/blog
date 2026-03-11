/**
 * Article API endpoints
 * Maps to backend ArticleController
 */
import { get, post, put, del } from './client';
import type {
  ArticleDTO,
  ArticleRequest,
  ArticlePageResponse,
} from '../types';

const BASE_PATH = '/articles';

/**
 * Fetch paginated articles
 */
export const fetchArticles = async (
  page: number = 0,
  size: number = 10,
  categoryId?: number,
  tagId?: number,
  language?: string
): Promise<ArticlePageResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (categoryId) params.append('categoryId', categoryId.toString());
  if (tagId) params.append('tagId', tagId.toString());
  if (language) params.append('language', language);

  return get<ArticlePageResponse>(`${BASE_PATH}?${params.toString()}`);
};

/**
 * Fetch single article by ID
 */
export const fetchArticleById = async (id: number): Promise<ArticleDTO> => {
  return get<ArticleDTO>(`${BASE_PATH}/${id}`);
};

/**
 * Fetch single article by slug
 */
export const fetchArticleBySlug = async (slug: string): Promise<ArticleDTO> => {
  return get<ArticleDTO>(`${BASE_PATH}/slug/${slug}`);
};

/**
 * Create new article
 */
export const createArticle = async (request: ArticleRequest): Promise<ArticleDTO> => {
  return post<ArticleDTO, ArticleRequest>(BASE_PATH, request);
};

/**
 * Update existing article
 */
export const updateArticle = async (id: number, request: ArticleRequest): Promise<ArticleDTO> => {
  return put<ArticleDTO, ArticleRequest>(`${BASE_PATH}/${id}`, request);
};

/**
 * Delete article
 */
export const deleteArticle = async (id: number): Promise<void> => {
  return del<void>(`${BASE_PATH}/${id}`);
};

/**
 * Search articles
 */
export const searchArticles = async (
  query: string,
  page: number = 0,
  size: number = 10
): Promise<ArticlePageResponse> => {
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('page', page.toString());
  params.append('size', size.toString());

  return get<ArticlePageResponse>(`${BASE_PATH}/search?${params.toString()}`);
};
