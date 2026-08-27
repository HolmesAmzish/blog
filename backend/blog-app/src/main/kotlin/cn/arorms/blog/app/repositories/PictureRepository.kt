package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.Picture
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for Picture entity
 * @version 1.0.0 2026-08-24
 * @since 2026-03-09
 */
@Repository
interface PictureRepository : JpaRepository<Picture, Long> {
    fun findByFilename(filename: String): Picture?
    fun findByShowInGalleryTrue(pageable: Pageable): Page<Picture>
}