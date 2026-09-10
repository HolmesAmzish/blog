package cn.arorms.blog.app.services

import cn.arorms.blog.common.enums.Language

/**
 * LLM service interface
 * @version 1.2.0 2026-09-08
 * @since 2026-05-10
 * @author cacc
 */
interface LlmService {

    fun translate(originalContent: String, targetLanguage: Language): String
}
