package cn.arorms.blog.app.controllers.admin

import cn.arorms.blog.app.services.LlmService
import cn.arorms.blog.common.requests.TranslationRequest
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/admin/llm")
class LlmController(
    private val llmService: LlmService
) {
    @PostMapping("/translate")
    fun translate(@RequestBody request: TranslationRequest): String {
        return llmService.translate(request.originalContent, request.targetLanguage)
    }
}