import { post } from './client';

export interface TranslationRequest {
  originalContent: string;
  targetLanguage: 'EN' | 'ZH';
}

/**
 * POST /api/admin/llm/translate — backend LlmController
 * @see /home/cacc/Repositories/blog/backend/blog-app/src/main/kotlin/cn/arorms/blog/app/controllers/admin/LlmController.kt:11
 */
export const translate = async (request: TranslationRequest): Promise<string> =>
  post<string, TranslationRequest>('/api/admin/llm/translate', request);
