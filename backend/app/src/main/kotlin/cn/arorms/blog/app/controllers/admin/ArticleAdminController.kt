package cn.arorms.blog.app.controllers.admin;

import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.app.services.ArticleService
import cn.arorms.blog.common.requests.ArticleQueryRequest
import cn.arorms.blog.common.requests.ArticleUpsertRequest
import cn.arorms.blog.common.responses.ArticleSummaryVo
import cn.arorms.framework.common.domain.PageResponse
import cn.arorms.framework.security.UserPrincipal
import org.springframework.data.domain.Pageable
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * Admin Article Controller
 * @version 0.9.0 2026-07-29
 * @author cacc
 */
@RestController
@RequestMapping("/api/admin/article")
public class ArticleAdminController (
    private val articleService: ArticleService,
) {
    /**
     * Used for admin manage page
     * Allow admin to get all the article list and modify
     */
    @GetMapping
    fun getArticlePage(
        pageable: Pageable,
        query: ArticleQueryRequest
    ): ResponseEntity<PageResponse<ArticleSummaryVo>> {
        val summaryPageResponse = articleService.getArticlePage(pageable, query)
        return ResponseEntity.ok(summaryPageResponse)
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

    @PostMapping
    fun createArticle(
        @AuthenticationPrincipal userPrincipal: UserPrincipal,
        @RequestBody request: ArticleUpsertRequest
    ): ResponseEntity<Void> {
        articleService.create(userPrincipal.id, request)
        return ResponseEntity.status(HttpStatus.CREATED).build()
    }

    @PutMapping("/{id}")
    fun updateArticle(
        @PathVariable id: Long,
        @RequestBody request: ArticleUpsertRequest
    ): ResponseEntity<Void> {
//        val updatedArticle = articleService.update(id, request)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/{id}")
    fun deleteArticle(@PathVariable id: Long): ResponseEntity<Void> {
        articleService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
