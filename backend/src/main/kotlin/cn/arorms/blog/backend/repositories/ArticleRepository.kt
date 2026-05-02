package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.enums.Language
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository


/**
 * Repository interface for Article entity
 */
@Repository
interface ArticleRepository : JpaRepository<Article, Long>, JpaSpecificationExecutor<Article> {

    @Query("SELECT a FROM Article a")
    fun findAllListItem(pageable: Pageable): Page<Article>

    fun findBySlug(slug: String): Article?

    @Query("""
    SELECT a FROM Article a
    LEFT JOIN a.translations t ON t.language = :lang
    WHERE a.category.id = :categoryId AND a.status = 'PUBLISHED'
    """)
    fun findByCategoryId(@Param("categoryId") categoryId: Long, @Param("lang") lang: Language, pageable: Pageable): Page<Article>

    @Query("""
        SELECT a FROM Article a
        LEFT JOIN a.translations t ON t.language = :lang
        WHERE a.author.id = :authorId AND a.status = 'PUBLISHED'
    """)
    fun findByAuthorId(@Param("authorId") authorId: Long, @Param("lang") lang: Language, pageable: Pageable): Page<Article>

    fun existsBySlug(slug: String): Boolean

    @Query("SELECT SUM(a.viewCount) FROM Article a ")
    fun getTotalViewCount(): Long
}
