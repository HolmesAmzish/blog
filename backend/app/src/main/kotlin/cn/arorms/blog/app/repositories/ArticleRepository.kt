package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.Article
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository


/**
 * Repository interface for Article entity
 */
@Repository
interface ArticleRepository : JpaRepository<Article, Long>,
    ArticleRepositoryCustom {

    fun findBySlug(slug: String): Article?

    fun existsBySlug(slug: String): Boolean
}