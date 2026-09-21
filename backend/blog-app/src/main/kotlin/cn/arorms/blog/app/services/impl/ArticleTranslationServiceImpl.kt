package cn.arorms.blog.app.services.impl

import cn.arorms.blog.app.entities.ArticleTranslation
import cn.arorms.blog.app.repositories.ArticleRepository
import cn.arorms.blog.app.repositories.ArticleTranslationRepository
import cn.arorms.blog.app.services.ArticleTranslationService
import cn.arorms.blog.app.services.LlmService
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.LlmArticleTranslationRequest
import cn.arorms.blog.common.requests.ArticleTranslationUpsertRequest
import cn.arorms.blog.common.responses.ArticleTranslationAdminVo
import cn.arorms.blog.common.responses.LlmArticleTranslationResponse
import cn.arorms.framework.common.exception.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * @author Sheng
 * @version 1.2.0 2026-09-21
 * @since 2026-09-18
 */
@Service
class ArticleTranslationServiceImpl (
    private val articleTranslationRepository: ArticleTranslationRepository,
    private val articleRepository: ArticleRepository,
    private val llmService: LlmService
) : ArticleTranslationService {

    @Transactional
    override fun upsertTranslation(articleId: Long, request: ArticleTranslationUpsertRequest) {
        val articleTranslation = ArticleTranslation (
            id = request.id,
            article = articleRepository.getReferenceById(articleId),
            language = request.language,
            title = request.title,
            summary = request.summary,
            originalContent = request.originalContent,
            content = request.content,
            isAiTranslated = request.isAiTranslated ?: false
        )
        articleTranslationRepository.save(articleTranslation)
    }

    @Transactional(readOnly = true)
    override fun getTranslations(articleId: Long): List<ArticleTranslationAdminVo> =
        articleTranslationRepository.findByArticle_Id(articleId).map { it.toAdminVo() }

    @Transactional(readOnly = true)
    override fun getTranslation(articleId: Long, language: Language): ArticleTranslationAdminVo =
        (articleTranslationRepository.findByArticle_IdAndLanguage(articleId, language)
            ?: throw ResourceNotFoundException("Translation not found for article $articleId in language $language"))
            .toAdminVo()

    @Transactional
    override fun deleteTranslation(articleId: Long, language: Language) {
        val deleted = articleTranslationRepository.deleteByArticle_IdAndLanguage(articleId, language)
        if (deleted == 0L) {
            throw ResourceNotFoundException("Translation not found for article $articleId in language $language")
        }
    }

    /**
     * Translate article by LLM
     */
    @Transactional
    override fun translate(articleId: Long, targetLanguage: Language): LlmArticleTranslationResponse {
        val originalArticleTranslation = articleTranslationRepository.getOriginalTranslation(articleId)
            ?: throw ResourceNotFoundException("No original translation found for article $articleId")

        val articleTranslationRequest = LlmArticleTranslationRequest(
            title = originalArticleTranslation.title,
            summary = originalArticleTranslation.summary,
            content = originalArticleTranslation.originalContent,
            targetLanguage = targetLanguage
        )

        return llmService.translate(articleTranslationRequest)
    }

    private fun ArticleTranslation.toAdminVo() = ArticleTranslationAdminVo(
        id = id,
        language = language,
        title = title,
        summary = summary,
        originalContent = originalContent,
        isAiTranslated = isAiTranslated
    )
}