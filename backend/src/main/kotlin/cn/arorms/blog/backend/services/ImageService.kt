package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.entities.Image
import cn.arorms.blog.backend.exception.ResourceNotFoundException
import cn.arorms.blog.backend.repositories.ImageRepository
import cn.arorms.blog.backend.repositories.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.util.*
import kotlin.jvm.optionals.getOrNull

/**
 * Service class for Image operations
 */
@Service
class ImageService(
    private val imageRepository: ImageRepository,
    private val userRepository: UserRepository,
    @Value("\${app.upload.dir:uploads}") private val uploadDir: String,
    @Value("\${app.upload.url:/uploads}") private val uploadUrl: String
) {
    
    private val allowedTypes = listOf("image/jpeg", "image/png", "image/gif", "image/webp")
    private val maxFileSize: Long = 10 * 1024 * 1024 // 10MB
    
    fun findAll(pageable: Pageable): Page<Image> {
        return imageRepository.findAll(pageable)
    }


    
    fun findById(id: Long): Image {
        return imageRepository.findById(id).getOrNull()
            ?: throw ResourceNotFoundException("Image not found with id $id")
    }
    
    fun findByUploader(uploaderId: Long, pageable: Pageable): Page<Image> {
        return imageRepository.findByUploaderId(uploaderId, pageable)
    }
    
    @Transactional
    @Throws(IOException::class)
    fun upload(file: MultipartFile, uploaderId: Long?, alt: String?): Image {
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
        
        // Save file
        val filePath = uploadPath.resolve(filename)
        Files.copy(file.inputStream, filePath)
        
        // Create image entity
        val image = Image(
            filename = filename,
            originalFilename = originalFilename,
            mimeType = file.contentType ?: "image/jpeg",
            size = file.size,
            url = "$uploadUrl/$filename",
            alt = alt
        )
        
        // Set uploader if provided
        if (uploaderId != null) {
            val uploader = userRepository.findById(uploaderId).orElse(null)
            image.uploader = uploader
        }
        
        return imageRepository.save(image)
    }
    
    @Transactional
    fun updateAlt(id: Long, alt: String?): Image {
        val image = imageRepository.findById(id).getOrNull() ?: throw ResourceNotFoundException("Image not found with id $id")
        image.alt = alt
        return imageRepository.save(image)
    }
    
    @Transactional
    @Throws(IOException::class)
    fun delete(id: Long) {
        val image = imageRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Image not found with id: $id") }
        
        // Delete file from disk
        val filePath = Paths.get(uploadDir, image.filename)
        Files.deleteIfExists(filePath)
        
        // Delete from database
        imageRepository.deleteById(id)
    }
    
    fun getImageFilePath(filename: String): Path? {
        val image = imageRepository.findByFilename(filename) ?: return null
        val filePath = Paths.get(uploadDir, image.filename)
        return if (Files.exists(filePath)) filePath else null
    }
}