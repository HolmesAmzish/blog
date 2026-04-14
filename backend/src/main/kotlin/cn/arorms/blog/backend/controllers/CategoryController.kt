package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.CategoryDTO
import cn.arorms.blog.backend.dto.CategoryRequest
import cn.arorms.blog.backend.entities.Category
import cn.arorms.blog.backend.services.CategoryService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for Category operations
 */
@RestController
@RequestMapping("/api/categories")
class CategoryController(private val categoryService: CategoryService) {

    @GetMapping
    fun getAllCategories(): ResponseEntity<List<CategoryDTO>> {
        val categories = categoryService.findAll()
        return ResponseEntity.ok(categories.map { it.toDTO() })
    }

    @GetMapping("/{id}")
    fun getCategoryById(@PathVariable id: Long): ResponseEntity<CategoryDTO> {
        val category = categoryService.findById(id)
        return if (category != null) {
            ResponseEntity.ok(category.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/slug/{slug}")
    fun getCategoryBySlug(@PathVariable slug: String): ResponseEntity<CategoryDTO> {
        val category = categoryService.findBySlug(slug)
        return if (category != null) {
            ResponseEntity.ok(category.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @GetMapping("/tree")
    fun getCategoryTree(): ResponseEntity<CategoryDTO> {
        val tree = categoryService.buildCategoryTree()
        return ResponseEntity.ok(tree)
    }

    @PostMapping
    fun createCategory(@RequestBody request: CategoryRequest): ResponseEntity<CategoryDTO> {
        val category = Category(
            name = request.name,
            description = request.description,
            slug = request.slug,
            parent = request.parentId?.let { categoryService.findById(it) }
        )
        val savedCategory = categoryService.create(category)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory.toDTO())
    }

    @PutMapping("/{id}")
    fun updateCategory(@PathVariable id: Long, @RequestBody request: CategoryRequest): ResponseEntity<CategoryDTO> {
        val category = Category(
            name = request.name,
            description = request.description,
            slug = request.slug,
            parent = request.parentId?.let { categoryService.findById(it) }
        )
        val updatedCategory = categoryService.update(id, category)
        return ResponseEntity.ok(updatedCategory.toDTO())
    }

    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: Long): ResponseEntity<Void> {
        categoryService.delete(id)
        return ResponseEntity.noContent().build()
    }

    // Extension function to convert Category to CategoryDTO (without children)
    private fun Category.toDTO(): CategoryDTO {
        return CategoryDTO(
            id = this.id,
            name = this.name,
            description = this.description,
            slug = this.slug,
            parentId = this.parent?.id,
            parentName = this.parent?.name,
            children = emptyList(),
            articleCount = this.id?.let { categoryService.getArticleCount(it) }
        )
    }

    // Extension function to convert Category to CategoryDTO with children (for tree structure)
    private fun Category.toDTOWithChildren(): CategoryDTO {
        val children = this.id?.let { categoryService.findChildren(it) } ?: emptyList()
        return CategoryDTO(
            id = this.id,
            name = this.name,
            description = this.description,
            slug = this.slug,
            parentId = this.parent?.id,
            parentName = this.parent?.name,
            children = children.map { it.toDTOWithChildren() },  // Recursively build children tree
            articleCount = this.id?.let { categoryService.getArticleCount(it) }
        )
    }
}
