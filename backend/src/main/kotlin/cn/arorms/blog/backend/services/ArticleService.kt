package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.dto.requests.ArticleUpsertRequest
import cn.arorms.blog.backend.dto.responses.ArticleListItem
import cn.arorms.blog.backend.dto.responses.ArticleVo
import cn.arorms.blog.backend.dto.responses.CategoryVo
import cn.arorms.blog.backend.dto.responses.TagVo
import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.entities.ArticleTranslation
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.exception.ResourceNotFoundException
import cn.arorms.blog.backend.repositories.ArticleRepository
import cn.arorms.blog.backend.repositories.ArticleSpecifications
import cn.arorms.blog.backend.repositories.CategoryRepository
import cn.arorms.blog.backend.repositories.TagRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ArticleService(
    private val articleRepository: ArticleRepository,
    private val tagRepository: TagRepository,
    private val categoryRepository: CategoryRepository
) {

    fun getArticleList(pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findAllListItem(pageable).map { it.toArticleListItem(Language.EN) }
    }

    fun findById(id: Long): Article {
        return articleRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Article not found with id: $id") }
    }

    fun toListItem(article: Article, language: Language): ArticleListItem {
        return article.toArticleListItem(language)
    }

    @Transactional
    fun findBySlug(slug: String): Article {
        return articleRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Article not found with slug: $slug")
    }

    fun findAllPublished(language: Language, keyword: String?, categoryId: Long?, pageable: Pageable): Page<ArticleListItem> {
        val spec = ArticleSpecifications.findPublishedArticles(language, keyword, categoryId)
        return articleRepository.findAll(spec, pageable)
            .map { it.toArticleListItem(language) }
    }

    fun findBySlug(language: Language, slug: String): ArticleVo {
        val article = articleRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Article not found with slug: $slug")
        return article.toArticleVo(language)
    }

    @Transactional
    fun create(request: ArticleUpsertRequest): ArticleListItem {
        if (articleRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Article with slug '${request.slug}' already exists")
        }
        val article = Article(
            slug = request.slug,
            status = request.status,
            category = request.categoryId?.let { categoryRepository.getReferenceById(it) },
        )

        request.translations.forEach { dto ->
            val lang = dto.language ?: Language.EN
            val translation = ArticleTranslation(
                language = lang,
                title = dto.title,
                summary = dto.summary,
                content = dto.content,
                article = article
            )
            article.translations[lang] = translation
        }

        if (request.tagIds.isNotEmpty()) {
            val tags = tagRepository.findAllById(request.tagIds)
            article.tags.addAll(tags)
        }

        val saved = articleRepository.save(article)
        return saved.toArticleListItem(Language.EN)
    }

    @Transactional
    fun update(id: Long, request: ArticleUpsertRequest): ArticleListItem {
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
            } else {
                val translation = ArticleTranslation(
                    language = lang,
                    title = dto.title,
                    summary = dto.summary,
                    content = dto.content,
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

        val saved = articleRepository.save(existingArticle)
        return saved.toArticleListItem(Language.EN)
    }

    @Transactional
    fun delete(id: Long) {
        if (!articleRepository.existsById(id)) {
            throw IllegalArgumentException("Article not found with id: $id")
        }
        articleRepository.deleteById(id)
    }

    @Transactional
    fun incrementViewCount(id: Long) {
        val article = articleRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Article not found with id: $id") }
        article.viewCount++
        articleRepository.save(article)
    }

    private fun Article.toArticleListItem(language: Language): ArticleListItem {
        val translation = translations[language] ?: translations[Language.EN]
        return ArticleListItem(
            id = id!!,
            slug = slug,
            title = translation?.title ?: "",
            summary = translation?.summary,
            status = status,
            viewCount = viewCount,
            createdAt = createdAt,
            updatedAt = updatedAt,
            category = category?.let { cat ->
                val catName = cat.names[language] ?: cat.names[Language.EN] ?: cat.names[Language.ZH] ?: ""
                CategoryVo(id = cat.id, name = catName, slug = cat.slug, parentId = cat.parent?.id)
            },
            tags = tags.map { tag ->
                val tagName = tag.name
                TagVo(id = tag.id, name = tagName, slug = tag.slug)
            }.takeIf { it.isNotEmpty() }
        )
    }

    private fun Article.toArticleVo(language: Language): ArticleVo {
        val translation = translations[language] ?: translations[Language.EN]
            ?: throw ResourceNotFoundException("Article translation not found for language: $language")
        return ArticleVo(
            id = id!!,
            slug = slug,
            createdAt = createdAt,
            updatedAt = updatedAt,
            viewCount = viewCount,
            title = translation.title,
            summary = translation.summary ?: "",
            content = translation.content ?: "",
            language = translation.language,
            category = category?.let { cat ->
                val catName = cat.names[language] ?: cat.names[Language.EN]
                CategoryVo(id = cat.id, name = catName!!, slug = cat.slug, parentId = cat.parent?.id)
            } ?: CategoryVo(id = null, name = "", slug = "", parentId = null),
            tags = tags.map { tag ->
                val tagName = tag.name
                TagVo(id = tag.id, name = tagName!!, slug = tag.slug)
            }
        )
    }
}