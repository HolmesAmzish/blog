package cn.arorms.blog.app.controllers

import cn.arorms.blog.app.services.ArticleService
import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.common.requests.ArticleQueryRequest
import cn.arorms.blog.common.responses.ArticleVo
import cn.arorms.blog.common.requests.ArticleUpsertRequest
import cn.arorms.blog.common.responses.ArticleSummaryVo
import cn.arorms.blog.common.enums.Language
import cn.arorms.framework.common.domain.ApiResponse
import cn.arorms.framework.common.domain.PageResponse
import org.springframework.data.domain.Pageable
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
     * Find published article pages with language
     * @return article list item page.
     */
    @GetMapping
    fun getAllPublishedArticles(
        pageable: Pageable,
        request: ArticleQueryRequest,
    ): ApiResponse<PageResponse<ArticleSummaryVo>> {
        val summaryPageResponse = articleService.getArticlePage(pageable, request)
        return ApiResponse.ok(summaryPageResponse)
    }

    /**
     * for guest page for a detailed article view
     * @return ArticleVo with localized content
     */
    @GetMapping("/{slug}")
    fun getArticleBySlug(
        @PathVariable slug: String,
        @RequestParam(defaultValue = "EN") language: Language
    ): ResponseEntity<ArticleVo> {
        val articleVo = articleService.getBySlug(language, slug)
        // Increment view count
        articleService.incrementViewCount(articleVo.id)
        return ResponseEntity.ok(articleVo)
    }


    /**
     * Used for admin manage page
     * Allow admin to get all the article list and modify
     */
    @GetMapping("/get-all")
    fun getArticlePage(
        pageable: Pageable,
        query: ArticleQueryRequest
    ): ApiResponse<PageResponse<ArticleSummaryVo>> {
        val summaryPageResponse = articleService.getArticlePage(pageable, query)
        return ApiResponse.ok(summaryPageResponse)
    }

    /**
     * for admin manage
     * @return ArticleListItem for admin to modify
     */
    @GetMapping("/author/{id}")
    fun getArticleById(@PathVariable id: Long): ApiResponse<Article> {
        val article = articleService.findById(id)
        return ApiResponse.ok(article)
    }

    @PostMapping("/author/")
    fun createArticle(@RequestBody request: ArticleUpsertRequest): ApiResponse<Void> {
        articleService.create(request)
        return ApiResponse.created()
    }

    @PutMapping("/author/{id}")
    fun updateArticle(
        @PathVariable id: Long,
        @RequestBody request: ArticleUpsertRequest
    ): ApiResponse<Void> {
//        val updatedArticle = articleService.update(id, request)
        return ApiResponse.noContent()
    }

    @DeleteMapping("/author/{id}")
    fun deleteArticle(@PathVariable id: Long): ApiResponse<Void> {
        articleService.delete(id)
        return ApiResponse.noContent()
    }
}
