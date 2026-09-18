package cn.arorms.blog.app.services.impl

import cn.arorms.blog.app.entities.ArticleTranslation
import cn.arorms.blog.app.repositories.ArticleRepository
import cn.arorms.blog.app.repositories.ArticleTranslationRepository
import cn.arorms.blog.app.services.ArticleTranslationService
import cn.arorms.blog.app.services.LlmService
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.ArticleTranslationRequest
import cn.arorms.blog.common.requests.ArticleTranslationUpsertRequest
import cn.arorms.framework.common.exception.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * @author Sheng
 * @version 1.2.0 2026-09-18
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
            content = request.content,
            isAiTranslated = request.isAiTranslated ?: false
        )
        articleTranslationRepository.save(articleTranslation)
    }

    /**
     * Translate article by LLM
     */
    @Transactional
    override fun translate(articleId: Long, targetLanguage: Language) {
        val originalArticleTranslation = articleTranslationRepository.getOriginalTranslation(articleId)
            ?: throw ResourceNotFoundException("No original translation found for article $articleId")

        val articleTranslationRequest = ArticleTranslationRequest(
            title = originalArticleTranslation.title,
            summary = originalArticleTranslation.summary,
            content = originalArticleTranslation.content,
            targetLanguage = targetLanguage
        )

        val articleTranslationResult = llmService.translate(articleTranslationRequest)
        val existing = articleTranslationRepository.findByArticle_IdAndLanguage(articleId, targetLanguage)

        val articleTranslationUpsertRequest = ArticleTranslationUpsertRequest(
            id = existing?.id,
            language = targetLanguage,
            title = articleTranslationResult.title,
            summary = articleTranslationResult.summary,
            content = articleTranslationResult.content,
            isAiTranslated = true
        )

        upsertTranslation(
            articleId,
            articleTranslationUpsertRequest
        )
    }
}