package cn.arorms.blog.app.services

import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.ArticleTranslationUpsertRequest

/**
 * @author Sheng
 * @version 1.2.0 2026-09-18
 * @since 2026-09-18
 */
interface ArticleTranslationService {
    /**
     * Save article content(translation)
     */
    fun upsertTranslation(articleId: Long, request: ArticleTranslationUpsertRequest)

    /**
     * Translate article with LLM
     */
    fun translate(articleId: Long, targetLanguage: Language)
}