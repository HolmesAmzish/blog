package cn.arorms.blog.backend.dto.responses

import cn.arorms.blog.backend.enums.Language
import java.time.LocalDateTime

data class ArticleVo(
    val id: Long,
    val slug: String,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime,
//    val author: UserVo,
    val viewCount: Long,
    val title: String,
    val summary: String,
    val content: String,
    val language: Language,
    val category: CategoryVo,
    val tags: List<TagVo>,
)
