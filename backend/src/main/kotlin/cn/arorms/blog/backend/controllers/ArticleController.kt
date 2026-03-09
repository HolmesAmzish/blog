package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.ArticleDTO
import cn.arorms.blog.backend.dto.ArticlePageResponse
import cn.arorms.blog.backend.dto.ArticleRequest
import cn.arorms.blog.backend.dto.TagDTO
import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.entities.Category
import cn.arorms.blog.backend.entities.User
import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.repositories.ArticleTagRepository
import cn.arorms.blog.backend.services.ArticleService
import cn.arorms.blog.backend.services.CategoryService
import cn.arorms.blog.backend.services.TagService
import cn.arorms.blog.backend.services.UserService
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for Article operations
 */
@RestController
@RequestMapping("/api/articles")
class ArticleController(
    private val articleService: ArticleService,
    private val categoryService: CategoryService,
    private val tagService: TagService,
    private val userService: UserService,
    private val articleTagRepository: ArticleTagRepository
) {
    
    @GetMapping
    fun getAllArticles(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): ResponseEntity<ArticlePageResponse> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        val articlePage = articleService.findAll(pageable)
        
        val response = ArticlePageResponse(
            content = articlePage.content.map { it.toDTO() },
            totalElements = articlePage.totalElements,
            totalPages = articlePage.totalPages,
            currentPage = page,
            size = size
        )
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/published")
    fun getPublishedArticles(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(required = false) language: Language?,
        @RequestParam(defaultValue = "publishedAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): ResponseEntity<ArticlePageResponse> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        
        val articlePage = if (language != null) {
            articleService.findPublishedByLanguage(language, pageable)
        } else {
            articleService.findPublished(pageable)
        }
        
        val response = ArticlePageResponse(
            content = articlePage.content.map { it.toDTO() },
            totalElements = articlePage.totalElements,
            totalPages = articlePage.totalPages,
            currentPage = page,
            size = size
        )
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/{id}")
    fun getArticleById(@PathVariable id: Long): ResponseEntity<ArticleDTO> {
        val article = articleService.findById(id)
        return if (article != null) {
            ResponseEntity.ok(article.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/slug/{slug}")
    fun getArticleBySlug(@PathVariable slug: String): ResponseEntity<ArticleDTO> {
        val article = articleService.findBySlug(slug)
        return if (article != null) {
            // Increment view count
            articleService.incrementViewCount(article.id!!)
            ResponseEntity.ok(article.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/category/{categoryId}")
    fun getArticlesByCategory(
        @PathVariable categoryId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<ArticlePageResponse> {
        val pageable = PageRequest.of(page, size, Sort.by("createdAt").descending())
        val articlePage = articleService.findByCategory(categoryId, pageable)
        
        val response = ArticlePageResponse(
            content = articlePage.content.map { it.toDTO() },
            totalElements = articlePage.totalElements,
            totalPages = articlePage.totalPages,
            currentPage = page,
            size = size
        )
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/tag/{tagId}")
    fun getArticlesByTag(
        @PathVariable tagId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<ArticlePageResponse> {
        val pageable = PageRequest.of(page, size, Sort.by("createdAt").descending())
        val articlePage = articleService.findByTag(tagId, pageable)
        
        val response = ArticlePageResponse(
            content = articlePage.content.map { it.toDTO() },
            totalElements = articlePage.totalElements,
            totalPages = articlePage.totalPages,
            currentPage = page,
            size = size
        )
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/search")
    fun searchArticles(
        @RequestParam keyword: String,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int
    ): ResponseEntity<ArticlePageResponse> {
        val pageable = PageRequest.of(page, size, Sort.by("createdAt").descending())
        val articlePage = articleService.searchByTitle(keyword, pageable)
        
        val response = ArticlePageResponse(
            content = articlePage.content.map { it.toDTO() },
            totalElements = articlePage.totalElements,
            totalPages = articlePage.totalPages,
            currentPage = page,
            size = size
        )
        return ResponseEntity.ok(response)
    }
    
    @GetMapping("/popular")
    fun getPopularArticles(@RequestParam(defaultValue = "5") limit: Int): ResponseEntity<List<ArticleDTO>> {
        val articles = articleService.findPopular(limit)
        return ResponseEntity.ok(articles.map { it.toDTO() })
    }
    
    @PostMapping
    fun createArticle(@RequestBody request: ArticleRequest): ResponseEntity<ArticleDTO> {
        val article = Article(
            title = request.title,
            summary = request.summary,
            content = request.content,
            originalContent = request.originalContent,
            slug = request.slug,
            language = request.language,
            status = request.status,
            category = request.categoryId?.let { categoryService.findById(it) },
            author = null // TODO: Get from security context
        )
        
        val savedArticle = articleService.create(article)
        
        // Add tags
        request.tagIds.forEach { tagId ->
            articleService.addTagToArticle(savedArticle.id!!, tagId)
        }
        
        return ResponseEntity.status(HttpStatus.CREATED).body(articleService.findById(savedArticle.id!!)?.toDTO())
    }
    
    @PutMapping("/{id}")
    fun updateArticle(@PathVariable id: Long, @RequestBody request: ArticleRequest): ResponseEntity<ArticleDTO> {
        val article = Article(
            title = request.title,
            summary = request.summary,
            content = request.content,
            originalContent = request.originalContent,
            slug = request.slug,
            language = request.language,
            status = request.status,
            category = request.categoryId?.let { categoryService.findById(it) }
        )
        
        val updatedArticle = articleService.update(id, article)
        return ResponseEntity.ok(updatedArticle.toDTO())
    }
    
    @DeleteMapping("/{id}")
    fun deleteArticle(@PathVariable id: Long): ResponseEntity<Void> {
        articleService.delete(id)
        return ResponseEntity.noContent().build()
    }
    
    @PostMapping("/{id}/publish")
    fun publishArticle(@PathVariable id: Long): ResponseEntity<ArticleDTO> {
        val article = articleService.publish(id)
        return ResponseEntity.ok(article.toDTO())
    }
    
    @PostMapping("/{id}/archive")
    fun archiveArticle(@PathVariable id: Long): ResponseEntity<ArticleDTO> {
        val article = articleService.archive(id)
        return ResponseEntity.ok(article.toDTO())
    }
    
    @PostMapping("/{articleId}/tags/{tagId}")
    fun addTagToArticle(@PathVariable articleId: Long, @PathVariable tagId: Long): ResponseEntity<Void> {
        articleService.addTagToArticle(articleId, tagId)
        return ResponseEntity.ok().build()
    }
    
    @DeleteMapping("/{articleId}/tags/{tagId}")
    fun removeTagFromArticle(@PathVariable articleId: Long, @PathVariable tagId: Long): ResponseEntity<Void> {
        articleService.removeTagFromArticle(articleId, tagId)
        return ResponseEntity.noContent().build()
    }
    
    // Extension function to convert Article to ArticleDTO
    private fun Article.toDTO(): ArticleDTO {
        val articleTags = articleTagRepository.findByArticleId(this.id!!)
        val tags = articleTags.mapNotNull { articleTag ->
            articleTag.tag.let { tag ->
                TagDTO(
                    id = tag.id,
                    name = tag.name,
                    description = tag.description,
                    slug = tag.slug,
                    articleCount = tagService.getArticleCount(tag.id!!)
                )
            }
        }
        
        return ArticleDTO(
            id = this.id,
            title = this.title,
            summary = this.summary,
            content = this.content,
            originalContent = this.originalContent,
            slug = this.slug,
            language = this.language,
            status = this.status,
            viewCount = this.viewCount,
            categoryId = this.category?.id,
            categoryName = this.category?.name,
            authorId = this.author?.id,
            authorName = this.author?.displayName ?: this.author?.username,
            tags = tags,
            createdAt = this.createdAt.toString(),
            updatedAt = this.updatedAt.toString(),
            publishedAt = this.publishedAt?.toString()
        )
    }
}