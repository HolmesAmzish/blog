package cn.arorms.blog.app.controllers

import cn.arorms.blog.common.responses.TagVo
import cn.arorms.blog.common.requests.TagUpsertRequest
import cn.arorms.blog.app.entities.Tag
import cn.arorms.blog.common.enums.Language
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for Tag operations
 */
@RestController
@RequestMapping("/api/tags")
class TagController(private val tagService: cn.arorms.blog.app.services.TagService) {

    /**
     * @return List<TagVo>
     */
    @GetMapping
    fun getAllTags(
        @RequestParam(defaultValue = "EN") language: Language
    ): ResponseEntity<List<TagVo>> {
        val tags = tagService.findAll(language)
        return ResponseEntity.ok(tags)
    }

    /**
     * @return List<Tag>, raw entity data for admin
     */
    @GetMapping("/entity")
    fun getAllTagEntities(): ResponseEntity<List<Tag>> {
        val tags = tagService.findAllEntities()
        return ResponseEntity.ok(tags)
    }

    /**
     * @param TagUpsertRequest
     * @return TagVo
     */
    @PostMapping
    fun createTag(@RequestBody request: TagUpsertRequest): ResponseEntity<TagVo> {
        val savedTag = tagService.create(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTag)
    }

    /**
     * @param TagUpsertRequest
     * @return TagVo
     */
    @PutMapping("/{id}")
    fun updateTag(@PathVariable id: Long, @RequestBody request: TagUpsertRequest): ResponseEntity<TagVo> {
        val updatedTag = tagService.update(id, request)
        return ResponseEntity.ok(updatedTag)
    }

    @DeleteMapping("/{id}")
    fun deleteTag(@PathVariable id: Long): ResponseEntity<Void> {
        tagService.delete(id)
        return ResponseEntity.noContent().build()
    }
}