package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.Category
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for Category entity
 */
@Repository
interface CategoryRepository : JpaRepository<Category, Long> {
    
    fun findByName(name: String): Category?
    
    fun findBySlug(slug: String): Category?
    
    fun findByParentId(parentId: Long?): List<Category>
    
    fun existsByName(name: String): Boolean
    
    fun existsBySlug(slug: String): Boolean
}