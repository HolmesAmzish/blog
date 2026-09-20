package cn.arorms.blog.app.services

import cn.arorms.blog.app.entities.ArticleTranslation
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.ArticleTranslationUpsertRequest

/**
 * @author Sheng
 * @version 1.2.0 2026-09-20
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
    fun getTranslations(articleId: Long): List<ArticleTranslation>

    /**
     * Get a single translation of an article by language
     */
    fun getTranslation(articleId: Long, language: Language): ArticleTranslation

    /**
     * Delete a single translation of an article by language
     */
    fun deleteTranslation(articleId: Long, language: Language)

    /**
     * Translate article with LLM
     */
    fun translate(articleId: Long, targetLanguage: Language)
}