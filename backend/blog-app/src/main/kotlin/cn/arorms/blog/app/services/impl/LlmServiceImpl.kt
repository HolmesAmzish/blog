package cn.arorms.blog.app.services.impl

import cn.arorms.blog.app.services.LlmService
import cn.arorms.blog.common.requests.ArticleTranslationRequest
import cn.arorms.blog.common.responses.ArticleTranslationResult
import org.springframework.ai.chat.client.ChatClient
import org.springframework.ai.chat.model.ChatModel
import org.springframework.ai.openai.OpenAiChatOptions
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

/**
 * LLM service implementation
 * @version 1.2.0 2026-09-08
 * @since 2026-05-10
 * @author Sheng
 */
@Service
class LlmServiceImpl(chatModel: ChatModel) : LlmService {

    private val chatClient: ChatClient = ChatClient.builder(chatModel).build()

    override fun call(prompt: String): String {
        return chatClient
            .prompt(prompt)
            .call()
            .content().toString()
    }

    override fun callWithoutThinking(prompt: String) {
        TODO("Not yet implemented")
    }

    override fun stream(prompt: String): Flux<String> {
        TODO("Not yet implemented")
    }

    override fun streamWithoutThinking(prompt: String): Flux<String> {
        return chatClient
            .prompt(prompt)
            .options(
                OpenAiChatOptions.builder()
                    .extraBody(mapOf("thinking" to mapOf("type" to "disabled")))
            )
            .stream()
            .content()
    }

    override fun translate(translationRequest: ArticleTranslationRequest): ArticleTranslationResult {
        val prompt = """
            You are an extremely precise professional translation expert. Translate the content I provide into ${translationRequest.targetLanguage}.
            **Strict Constraints:**
            1. Forbidden to change words: Strictly forbidden to modify, replace, optimize, or polish any of the original words I provide.
            2. Literal translation priority: Maintain the word order and structure of the original sentences, making only minimal adjustments in cases where the grammar is completely nonsensical.
            3. Format retention: Retain original punctuation, line breaks, and indentations, including markdown symbols and formatting.
            4. Zero explanation: Directly output the translation results; do not provide any forewords, afterwords, or translation explanations.
            The content is as follows:
            title: ${translationRequest.title}
            summary: ${translationRequest.summary}
            content: ${translationRequest.content}
        """.trimIndent()

        return chatClient
            .prompt(prompt)
            .options(
                OpenAiChatOptions.builder()
                    .extraBody(mapOf("thinking" to mapOf("type" to "disabled")))
            )
            .call()
            .entity(ArticleTranslationResult::class.java)
            ?: throw IllegalStateException("LLM returned an empty translation result")
    }
}
