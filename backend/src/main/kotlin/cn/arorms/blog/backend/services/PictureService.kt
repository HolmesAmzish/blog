package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.entities.Picture
import cn.arorms.blog.backend.exception.ResourceNotFoundException
import cn.arorms.blog.backend.repositories.PictureRepository
import cn.arorms.blog.backend.repositories.UserRepository
import net.coobird.thumbnailator.Thumbnails
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.io.File
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*
import kotlin.jvm.optionals.getOrNull

/**
 * Service class for Picture operations
 */
@Service
class PictureService(
    private val pictureRepository: PictureRepository,
    private val userRepository: UserRepository,
    @Value("\${app.upload.dir:uploads}") private val uploadDir: String,
    @Value("\${app.upload.url:/uploads}") private val uploadUrl: String,
    @Value("\${app.thumbnail.width:512}") private val thumbnailWidth: Int,
    @Value("\${app.thumbnail.height:512}") private val thumbnailHeight: Int
) {

    // Public getter for uploadDir (used by controller)
    fun getUploadDir(): String = uploadDir

    private val allowedTypes = listOf("image/jpeg", "image/png", "image/gif", "image/webp")
    private val maxFileSize: Long = 10 * 1024 * 1024 // 10MB
    
    fun findAll(pageable: Pageable): Page<Picture> {
        return pictureRepository.findAll(pageable)
    }


    
    fun findById(id: Long): Picture {
        return pictureRepository.findById(id).getOrNull()
            ?: throw ResourceNotFoundException("Picture not found with id $id")
    }
    
    fun findByUploader(uploaderId: Long, pageable: Pageable): Page<Picture> {
        return pictureRepository.findByUploaderId(uploaderId, pageable)
    }
    
    @Transactional
    @Throws(IOException::class)
    fun upload(file: MultipartFile, uploaderId: Long?, alt: String?): Picture {
        // Validate file
        if (file.isEmpty) {
            throw IllegalArgumentException("File is empty")
        }
        if (file.size > maxFileSize) {
            throw IllegalArgumentException("File size exceeds maximum limit of 10MB")
        }
        if (!allowedTypes.contains(file.contentType)) {
            throw IllegalArgumentException("File type '${file.contentType}' is not allowed")
        }

        // Generate unique filename
        val originalFilename = file.originalFilename ?: "unknown"
        val extension = originalFilename.substringAfterLast(".", "jpg")
        val filename = "${UUID.randomUUID()}.$extension"

        // Create upload directory if not exists
        val uploadPath: Path = Paths.get(uploadDir)
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath)
        }

        // Save original file
        val filePath = uploadPath.resolve(filename)
        Files.copy(file.inputStream, filePath)

        // Generate thumbnail immediately
        val thumbFilename = generateThumbnail(file, filename)

        // Create picture entity
        val picture = Picture(
            filename = filename,
            originalFilename = originalFilename,
            mimeType = file.contentType ?: "image/jpeg",
            size = file.size,
            url = "$uploadUrl/$filename",
            alt = alt,
            thumbnailUrl = "$uploadUrl/thumbnails/$thumbFilename"
        )

        // Set uploader if provided
        if (uploaderId != null) {
            val uploader = userRepository.findById(uploaderId).orElse(null)
            picture.uploader = uploader
        }

        return pictureRepository.save(picture)
    }
    
    @Transactional
    fun updateAlt(id: Long, alt: String?): Picture {
        val picture = pictureRepository.findById(id).getOrNull() ?: throw ResourceNotFoundException("Picture not found with id $id")
        picture.alt = alt
        return pictureRepository.save(picture)
    }

    @Transactional
    @Throws(IOException::class)
    fun delete(id: Long) {
        val picture = pictureRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Picture not found with id: $id") }

        // Delete file from disk
        val filePath = Paths.get(uploadDir, picture.filename)
        Files.deleteIfExists(filePath)

        // Delete from database
        pictureRepository.deleteById(id)
    }
    
    fun getImageFilePath(filename: String): Path? {
        val picture = pictureRepository.findByFilename(filename) ?: return null
        val filePath = Paths.get(uploadDir, picture.filename)
        return if (Files.exists(filePath)) filePath else null
    }

    /**
     * Generate and save thumbnail for a picture
     * Uses thumbnailator library to create a resized version
     * Returns the thumbnail filename
     */
    @Throws(IOException::class)
    fun generateThumbnail(file: MultipartFile, filename: String): String {
        val thumbFilename = "thumb_$filename"
        val thumbDir = Paths.get(uploadDir, "thumbnails")
        if (!Files.exists(thumbDir)) {
            Files.createDirectories(thumbDir)
        }
        val thumbPath = thumbDir.resolve(thumbFilename)

        // Use thumbnailator to generate thumbnail
        Thumbnails.of(file.inputStream)
            .size(thumbnailWidth, thumbnailHeight)
            .keepAspectRatio(true)
            .outputFormat(getFormatName(file.contentType!!))
            .toFile(thumbPath.toFile())

        return thumbFilename
    }

    /**
     * Get file format name from mime type
     */
    private fun getFormatName(mimeType: String): String = when (mimeType) {
        "image/jpeg" -> "jpg"
        "image/png" -> "png"
        "image/gif" -> "gif"
        "image/webp" -> "webp"
        else -> "jpg"
    }

    /**
     * Get thumbnail URL for a picture
     */
    fun getThumbnailUrl(filename: String): String {
        val thumbFilename = "thumb_$filename"
        return "$uploadUrl/thumbnails/$thumbFilename"
    }
}