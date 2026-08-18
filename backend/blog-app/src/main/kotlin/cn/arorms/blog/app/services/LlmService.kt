package cn.arorms.blog.app.services

import cn.arorms.blog.common.enums.Language
import org.springframework.ai.chat.model.ChatModel
import org.springframework.ai.chat.model.ChatResponse
import org.springframework.ai.chat.prompt.PromptTemplate
import org.springframework.stereotype.Service

@Service
class LlmService(private val chatModel: ChatModel) {
    fun translate(originalContent: String, targetLanguage: Language): String {
        val template = PromptTemplate("""
            You are an extremely precise professional translation expert. Translate the content I provide into {language}.
            **Strict Constraints:**
            1. Forbidden to change words: Strictly forbidden to modify, replace, optimize, or polish any of the original words I provide.
            2. Literal translation priority: Maintain the word order and structure of the original sentences, making only minimal adjustments in cases where the grammar is completely nonsensical.
            3. Format retention: Retain original punctuation, line breaks, and indentations, including markdown symbols and formatting.
            4. Zero explanation: Directly output the translation results; do not provide any forewords, afterwords, or translation explanations.
            The content is as follows
            {content}
        """)

        val prompt = template.create(mapOf(
            "language" to targetLanguage.toString(),
            "content" to originalContent
        ))

        val response: ChatResponse = chatModel.call(prompt)
        val rawContent = response.result!!.output.text ?: "no replay"

        return if (rawContent.contains("</think>")) {
            rawContent.substringAfter("</think>").trim()
        } else {
            rawContent.trim()
        }
    }
}