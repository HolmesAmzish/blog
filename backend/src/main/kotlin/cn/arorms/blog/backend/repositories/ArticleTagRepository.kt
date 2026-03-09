package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.ArticleTag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for ArticleTag junction entity
 */
@Repository
interface ArticleTagRepository : JpaRepository<ArticleTag, Long> {
    
    fun findByArticleId(articleId: Long): List<ArticleTag>
    
    fun findByTagId(tagId: Long): List<ArticleTag>
    
    fun deleteByArticleIdAndTagId(articleId: Long, tagId: Long)
    
    fun existsByArticleIdAndTagId(articleId: Long, tagId: Long): Boolean
}