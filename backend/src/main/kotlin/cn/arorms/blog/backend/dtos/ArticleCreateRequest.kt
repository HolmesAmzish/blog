package cn.arorms.blog.backend.dtos

import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language

/**
 * Request object for creating/updating an article
 */
data class ArticleCreateRequest(
    val title: String,
    val summary: String?,
    val content: String?,
    val slug: String,
    val language: Language = Language.EN,
    val status: ArticleStatus = ArticleStatus.DRAFT,
    val categoryId: Long?,
    val tagIds: List<Long> = emptyList()
)