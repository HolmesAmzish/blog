package cn.arorms.blog.backend.dto

import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language

/**
 * Data Transfer Object for Article
 */
data class ArticleDTO(
    val id: Long?,
    val title: String,
    val summary: String?,
    val content: String?,
    val originalContent: String?,
    val slug: String,
    val language: Language,
    val status: ArticleStatus,
    val viewCount: Long,
    val categoryId: Long?,
    val categoryName: String?,
    val authorId: Long?,
    val authorName: String?,
    val tags: List<TagDTO>,
    val createdAt: String?,
    val updatedAt: String?,
    val publishedAt: String?
)

/**
 * Request object for creating/updating an article
 */
data class ArticleRequest(
    val title: String,
    val summary: String?,
    val content: String?,
    val originalContent: String?,
    val slug: String,
    val language: Language = Language.EN,
    val status: ArticleStatus = ArticleStatus.DRAFT,
    val categoryId: Long?,
    val tagIds: List<Long> = emptyList()
)

/**
 * Response object for paginated articles
 */
data class ArticlePageResponse(
    val content: List<ArticleDTO>,
    val totalElements: Long,
    val totalPages: Int,
    val currentPage: Int,
    val size: Int
)