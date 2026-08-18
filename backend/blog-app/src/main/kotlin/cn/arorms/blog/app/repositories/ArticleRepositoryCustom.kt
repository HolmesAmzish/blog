package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.Article
import cn.arorms.blog.common.enums.Language
import cn.arorms.blog.common.requests.ArticleQueryRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface ArticleRepositoryCustom {
    fun findArticlePage(pageable: Pageable, request: ArticleQueryRequest): Page<Article>

    fun findByCategoryId(categoryId: Long, language: Language, pageable: Pageable): Page<Article>

    fun countByCategoryId(categoryId: Long): Long

    fun getTotalViewCount(): Long
}