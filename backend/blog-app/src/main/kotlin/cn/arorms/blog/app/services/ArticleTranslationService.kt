package cn.arorms.blog.app.services

import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.ArticleTranslationUpsertRequest
import cn.arorms.blog.common.responses.ArticleTranslationAdminVo
import cn.arorms.blog.common.responses.LlmArticleTranslationResponse

/**
 * @author Sheng
 * @version 1.2.0 2026-09-21
 * @since 2026-09-18
 */
interface ArticleTranslationService {
    /**
     * Save article content(translation)
     */
    fun upsertTranslation(articleId: Long, request: ArticleTranslationUpsertRequest)

    /**
     * Get all translations of an article (admin fine-grained management)
     */
    fun getTranslations(articleId: Long): List<ArticleTranslationAdminVo>

    /**
     * Get a single translation of an article by language
     */
    fun getTranslation(articleId: Long, language: Language): ArticleTranslationAdminVo

    /**
     * Delete a single translation of an article by language
     */
    fun deleteTranslation(articleId: Long, language: Language)

    /**
     * Translate article with LLM
     */
    fun translate(articleId: Long, targetLanguage: Language): LlmArticleTranslationResponse
}