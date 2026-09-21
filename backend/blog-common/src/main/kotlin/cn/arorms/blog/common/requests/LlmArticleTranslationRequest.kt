package cn.arorms.blog.common.requests

import cn.arorms.blog.common.enums.Language

/**
 * @version 1.2.0 2026-09-18
 * @since 2026-09-10
 */
data class LlmArticleTranslationRequest(
//    val articleId: Long,

    // Original language content
    val title: String,
    val summary: String?,
    val content: String,

    val targetLanguage: Language,
)
