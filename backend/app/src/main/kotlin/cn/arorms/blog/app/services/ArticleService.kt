package cn.arorms.blog.app.services

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

    fun create(request: ArticleUpsertRequest)

    fun update(id: Long, request: ArticleUpsertRequest)

    fun delete(id: Long)

    fun incrementViewCount(id: Long)

}