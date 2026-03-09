package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.Image
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for Image entity
 */
@Repository
interface ImageRepository : JpaRepository<Image, Long> {
    
    fun findByFilename(filename: String): Image?
    
    fun findByUploaderId(uploaderId: Long): List<Image>
}