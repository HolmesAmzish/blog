package cn.arorms.blog.app.controllers

import cn.arorms.blog.app.services.ArticleService
import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.common.requests.ArticleQueryRequest
import cn.arorms.blog.common.responses.ArticleVo
import cn.arorms.blog.common.requests.ArticleUpsertRequest
import cn.arorms.blog.common.responses.ArticleSummaryVo
import cn.arorms.blog.common.enums.Language
import cn.arorms.framework.common.domain.PageResponse
import cn.arorms.framework.security.UserPrincipal
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
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
    ): ResponseEntity<PageResponse<ArticleSummaryVo>> {
        val summaryPageResponse = articleService.getArticlePage(pageable, request)
        return ResponseEntity.ok(summaryPageResponse)
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
}