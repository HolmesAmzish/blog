package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.entities.ArticleTag
import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.projections.ArticleListItem
import cn.arorms.blog.backend.repositories.ArticleRepository
import cn.arorms.blog.backend.repositories.ArticleTagRepository
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
    private val articleTagRepository: ArticleTagRepository,
    private val tagRepository: TagRepository
) {
    
    fun findAll(pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findAllListItem(pageable)
    }

    fun findById(id: Long): Article? {
        return articleRepository.findById(id).orElse(null)
    }

    fun findBySlug(slug: String): Article? {
        return articleRepository.findBySlug(slug)
    }

    fun findPublished(pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findByStatus(ArticleStatus.PUBLISHED, pageable)
    }

    fun findPublishedByLanguage(language: Language, pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findByStatusAndLanguage(ArticleStatus.PUBLISHED, language, pageable)
    }

    fun findByCategory(categoryId: Long, pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findByCategoryId(categoryId, pageable)
    }

    fun findByTag(tagId: Long, pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findByTagId(tagId, pageable)
    }

    fun searchByTitle(keyword: String, pageable: Pageable): Page<ArticleListItem> {
        return articleRepository.findByStatusAndTitleContaining(ArticleStatus.PUBLISHED, keyword, pageable)
    }
    
    fun findPopular(limit: Int): List<Article> {
        return articleRepository.findTopByViewCount(Pageable.ofSize(limit))
    }
    
    @Transactional
    fun create(article: Article): Article {
        if (articleRepository.existsBySlug(article.slug)) {
            throw IllegalArgumentException("Article with slug '${article.slug}' already exists")
        }
        return articleRepository.save(article)
    }
    
    @Transactional
    fun update(id: Long, article: Article): Article {
        val existingArticle = articleRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Article not found with id: $id") }
        
        existingArticle.title = article.title
        existingArticle.summary = article.summary
        existingArticle.content = article.content
        existingArticle.originalContent = article.originalContent
        existingArticle.language = article.language
        existingArticle.status = article.status
        existingArticle.category = article.category
        
        if (article.slug != existingArticle.slug && articleRepository.existsBySlug(article.slug)) {
            throw IllegalArgumentException("Article with slug '${article.slug}' already exists")
        }
        existingArticle.slug = article.slug
        
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
    fun addTagToArticle(articleId: Long, tagId: Long) {
        if (articleTagRepository.existsByArticleIdAndTagId(articleId, tagId)) {
            return
        }
        val article = articleRepository.findById(articleId)
            .orElseThrow { IllegalArgumentException("Article not found with id: $articleId") }
        val tag = tagRepository.findById(tagId)
            .orElseThrow { IllegalArgumentException("Tag not found with id: $tagId") }
        
        val articleTag = ArticleTag(article = article, tag = tag)
        articleTagRepository.save(articleTag)
    }
    
    @Transactional
    fun removeTagFromArticle(articleId: Long, tagId: Long) {
        articleTagRepository.deleteByArticleIdAndTagId(articleId, tagId)
    }
    
    @Transactional
    fun incrementViewCount(id: Long) {
        val article = articleRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Article not found with id: $id") }
        article.viewCount++
        articleRepository.save(article)
    }
    
    @Transactional
    fun publish(id: Long): Article {
        val article = articleRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Article not found with id: $id") }
        article.status = ArticleStatus.PUBLISHED
        article.publishedAt = java.time.LocalDateTime.now()
        return articleRepository.save(article)
    }
    
    @Transactional
    fun archive(id: Long): Article {
        val article = articleRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Article not found with id: $id") }
        article.status = ArticleStatus.ARCHIVED
        return articleRepository.save(article)
    }
}