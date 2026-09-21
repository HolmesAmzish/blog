package cn.arorms.blog.common.requests

import cn.arorms.blog.common.enums.Language

/**
 * @version 1.2.0 2026-09-11
 * @since 2026-05-05
 */
data class ArticleTranslationUpsertRequest(
    val id: Long? = null,
    val language: Language,
    val title: String,
    val originalContent: String,
    val content: String,
    val summary: String?,
    val isAiTranslated: Boolean? = false,
)