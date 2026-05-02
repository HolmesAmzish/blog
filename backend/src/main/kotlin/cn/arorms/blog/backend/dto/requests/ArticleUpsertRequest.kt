package cn.arorms.blog.backend.dto.requests

import cn.arorms.blog.backend.enums.ArticleStatus

/**
 * Request object for creating/updating an article with multilingual support
 */
data class ArticleUpsertRequest(
    val id: Long? = null,
    val slug: String,
    val status: ArticleStatus,
    val categoryId: Long?,
    val tagIds: List<Long> = emptyList(),
    val translations: List<ArticleTranslationUpsertRequest>
)