package cn.arorms.blog.backend.projections

import cn.arorms.blog.backend.entities.Category
import cn.arorms.blog.backend.entities.User
import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import java.time.LocalDateTime

/**
 * Projection interface for article list view (excludes content fields)
 */
interface ArticleListItem {
    val id: Long?
    val title: String
    val summary: String?
    val slug: String
    val language: Language
    val status: ArticleStatus
    val viewCount: Long
    val category: Category?
    val author: User?
    val createdAt: LocalDateTime?
    val updatedAt: LocalDateTime?
    val publishedAt: LocalDateTime?
}
