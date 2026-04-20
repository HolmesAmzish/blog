package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dtos.ArticleCreateRequest
import cn.arorms.blog.backend.dtos.ArticleUpdateRequest
import cn.arorms.blog.backend.dtos.PageResponse
import cn.arorms.blog.backend.dtos.TagDTO
import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.projections.ArticleListItem
import cn.arorms.blog.backend.services.ArticleService
import cn.arorms.blog.backend.services.CategoryService
import cn.arorms.blog.backend.services.TagService
import cn.arorms.blog.backend.services.UserService
import org.springframework.data.domain.Page
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
) {
    
    @GetMapping
    fun getAllArticles(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): ResponseEntity<PageResponse<ArticleListItem>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        val pageResponse = PageResponse.fromPage(articleService.getArticleList(pageable))
        return ResponseEntity.ok(pageResponse)
    }
    
    @GetMapping("/published")
    fun getPublishedArticles(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String,
        @RequestParam(defaultValue = "EN") language: Language,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(required = false) categoryId: Long?,
        @RequestParam(required = false) tagId: List<Long>?
    ): ResponseEntity<PageResponse<ArticleListItem>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)

        val page = articleService.findAllPublished(language, keyword, categoryId, tagId, pageable)
        val pageResponse = PageResponse.fromPage(page)

        return ResponseEntity.ok(pageResponse)
    }

    @GetMapping("/{id}")
    fun getArticleById(@PathVariable id: Long): ResponseEntity<Article> {
        val article = articleService.findById(id)
        return ResponseEntity.ok(article)
    }

    @GetMapping("/slug/{slug}")
    fun getArticleBySlug(@PathVariable slug: String): ResponseEntity<Article> {
        val article = articleService.findBySlug(slug)
        // Increment view count
        articleService.incrementViewCount(article.id!!)
        return ResponseEntity.ok(article)
    }

//    @GetMapping("/search")
//    fun searchArticles(
//        @RequestParam keyword: String,
//        @RequestParam(defaultValue = "0") page: Int,
//        @RequestParam(defaultValue = "10") size: Int
//    ): ResponseEntity<ArticlePageResponse> {
//        val pageable = PageRequest.of(page, size, Sort.by("createdAt").descending())
//        val articlePage = articleService.searchByTitle(keyword, pageable)
//
//        val response = ArticlePageResponse(
//            content = articlePage.content.map { it.toListDTO() },
//            totalElements = articlePage.totalElements,
//            totalPages = articlePage.totalPages,
//            currentPage = page,
//            size = size
//        )
//        return ResponseEntity.ok(response)
//    }
//
//    @GetMapping("/popular")
//    fun getPopularArticles(@RequestParam(defaultValue = "5") limit: Int): ResponseEntity<List<ArticleDTO>> {
//        val articles = articleService.findPopular(limit)
//        return ResponseEntity.ok(articles.map { it.toDTO() })
//    }
//
    @PostMapping
    fun createArticle(@RequestBody request: ArticleCreateRequest): ResponseEntity<Article> {

        val savedArticle = articleService.create(request)

        return ResponseEntity.status(HttpStatus.CREATED).body(savedArticle)
    }

    @PutMapping("/{id}")
    fun updateArticle(@PathVariable id: Long, @RequestBody request: ArticleUpdateRequest): ResponseEntity<Article> {
        val updatedArticle = articleService.update(id, request)
        return ResponseEntity.ok(updatedArticle)
    }
//
//    @DeleteMapping("/{id}")
//    fun deleteArticle(@PathVariable id: Long): ResponseEntity<Void> {
//        articleService.delete(id)
//        return ResponseEntity.noContent().build()
//    }
//
//    @PostMapping("/{id}/publish")
//    fun publishArticle(@PathVariable id: Long): ResponseEntity<ArticleDTO> {
//        val article = articleService.publish(id)
//        return ResponseEntity.ok(article.toDTO())
//    }
//
//    @PostMapping("/{id}/archive")
//    fun archiveArticle(@PathVariable id: Long): ResponseEntity<ArticleDTO> {
//        val article = articleService.archive(id)
//        return ResponseEntity.ok(article.toDTO())
//    }
//
//    @PostMapping("/{articleId}/tags/{tagId}")
//    fun addTagToArticle(@PathVariable articleId: Long, @PathVariable tagId: Long): ResponseEntity<Void> {
//        articleService.addTagToArticle(articleId, tagId)
//        return ResponseEntity.ok().build()
//    }
//
//    @DeleteMapping("/{articleId}/tags/{tagId}")
//    fun removeTagFromArticle(@PathVariable articleId: Long, @PathVariable tagId: Long): ResponseEntity<Void> {
//        articleService.removeTagFromArticle(articleId, tagId)
//        return ResponseEntity.noContent().build()
//    }
//
}