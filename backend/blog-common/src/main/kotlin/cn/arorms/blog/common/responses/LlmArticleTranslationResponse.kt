package cn.arorms.blog.common.responses

/**
 * Structured translation result returned by the LLM for one article translation
 * @author Sheng
 * @version 1.2.0 2026-09-17
 * @since 2026-09-17
 */
data class LlmArticleTranslationResponse(
    val title: String,
    val summary: String,
    val content: String
)
