package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.Tag
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for Tag entity
 */
@Repository
interface TagRepository : JpaRepository<Tag, Long> {

    fun findBySlug(slug: String): Tag?

    fun existsBySlug(slug: String): Boolean
}
