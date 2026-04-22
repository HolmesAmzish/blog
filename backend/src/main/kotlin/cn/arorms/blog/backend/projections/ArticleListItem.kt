package cn.arorms.blog.backend.projections

import cn.arorms.blog.backend.entities.Category
import cn.arorms.blog.backend.entities.Tag
import cn.arorms.blog.backend.enums.ArticleStatus
import java.time.LocalDateTime

interface ArticleListItem {
    val id: Long
    val slug: String
    val title: String
    val summary: String?
    val status: String?
    val viewCount: Int?
    val createdAt: LocalDateTime?
    val updatedAt: LocalDateTime?
    val category: Category?
    val tags: List<Tag>?
}