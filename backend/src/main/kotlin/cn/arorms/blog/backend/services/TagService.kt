package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.dto.responses.TagVo
import cn.arorms.blog.backend.dto.requests.TagUpsertRequest
import cn.arorms.blog.backend.entities.Tag
import cn.arorms.blog.backend.enums.Language
import cn.arorms.blog.backend.exception.ResourceNotFoundException
import cn.arorms.blog.backend.repositories.TagRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Service class for Tag operations
 */
@Service
class TagService(
    private val tagRepository: TagRepository
) {

    fun findAll(language: Language): List<TagVo> {
        return tagRepository.findAll().map { it.toVo() }
    }

    fun findAllEntities(): List<Tag> {
        return tagRepository.findAll()
    }

    fun findById(id: Long): Tag? {
        return tagRepository.findById(id).orElse(null)
    }

    fun findById(id: Long, language: Language): TagVo {
        val tag = tagRepository.findById(id).orElseThrow {
            ResourceNotFoundException("Tag not found with id: $id")
        }
        return tag.toVo()
    }

    fun getTagsByIds(idList: List<Long>): List<Tag> {
        return tagRepository.findAllById(idList)
    }

    fun findBySlug(slug: String): Tag? {
        return tagRepository.findBySlug(slug)
    }

    fun findBySlug(slug: String, language: Language): TagVo {
        val tag = tagRepository.findBySlug(slug) ?: throw ResourceNotFoundException("Tag not found with slug: $slug")
        return tag.toVo()
    }

    @Transactional
    fun create(request: TagUpsertRequest): TagVo {
        if (tagRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Tag with slug '${request.slug}' already exists")
        }
        val tag = Tag(
            name = request.name,
            slug = request.slug
        )
        val saved = tagRepository.save(tag)
        return saved.toVo()
    }

    @Transactional
    fun update(id: Long, request: TagUpsertRequest): TagVo {
        val existingTag = tagRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Tag not found with id: $id") }

        if (request.slug != existingTag.slug && tagRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Tag with slug '${request.slug}' already exists")
        }

        existingTag.name = request.name
        existingTag.slug = request.slug

        val saved = tagRepository.save(existingTag)
        return saved.toVo()
    }

    @Transactional
    fun delete(id: Long) {
        if (!tagRepository.existsById(id)) {
            throw ResourceNotFoundException("Tag not found with id: $id")
        }
        tagRepository.deleteById(id)
    }

    private fun Tag.toVo(): TagVo {
        return TagVo(
            id = id,
            name = name,
            slug = slug
        )
    }
}
