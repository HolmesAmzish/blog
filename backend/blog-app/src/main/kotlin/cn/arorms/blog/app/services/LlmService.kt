package cn.arorms.blog.app.services

import cn.arorms.blog.common.requests.ArticleTranslationRequest
import cn.arorms.blog.common.responses.ArticleTranslationResult
import reactor.core.publisher.Flux

/**
 * LLM service interface
 * @version 1.2.0 2026-09-08
 * @since 2026-05-10
 * @author Sheng
 */
interface LlmService {
    fun call(prompt: String): String
    fun callWithoutThinking(prompt: String)
    fun stream(prompt: String): Flux<String>
    fun streamWithoutThinking(prompt: String): Flux<String>
    fun translate(translationRequest: ArticleTranslationRequest): ArticleTranslationResult
}
