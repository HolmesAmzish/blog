package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dtos.TagDTO
import cn.arorms.blog.backend.dtos.TagRequest
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
    fun getAllTags(): ResponseEntity<List<Tag>> {
        val tags = tagService.findAll()
        return ResponseEntity.ok(tags)
    }
    
//    @GetMapping("/{id}")
//    fun getTagById(@PathVariable id: Long): ResponseEntity<TagDTO> {
//        val tag = tagService.findById(id)
//        return if (tag != null) {
//            ResponseEntity.ok(tag.toDTO())
//        } else {
//            ResponseEntity.notFound().build()
//        }
//    }
    
    @GetMapping("/slug/{slug}")
    fun getTagBySlug(@PathVariable slug: String): ResponseEntity<Tag> {
        val tag = tagService.findBySlug(slug)
        return if (tag != null) {
            ResponseEntity.ok(tag)
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PostMapping
    fun createTag(@RequestBody request: TagRequest): ResponseEntity<Tag> {
        val tag = Tag(
            name = request.name,
            slug = request.slug
        )
        val savedTag = tagService.create(tag)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTag)
    }
    
    @PutMapping("/{id}")
    fun updateTag(@PathVariable id: Long, @RequestBody request: TagRequest): ResponseEntity<Tag> {
        val tag = Tag(
            name = request.name,
            slug = request.slug
        )
        val updatedTag = tagService.update(id, tag)
        return ResponseEntity.ok(updatedTag)
    }
    
    @DeleteMapping("/{id}")
    fun deleteTag(@PathVariable id: Long): ResponseEntity<Void> {
        tagService.delete(id)
        return ResponseEntity.noContent().build()
    }
}