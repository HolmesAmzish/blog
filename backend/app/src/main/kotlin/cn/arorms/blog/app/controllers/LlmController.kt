package cn.arorms.blog.app.controllers

import cn.arorms.blog.common.requests.TranslationRequest
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/llm")
class LlmController(
    private val llmService: cn.arorms.blog.app.services.LlmService
) {
    @PostMapping("/translate")
    fun translate(@RequestBody request: TranslationRequest): String {
        return llmService.translate(request.originalContent, request.targetLanguage)
    }
}
