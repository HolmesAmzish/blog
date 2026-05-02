package cn.arorms.blog.backend.dto.requests

import cn.arorms.blog.backend.enums.Language

data class ArticleTranslationUpsertRequest(
    val id: Long? = null,
    val language: Language? = Language.EN,
    val title: String,
    val content: String,
    val summary: String,
)