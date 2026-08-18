package cn.arorms.blog.common.requests

import cn.arorms.blog.common.enums.Language

data class ArticleTranslationUpsertRequest(
    val id: Long? = null,
    val language: Language? = Language.EN,
    val title: String,
    val content: String,
    val summary: String?,
    val isAiTranslated: Boolean = false,
)