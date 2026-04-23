package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.Picture
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for Picture entity
 */
@Repository
interface PictureRepository : JpaRepository<Picture, Long> {

    fun findByFilename(filename: String): Picture?

    fun findByUploaderId(uploaderId: Long, pageable: Pageable): Page<Picture>
}