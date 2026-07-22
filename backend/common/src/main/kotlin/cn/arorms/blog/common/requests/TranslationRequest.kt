package cn.arorms.blog.common.requests

import cn.arorms.blog.common.enums.Language

data class TranslationRequest(
    val originalContent: String,
    val targetLanguage: Language,
)
