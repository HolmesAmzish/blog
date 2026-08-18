package cn.arorms.blog.common.requests

import cn.arorms.blog.common.enums.ArticleStatus

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