package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.Article
import cn.arorms.blog.backend.entities.Category
import cn.arorms.blog.backend.enums.ArticleStatus
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.projections.ArticleListItem
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository


/**
 * Repository interface for Article entity
 */
@Repository
interface ArticleRepository : JpaRepository<Article, Long> {

    @Query("""
    SELECT a FROM Article a 
    WHERE (:categoryId IS NULL OR a.category.id = :categoryId)
      AND (
          CAST(:keyword AS string) IS NULL 
          OR a.title ILIKE CONCAT('%', CAST(:keyword AS string), '%') 
          OR a.summary ILIKE CONCAT('%', CAST(:keyword AS string), '%')
      )
      AND a.language = :lang
      AND a.status = 'PUBLISHED'
    """)
    fun findAllPublished(
        lang: Language,
        keyword: String?,
        categoryId: Long?,
        tagIds: List<Long>?,
        pageable: Pageable
    ): Page<ArticleListItem>

    @Query("select a from Article a")
    fun findAllListItem(pageable: Pageable): Page<ArticleListItem>

    fun findBySlug(slug: String): Article?

    fun findByCategoryId(categoryId: Long, pageable: Pageable): Page<ArticleListItem>

    fun findByAuthorId(authorId: Long, pageable: Pageable): Page<ArticleListItem>
//
//    @Query("SELECT a FROM Article a WHERE a.status = :status AND a.title LIKE %:keyword%")
//    fun findByStatusAndTitleContaining(
//        @Param("status") status: ArticleStatus,
//        @Param("keyword") keyword: String,
//        pageable: Pageable
//    ): Page<ArticleListItem>
//
//    @Query("SELECT a FROM Article a JOIN a.articleTags at WHERE at.tag.id = :tagId")
//    fun findByTagId(@Param("tagId") tagId: Long, pageable: Pageable): Page<ArticleListItem>
//
//    @Query("SELECT a FROM Article a WHERE a.status = 'PUBLISHED' ORDER BY a.viewCount DESC")
//    fun findTopByViewCount(pageable: Pageable): List<Article>
//
//    @Query("SELECT a FROM Article a")
//    fun findAllListItem(pageable: Pageable): Page<ArticleListItem>
//
    fun existsBySlug(slug: String): Boolean

    @Query("SELECT SUM(a.viewCount) FROM Article a ")
    fun getTotalViewCount(): Long
}