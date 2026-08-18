package cn.arorms.blog.app.services.impl

import cn.arorms.blog.app.repositories.ArticleRepository
import cn.arorms.blog.app.repositories.CategoryRepository
import cn.arorms.blog.app.repositories.TagRepository
import cn.arorms.blog.app.services.ArticleService
import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.app.entities.ArticleTranslation
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.app.mappers.toSummaryVo
import cn.arorms.blog.app.mappers.toVo
import cn.arorms.blog.common.requests.ArticleQueryRequest
import cn.arorms.blog.common.requests.ArticleUpsertRequest
import cn.arorms.blog.common.responses.ArticleSummaryVo
import cn.arorms.blog.common.responses.ArticleVo
import cn.arorms.framework.common.domain.PageResponse
import cn.arorms.framework.common.exception.ResourceNotFoundException
import cn.arorms.framework.security.UserPrincipal
import org.springframework.data.domain.Pageable
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ArticleServiceImpl(
    private val articleRepository: ArticleRepository,
    private val tagRepository: TagRepository,
    private val categoryRepository: CategoryRepository
) : ArticleService {

    override fun getArticlePage(pageable: Pageable, query: ArticleQueryRequest?): PageResponse<ArticleSummaryVo> {
        val request = query ?: ArticleQueryRequest(language = Language.EN, keyword = null, categoryId = null)

        val articlePage = articleRepository.findArticlePage(pageable, request)
        val summaryPage = articlePage.map { article ->
            article.toSummaryVo(request.language ?: Language.EN)
        }

        return PageResponse.fromPage(summaryPage)
    }

    override fun findById(id: Long): Article {
        return articleRepository.findById(id)
                .orElseThrow { ResourceNotFoundException("Article not found with id: $id") }
    }

    override fun getPublishedArticlePage(pageable: Pageable, query: ArticleQueryRequest?): PageResponse<ArticleSummaryVo> {
        val request = query ?: ArticleQueryRequest(language = Language.EN, keyword = null, categoryId = null)

        val articlePage = articleRepository.findArticlePage(pageable, request)
        val summaryPage = articlePage.map { article ->
            article.toSummaryVo(request.language ?: Language.EN)
        }

        return PageResponse.fromPage(summaryPage)
    }

    override fun getBySlug(language: Language, slug: String): ArticleVo {
        val article = articleRepository.findBySlug(slug)
                ?: throw ResourceNotFoundException("Article not found with slug: $slug")
        return article.toVo(language)
    }

    @Transactional
    override fun create(authorId: String, request: ArticleUpsertRequest) {
        if (articleRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Article with slug '${request.slug}' already exists")
        }
        val article = Article(
            slug = request.slug,
            status = request.status,
            category = request.categoryId?.let { categoryRepository.getReferenceById(it) },
            authorId = authorId
        )

        request.translations.forEach { dto ->
                val lang = dto.language ?: Language.EN
            val translation = ArticleTranslation(
                language = lang,
                title = dto.title,
                summary = dto.summary,
                content = dto.content,
                isAiTranslated = dto.isAiTranslated,
                article = article
            )
            article.translations[lang] = translation
        }

        if (request.tagIds.isNotEmpty()) {
            val tags = tagRepository.findAllById(request.tagIds)
            article.tags.addAll(tags)
        }
        articleRepository.save(article)
    }

    @Transactional
    override fun update(id: Long, request: ArticleUpsertRequest) {
        val existingArticle = articleRepository.findById(id)
                .orElseThrow { IllegalArgumentException("Article not found with id: $id") }

        existingArticle.status = request.status
        existingArticle.category = request.categoryId?.let { categoryRepository.getReferenceById(it) }

        if (request.slug != existingArticle.slug && articleRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Article with slug '${request.slug}' already exists")
        }
        existingArticle.slug = request.slug

        val existingLangs = existingArticle.translations.keys.toSet()
        val requestLangs = request.translations.map { it.language ?: Language.EN }.toSet()

        existingLangs.filter { it !in requestLangs }.forEach { lang ->
                existingArticle.translations.remove(lang)
        }

        request.translations.forEach { dto ->
                val lang = dto.language ?: Language.EN
            val existing = existingArticle.translations[lang]
            if (existing != null) {
                existing.title = dto.title
                existing.summary = dto.summary
                existing.content = dto.content
                existing.isAiTranslated = dto.isAiTranslated
            } else {
                val translation = ArticleTranslation(
                        language = lang,
                        title = dto.title,
                        summary = dto.summary,
                        content = dto.content,
                        isAiTranslated = dto.isAiTranslated,
                        article = existingArticle
                )
                existingArticle.translations[lang] = translation
            }
        }

        existingArticle.tags.clear()
        if (request.tagIds.isNotEmpty()) {
            val tags = tagRepository.findAllById(request.tagIds)
            existingArticle.tags.addAll(tags)
        }

        articleRepository.save(existingArticle)
    }

    @Transactional
    override fun delete(id: Long) {
        if (!articleRepository.existsById(id)) {
            throw ResourceNotFoundException("Article Not Found with id: $id")
        }
        return articleRepository.deleteById(id)
    }

    @Transactional
    override fun incrementViewCount(id: Long) {
        val article = articleRepository.findById(id)
                .orElseThrow { ResourceNotFoundException("Article not found with id: $id") }
        article.viewCount++
        articleRepository.save(article)
    }
}