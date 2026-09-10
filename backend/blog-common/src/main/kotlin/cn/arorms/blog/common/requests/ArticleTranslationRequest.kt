package cn.arorms.blog.common.requests

import cn.arorms.blog.common.enums.Language

data class ArticleTranslationRequest(
    val articleId: Long,

    // Original language content
    val title: String,
    val summary: String,
    val content: String,

    val targetLanguage: Language,
)
