/**
 * Article API endpoints
 * Maps to backend ArticleController
 */
import { get, post, put, del } from './client';
import type {
  ArticleDTO,
  ArticleVo,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticlePageResponse,
} from '../types';
import { type SupportedLanguage } from '../context/LanguageContext';

const BASE_PATH = '/articles';

/**
 * Fetch paginated articles (all status) - for admin
 */
export const fetchArticles = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = 'createdAt',
  sortDir: string = 'desc',
  categoryId?: number,
  tagId?: number,
  language?: SupportedLanguage
): Promise<ArticlePageResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  params.append('sortBy', sortBy);
  params.append('sortDir', sortDir);
  if (categoryId) params.append('categoryId', categoryId.toString());
  if (tagId) params.append('tagId', tagId.toString());
  if (language) params.append('language', language);

  return get<ArticlePageResponse>(`${BASE_PATH}?${params.toString()}`);
};

/**
 * Fetch paginated published articles - for users
 */
export const fetchPublishedArticles = async (
  page: number = 0,
  size: number = 10,
  categoryId?: number,
  language?: SupportedLanguage
): Promise<ArticlePageResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (categoryId) params.append('categoryId', categoryId.toString());
  if (language) params.append('language', language);

  return get<ArticlePageResponse>(`${BASE_PATH}/published?${params.toString()}`);
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
export const fetchArticleBySlug = async (slug: string, language?: SupportedLanguage): Promise<ArticleVo> => {
  const params = new URLSearchParams();
  if (language) params.append('language', language);
  const queryString = params.toString();
  return get<ArticleVo>(`${BASE_PATH}/slug/${slug}${queryString ? `?${queryString}` : ''}`);
};

/**
 * Create new article
 */
export const createArticle = async (request: ArticleCreateRequest): Promise<ArticleDTO> => {
  return post<ArticleDTO, ArticleCreateRequest>(BASE_PATH, request);
};

/**
 * Update existing article
 */
export const updateArticle = async (id: number, request: ArticleUpdateRequest): Promise<ArticleDTO> => {
  return put<ArticleDTO, ArticleUpdateRequest>(`${BASE_PATH}/${id}`, request);
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
