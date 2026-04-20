package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.dtos.ArticleCreateRequest
import cn.arorms.blog.backend.dtos.ArticleUpdateRequest
import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.exception.ResourceNotFoundException
import cn.arorms.blog.backend.projections.ArticleListItem
import cn.arorms.blog.backend.repositories.ArticleRepository
import cn.arorms.blog.backend.repositories.CategoryRepository
import cn.arorms.blog.backend.repositories.TagRepository
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Service class for Article operations
 */
@Service
class ArticleService(
    private val articleRepository: ArticleRepository,
    private val tagRepository: TagRepository,
    private val categoryRepository: CategoryRepository
) {

    fun getArticleList(pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findAllListItem(pageable)
    }

    fun findById(id: Long): Article {
        return articleRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Article not found with id: $id") }
    }

    @Transactional
    fun findBySlug(slug: String): Article {
        return articleRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Article not found with slug: $slug")
    }

    fun findAllPublished(language: Language, keyword: String?, categoryId: Long?, tagId: List<Long>?, pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findAllPublished(language, keyword, categoryId, tagId, pageable)
    }


    fun findByCategory(categoryId: Long, pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findByCategoryId(categoryId, pageable)
    }

//    fun findByTag(tagId: Long, pageable: Pageable): Page<ArticleListItem> {
//        return articleRepository.findByTagId(tagId, pageable)
//    }
//
//    fun searchByTitle(keyword: String, pageable: Pageable): Page<ArticleListItem> {
//        return articleRepository.findByStatusAndTitleContaining(ArticleStatus.PUBLISHED, keyword, pageable)
//    }
//
//    fun findPopular(limit: Int): List<Article> {
//        return articleRepository.findTopByViewCount(Pageable.ofSize(limit))
//    }
//
    @Transactional
    fun create(request: ArticleCreateRequest): Article {
        if (articleRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Article with slug '${request.slug}' already exists")
        }
        val article = Article(
            slug = request.slug,
            title = request.title,
            language = request.language,
            summary = request.summary,
            content = request.content,
            category = request.categoryId?.let { categoryRepository.getReferenceById(it) },
        )

        // Add tags if provided
        if (request.tagIds.isNotEmpty()) {
            val tags = tagRepository.findAllById(request.tagIds)
            article.tags.addAll(tags)
        }

        return articleRepository.save(article)
    }

    @Transactional
    fun update(id: Long, request: ArticleUpdateRequest): Article {
        val existingArticle = articleRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Article not found with id: $id") }

        existingArticle.title = request.title
        existingArticle.summary = request.summary
        existingArticle.content = request.content
        existingArticle.language = request.language
        existingArticle.status = request.status
        existingArticle.category = request.categoryId?.let { categoryRepository.getReferenceById(it) }

        if (request.slug != existingArticle.slug && articleRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Article with slug '${request.slug}' already exists")
        }
        existingArticle.slug = request.slug

        // Update tags if provided
        existingArticle.tags.clear()
        if (request.tagIds.isNotEmpty()) {
            val tags = tagRepository.findAllById(request.tagIds)
            existingArticle.tags.addAll(tags)
        }

        return articleRepository.save(existingArticle)
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
            .orElseThrow { IllegalArgumentException("Article not found with id: $id") }
        article.viewCount++
        articleRepository.save(article)
    }
}