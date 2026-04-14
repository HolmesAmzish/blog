package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.entities.Tag
import cn.arorms.blog.backend.repositories.ArticleTagRepository
import cn.arorms.blog.backend.repositories.TagRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Service class for Tag operations
 */
@Service
class TagService(
    private val tagRepository: TagRepository,
    private val articleTagRepository: ArticleTagRepository
) {
    
    fun findAll(): List<Tag> {
        return tagRepository.findAll()
    }
    
    fun findById(id: Long): Tag? {
        return tagRepository.findById(id).orElse(null)
    }
    
    fun findBySlug(slug: String): Tag? {
        return tagRepository.findBySlug(slug)
    }
    
    fun findByName(name: String): Tag? {
        return tagRepository.findByName(name)
    }
    
    @Transactional
    fun create(tag: Tag): Tag {
        if (tagRepository.existsByName(tag.name)) {
            throw IllegalArgumentException("Tag with name '${tag.name}' already exists")
        }
        if (tagRepository.existsBySlug(tag.slug)) {
            throw IllegalArgumentException("Tag with slug '${tag.slug}' already exists")
        }
        return tagRepository.save(tag)
    }
    
    @Transactional
    fun update(id: Long, tag: Tag): Tag {
        val existingTag = tagRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Tag not found with id: $id") }
        
        if (tag.name != existingTag.name && tagRepository.existsByName(tag.name)) {
            throw IllegalArgumentException("Tag with name '${tag.name}' already exists")
        }
        if (tag.slug != existingTag.slug && tagRepository.existsBySlug(tag.slug)) {
            throw IllegalArgumentException("Tag with slug '${tag.slug}' already exists")
        }
        
        existingTag.name = tag.name
        existingTag.slug = tag.slug
        existingTag.description = tag.description
        
        return tagRepository.save(existingTag)
    }
    
    @Transactional
    fun delete(id: Long) {
        if (!tagRepository.existsById(id)) {
            throw IllegalArgumentException("Tag not found with id: $id")
        }
        // Remove all article-tag associations first
        articleTagRepository.findByTagId(id).forEach { articleTagRepository.delete(it) }
        tagRepository.deleteById(id)
    }
    
    fun getArticleCount(tagId: Long): Long {
        return articleTagRepository.findByTagId(tagId).size.toLong()
    }

    fun findByArticleId(articleId: Long): List<cn.arorms.blog.backend.entities.ArticleTag> {
        return articleTagRepository.findByArticleId(articleId)
    }
}