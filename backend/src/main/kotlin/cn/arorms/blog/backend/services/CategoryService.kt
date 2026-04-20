package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.dtos.CategoryDto
import cn.arorms.blog.backend.dtos.CategoryCreateRequest
import cn.arorms.blog.backend.entities.Category
import cn.arorms.blog.backend.exception.ResourceNotFoundException
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

    fun findAll(): List<CategoryDto> {
        val categories = categoryRepository.findAll()
        return categories.map { it.toDto() }
    }

    fun findById(id: Long): CategoryDto {
        val category = categoryRepository.findById(id)
            .orElseThrow { ResourceNotFoundException("Category not found with id: $id") }
        return category.toDto()
    }

    fun findBySlug(slug: String): CategoryDto {
        val category = categoryRepository.findBySlug(slug)
            ?: throw ResourceNotFoundException("Category not found with slug: $slug")
        return category.toDto()
    }

    fun findRootCategories(): List<Category> {
        return categoryRepository.findByParentId(null)
    }

    fun findChildren(parentId: Long): List<Category> {
        return categoryRepository.findByParentId(parentId)
    }

    /**
     * Build full category tree with unlimited depth
     */
    fun buildCategoryTree(): Category {
        val rootCategories = findRootCategories()
        val children = rootCategories.map { buildTree(it) }

        return Category(
            id = null,
            name = "ARORMS.BLOG",
            slug = "root",
            parent = null,
            children = children.toMutableSet(),
            articles = mutableSetOf()
        )
    }

    private fun buildTree(category: Category): Category {
        val children = findChildren(category.id!!)
        val childTrees = children.map { buildTree(it) }

        return Category(
            id = category.id,
            name = category.name,
            slug = category.slug,
            parent = category.parent,
            children = childTrees.toMutableSet(),
            articles = category.articles
        )
    }

    @Transactional
    fun create(request: CategoryCreateRequest): Category {
        if (categoryRepository.existsByName(request.name)) {
            throw IllegalArgumentException("Category with name '${request.name}' already exists")
        }
        if (categoryRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Category with slug '${request.slug}' already exists")
        }
        val parent = request.parentId?.let { id ->
            categoryRepository.findById(id).orElseThrow {
                ResourceNotFoundException("Parent category with id $id not found")
            }
        }
        val category = Category(
            name = request.name,
            slug = request.slug,
            parent = parent
        )
        return categoryRepository.save(category)
    }

    @Transactional
    fun update(id: Long, request: CategoryDto): CategoryDto {
        val existingCategory = categoryRepository.findById(id)
            .orElseThrow { IllegalArgumentException("Category not found with id: $id") }

        if (request.name != existingCategory.name && categoryRepository.existsByName(request.name)) {
            throw IllegalArgumentException("Category with name '${request.name}' already exists")
        }
        if (request.slug != existingCategory.slug && categoryRepository.existsBySlug(request.slug)) {
            throw IllegalArgumentException("Category with slug '${request.slug}' already exists")
        }

        existingCategory.name = request.name
        existingCategory.slug = request.slug
        existingCategory.parent = request.parentId?.let { categoryRepository.getReferenceById(it) }

        val savedCategory = categoryRepository.save(existingCategory)
        return savedCategory.toDto()
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

    private fun Category.toDto(): CategoryDto {
        return CategoryDto(
            id = id,
            name = name,
            slug = slug,
            parentId = parent?.id,
        )
    }
}
