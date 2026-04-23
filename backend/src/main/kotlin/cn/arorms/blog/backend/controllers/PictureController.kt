package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dtos.PageResponse
import cn.arorms.blog.backend.entities.Picture
import cn.arorms.blog.backend.services.PictureService
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
import java.nio.file.Files
import java.nio.file.Paths

/**
 * REST Controller for Picture operations
 */
@RestController
@RequestMapping("/api/pictures")
class PictureController(private val pictureService: PictureService) {

    @GetMapping
    fun getAllPictures(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): ResponseEntity<PageResponse<Picture>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        val page = pictureService.findAll(pageable)
        val pageResponse = PageResponse.fromPage(page)
        return ResponseEntity.ok(pageResponse)
    }

    @GetMapping("/{id}")
    fun getPictureById(@PathVariable id: Long): ResponseEntity<Picture> {
        val picture = pictureService.findById(id)
        return ResponseEntity.ok(picture)
    }

    @GetMapping("/uploader/{uploaderId}")
    fun getPicturesByUploader(
        @PathVariable uploaderId: Long,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @RequestParam(defaultValue = "createdAt") sortBy: String,
        @RequestParam(defaultValue = "desc") sortDir: String
    ): ResponseEntity<PageResponse<Picture>> {
        val sort = if (sortDir == "asc") Sort.by(sortBy).ascending() else Sort.by(sortBy).descending()
        val pageable = PageRequest.of(page, size, sort)
        val page = pictureService.findByUploader(uploaderId, pageable)
        val pageResponse = PageResponse.fromPage(page)
        return ResponseEntity.ok(pageResponse)
    }

    @PostMapping("/upload")
    fun uploadPicture(
        @RequestParam("file") file: MultipartFile,
        @RequestParam(required = false) uploaderId: Long?,
        @RequestParam(required = false) alt: String?
    ): ResponseEntity<PictureResponse> {
        val picture = pictureService.upload(file, uploaderId, alt)
        return ResponseEntity.status(HttpStatus.CREATED).body(picture.toResponse())
    }

    @PutMapping("/{id}/alt")
    fun updatePictureAlt(
        @PathVariable id: Long,
        @RequestParam alt: String?
    ): ResponseEntity<PictureResponse> {
        val picture = pictureService.updateAlt(id, alt)
        return ResponseEntity.ok(picture.toResponse())
    }

    @DeleteMapping("/{id}")
    fun deletePicture(@PathVariable id: Long): ResponseEntity<Void> {
        pictureService.delete(id)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/files/{filename}")
    fun servePicture(@PathVariable filename: String): ResponseEntity<Resource> {
        val filePath = pictureService.getImageFilePath(filename)
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

    @GetMapping("/thumbnails/{filename}")
    fun serveThumbnail(@PathVariable filename: String): ResponseEntity<Resource> {
        // Remove "thumb_" prefix to get original filename
        val originalFilename = filename.removePrefix("thumb_")
        val filePath = pictureService.getImageFilePath(originalFilename) ?: return ResponseEntity.notFound().build()

        // Check if thumbnail exists
        val thumbDir = Paths.get(pictureService.getUploadDir(), "thumbnails")
        val thumbPath = thumbDir.resolve(filename)

        return if (Files.exists(thumbPath)) {
            val resource = UrlResource(thumbPath.toUri())
            if (resource.exists() && resource.isReadable) {
                ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_JPEG)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"$filename\"")
                    .body(resource)
            } else {
                ResponseEntity.notFound().build()
            }
        } else {
            // Fallback to original picture if thumbnail doesn't exist
            servePicture(originalFilename)
        }
    }

    // Response DTO for Picture
    data class PictureResponse(
        val id: Long?,
        val filename: String,
        val originalFilename: String,
        val mimeType: String,
        val size: Long,
        val url: String,
        val thumbnailUrl: String?,
        val alt: String?,
        val uploaderId: Long?,
        val uploaderName: String?,
        val createdAt: String?
    )

    // Extension function to convert Picture to PictureResponse
    private fun Picture.toResponse(): PictureResponse {
        return PictureResponse(
            id = this.id,
            filename = this.filename,
            originalFilename = this.originalFilename,
            mimeType = this.mimeType,
            size = this.size,
            url = this.url,
            thumbnailUrl = this.thumbnailUrl,
            alt = this.alt,
            uploaderId = this.uploader?.id,
            uploaderName = this.uploader?.displayName ?: this.uploader?.username,
            createdAt = this.createdAt.toString()
        )
    }
}