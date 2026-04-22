package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dtos.PageResponse
import cn.arorms.blog.backend.entities.Image
import cn.arorms.blog.backend.services.ImageService
import org.springframework.core.io.Resource
import org.springframework.core.io.UrlResource
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

/**
 * REST Controller for Image operations
 */
@RestController
@RequestMapping("/api/images")
class ImageController(private val imageService: ImageService) {
    
    @GetMapping
    fun getAllImages(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): ResponseEntity<PageResponse<Image>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        val page = imageService.findAll(pageable)
        val pageResponse = PageResponse.fromPage(page)
        return ResponseEntity.ok(pageResponse)
    }
    
    @GetMapping("/{id}")
    fun getImageById(@PathVariable id: Long): ResponseEntity<Image> {
        val image = imageService.findById(id)
        return ResponseEntity.ok(image)
    }
    
    @GetMapping("/uploader/{uploaderId}")
    fun getImagesByUploader(
        @PathVariable uploaderId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): ResponseEntity<PageResponse<Image>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        val page = imageService.findByUploader(uploaderId, pageable)
        val pageResponse = PageResponse.fromPage(page)
        return ResponseEntity.ok(pageResponse)
    }
    
    @PostMapping("/upload")
    fun uploadImage(
        @RequestParam("file") file: MultipartFile,
        @RequestParam(required = false) uploaderId: Long?,
        @RequestParam(required = false) alt: String?
    ): ResponseEntity<ImageResponse> {
        val image = imageService.upload(file, uploaderId, alt)
        return ResponseEntity.status(HttpStatus.CREATED).body(image.toResponse())
    }
    
    @PutMapping("/{id}/alt")
    fun updateImageAlt(
        @PathVariable id: Long,
        @RequestParam alt: String?
    ): ResponseEntity<ImageResponse> {
        val image = imageService.updateAlt(id, alt)
        return ResponseEntity.ok(image.toResponse())
    }
    
    @DeleteMapping("/{id}")
    fun deleteImage(@PathVariable id: Long): ResponseEntity<Void> {
        imageService.delete(id)
        return ResponseEntity.noContent().build()
    }
    
    @GetMapping("/files/{filename}")
    fun serveImage(@PathVariable filename: String): ResponseEntity<Resource> {
        val filePath = imageService.getImageFilePath(filename)
        return if (filePath != null) {
            val resource = UrlResource(filePath.toUri())
            if (resource.exists() && resource.isReadable) {
                ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"$filename\"")
                    .body(resource)
            } else {
                ResponseEntity.notFound().build()
            }
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    // Response DTO for Image
    data class ImageResponse(
        val id: Long?,
        val filename: String,
        val originalFilename: String,
        val mimeType: String,
        val size: Long,
        val url: String,
        val alt: String?,
        val uploaderId: Long?,
        val uploaderName: String?,
        val createdAt: String?
    )
    
    // Extension function to convert Image to ImageResponse
    private fun Image.toResponse(): ImageResponse {
        return ImageResponse(
            id = this.id,
            filename = this.filename,
            originalFilename = this.originalFilename,
            mimeType = this.mimeType,
            size = this.size,
            url = this.url,
            alt = this.alt,
            uploaderId = this.uploader?.id,
            uploaderName = this.uploader?.displayName ?: this.uploader?.username,
            createdAt = this.createdAt.toString()
        )
    }
}