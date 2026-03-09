package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.TagDTO
import cn.arorms.blog.backend.dto.TagRequest
import cn.arorms.blog.backend.entities.Tag
import cn.arorms.blog.backend.services.TagService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for Tag operations
 */
@RestController
@RequestMapping("/api/tags")
class TagController(private val tagService: TagService) {
    
    @GetMapping
    fun getAllTags(): ResponseEntity<List<TagDTO>> {
        val tags = tagService.findAll()
        return ResponseEntity.ok(tags.map { it.toDTO() })
    }
    
    @GetMapping("/{id}")
    fun getTagById(@PathVariable id: Long): ResponseEntity<TagDTO> {
        val tag = tagService.findById(id)
        return if (tag != null) {
            ResponseEntity.ok(tag.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/slug/{slug}")
    fun getTagBySlug(@PathVariable slug: String): ResponseEntity<TagDTO> {
        val tag = tagService.findBySlug(slug)
        return if (tag != null) {
            ResponseEntity.ok(tag.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PostMapping
    fun createTag(@RequestBody request: TagRequest): ResponseEntity<TagDTO> {
        val tag = Tag(
            name = request.name,
            description = request.description,
            slug = request.slug
        )
        val savedTag = tagService.create(tag)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTag.toDTO())
    }
    
    @PutMapping("/{id}")
    fun updateTag(@PathVariable id: Long, @RequestBody request: TagRequest): ResponseEntity<TagDTO> {
        val tag = Tag(
            name = request.name,
            description = request.description,
            slug = request.slug
        )
        val updatedTag = tagService.update(id, tag)
        return ResponseEntity.ok(updatedTag.toDTO())
    }
    
    @DeleteMapping("/{id}")
    fun deleteTag(@PathVariable id: Long): ResponseEntity<Void> {
        tagService.delete(id)
        return ResponseEntity.noContent().build()
    }
    
    // Extension function to convert Tag to TagDTO
    private fun Tag.toDTO(): TagDTO {
        return TagDTO(
            id = this.id,
            name = this.name,
            description = this.description,
            slug = this.slug,
            articleCount = this.id?.let { tagService.getArticleCount(it) }
        )
    }
}