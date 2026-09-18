package cn.arorms.blog.app.services

/**
 * Article service interface
 * @author Sheng
 * @version 1.2.0 2026-09-11
 * @since 2026-07-22
 */
import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.ArticleQueryRequest
import cn.arorms.blog.common.requests.ArticleUpsertRequest
import cn.arorms.blog.common.responses.ArticleSummaryVo
import cn.arorms.blog.common.responses.ArticleVo
import cn.arorms.framework.common.domain.PageResponse
import org.springframework.data.domain.Pageable

interface ArticleService {

    fun getArticlePage(pageable: Pageable, query: ArticleQueryRequest?): PageResponse<ArticleSummaryVo>

    fun getPublishedArticlePage(pageable: Pageable, query: ArticleQueryRequest?): PageResponse<ArticleSummaryVo>

    fun getBySlug(language: Language, slug: String): ArticleVo

    fun findById(id: Long): Article

    /**
     * Upsert article metadata
     */
    fun upsert(authorId: String, request: ArticleUpsertRequest)

    fun delete(id: Long)
}