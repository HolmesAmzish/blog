package cn.arorms.blog.backend.dto.requests

import cn.arorms.blog.backend.enums.Language

data class TranslationRequest(
    val originalContent: String,
    val targetLanguage: Language,
)
