package cn.arorms.blog.common.responses

import cn.arorms.blog.common.enums.ArticleStatus
import java.time.LocalDateTime

/**
 * Unified DTO for article list views, with resolved language-specific fields
 * @author Sheng
 * @version 1.1.2 2026-09-01
 */
data class ArticleSummaryVo(
    val id: Long,
    val slug: String,
    val title: String,
    val summary: String?,
    val status: ArticleStatus?,
    val createdAt: LocalDateTime?,
    val updatedAt: LocalDateTime?,
    val category: CategoryVo?,
    val tags: List<TagVo>?
)