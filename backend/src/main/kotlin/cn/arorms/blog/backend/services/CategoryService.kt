package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.entities.Category
import cn.arorms.blog.backend.repositories.ArticleRepository
import cn.arorms.blog.backend.repositories.CategoryRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Service class for Category operations
 */
@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val articleRepository: ArticleRepository
) {
    
    fun findAll(): List<Category> {
        return categoryRepository.findAll()
    }
    
    fun findById(id: Long): Category? {
        return categoryRepository.findById(id).orElse(null)
    }
    
    fun findBySlug(slug: String): Category? {
        return categoryRepository.findBySlug(slug)
    }
    
    fun findRootCategories(): List<Category> {
        return categoryRepository.findByParentId(null)
    }
    
    fun findChildren(parentId: Long): List<Category> {
        return categoryRepository.findByParentId(parentId)
    }
    
    @Transactional
    fun create(category: Category): Category {
        if (categoryRepository.existsByName(category.name)) {
            throw IllegalArgumentException("Category with name '${category.name}' already exists")
        }
        if (categoryRepository.existsBySlug(category.slug)) {
            throw IllegalArgumentException("Category with slug '${category.slug}' already exists")
        }
        return categoryRepository.save(category)
    }
    
    @Transactional
    fun update(id: Long, category: Category): Category {
        val existingCategory = categoryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Category not found with id: $id") }
        
        if (category.name != existingCategory.name && categoryRepository.existsByName(category.name)) {
            throw IllegalArgumentException("Category with name '${category.name}' already exists")
        }
        if (category.slug != existingCategory.slug && categoryRepository.existsBySlug(category.slug)) {
            throw IllegalArgumentException("Category with slug '${category.slug}' already exists")
        }
        
        existingCategory.name = category.name
        existingCategory.slug = category.slug
        existingCategory.description = category.description
        
        // Handle parent category
        if (category.parent?.id == id) {
            throw IllegalArgumentException("Category cannot be its own parent")
        }
        existingCategory.parent = category.parent
        
        return categoryRepository.save(existingCategory)
    }
    
    @Transactional
    fun delete(id: Long) {
        if (!categoryRepository.existsById(id)) {
            throw IllegalArgumentException("Category not found with id: $id")
        }
        
        // Check if category has children
        val children = categoryRepository.findByParentId(id)
        if (children.isNotEmpty()) {
            throw IllegalStateException("Cannot delete category with children. Remove or reassign children first.")
        }
        
        // Remove category from articles (set to null)
        val articles = articleRepository.findAll().filter { it.category?.id == id }
        articles.forEach { it.category = null }
        
        categoryRepository.deleteById(id)
    }
    
    fun getArticleCount(categoryId: Long): Long {
        return articleRepository.findByCategoryId(categoryId, org.springframework.data.domain.Pageable.unpaged()).totalElements
    }
}