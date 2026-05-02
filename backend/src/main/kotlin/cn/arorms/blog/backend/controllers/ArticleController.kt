package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.responses.ArticleListItem
import cn.arorms.blog.backend.dto.responses.ArticleVo
import cn.arorms.blog.backend.dto.PageResponse
import cn.arorms.blog.backend.dto.requests.ArticleUpsertRequest
import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.services.ArticleService
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
) {

    /**
     * Used for admin manage page
     * Allow admin to get all the article list and modify
     * @return article list item page with english title
     */
    @GetMapping
    fun getAllArticles(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String,
    ): ResponseEntity<PageResponse<ArticleListItem>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        val articlePage = articleService.getArticleList(pageable)
        return ResponseEntity.ok(PageResponse.fromPage(articlePage))
    }

    /**
     * Used for guest to get article page with his language
     * @return article list item page.
     */
    @GetMapping("/published")
    fun getPublishedArticles(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String,
        @RequestParam(defaultValue = "EN") language: Language,
        @RequestParam(required = false) keyword: String?,
        @RequestParam(required = false) categoryId: Long?
    ): ResponseEntity<PageResponse<ArticleListItem>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)

        val articlePage = articleService.findAllPublished(language, keyword, categoryId, pageable)
        return ResponseEntity.ok(PageResponse.fromPage(articlePage))
    }

    /**
     * for admin manage
     * @return ArticleListItem for admin to modify
     */
    @GetMapping("/{id}")
    fun getArticleById(@PathVariable id: Long): ResponseEntity<Article> {
        val article = articleService.findById(id)
        return ResponseEntity.ok(article)
    }

    /**
     * for guest page for a detailed article view
     * @return ArticleVo with localized content
     */
    @GetMapping("/slug/{slug}")
    fun getArticleBySlug(
        @PathVariable slug: String,
        @RequestParam(defaultValue = "EN") language: Language
    ): ResponseEntity<ArticleVo> {
        val articleVo = articleService.findBySlug(language, slug)
        // Increment view count
        articleService.incrementViewCount(articleVo.id)
        return ResponseEntity.ok(articleVo)
    }

    @PostMapping
    fun createArticle(@RequestBody request: ArticleUpsertRequest): ResponseEntity<ArticleListItem> {
        val savedArticle = articleService.create(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedArticle)
    }

    @PutMapping("/{id}")
    fun updateArticle(
        @PathVariable id: Long,
        @RequestBody request: ArticleUpsertRequest
    ): ResponseEntity<ArticleListItem> {
        val updatedArticle = articleService.update(id, request)
        return ResponseEntity.ok(updatedArticle)
    }
}
