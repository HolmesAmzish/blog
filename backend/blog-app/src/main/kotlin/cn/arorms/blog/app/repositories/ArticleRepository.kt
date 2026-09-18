package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.Article
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


/**
 * Repository interface for Article entity
 * @version 1.2.0 2026-09-18
 * @since 2026-07-22
 */
@Repository
interface ArticleRepository :
    JpaRepository<Article, Long>,
    ArticleRepositoryCustom {
    fun findBySlug(slug: String): Article?
    fun existsBySlug(slug: String): Boolean
}