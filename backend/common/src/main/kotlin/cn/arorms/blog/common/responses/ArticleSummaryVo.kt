package cn.arorms.blog.common.responses

import cn.arorms.blog.common.enums.ArticleStatus
import java.time.LocalDateTime

/**
 * Unified DTO for article list views, with resolved language-specific fields
 */
data class ArticleSummaryVo(
//    val id: Long,
    val slug: String,
    val title: String,
    val summary: String?,
    val status: ArticleStatus?,
    val viewCount: Long?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?,
    val category: CategoryVo?,
    val tags: List<TagVo>?
)