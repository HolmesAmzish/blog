package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dtos.CategoryDto
import cn.arorms.blog.backend.dtos.CategoryCreateRequest
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
    fun getAllCategories(): ResponseEntity<List<CategoryDto>> {
        val categories = categoryService.findAll()
        return ResponseEntity.ok(categories)
    }

    @GetMapping("/{id}")
    fun getCategoryById(@PathVariable id: Long): ResponseEntity<CategoryDto> {
        val category = categoryService.findById(id)
        return ResponseEntity.ok(category)
    }

    @GetMapping("/slug/{slug}")
    fun getCategoryBySlug(@PathVariable slug: String): ResponseEntity<CategoryDto> {
        return ResponseEntity.ok(categoryService.findBySlug(slug))
    }

    @GetMapping("/tree")
    fun getCategoryTree(): ResponseEntity<Category> {
        val tree = categoryService.buildCategoryTree()
        return ResponseEntity.ok(tree)
    }

    @PostMapping
    fun createCategory(@RequestBody request: CategoryCreateRequest): ResponseEntity<Category> {
        val savedCategory = categoryService.create(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory)
    }

    @PutMapping("/{id}")
    fun updateCategory(@PathVariable id: Long, @RequestBody request: CategoryDto): ResponseEntity<CategoryDto> {
        val updatedCategory = categoryService.update(id, request)
        return ResponseEntity.ok(updatedCategory)
    }

    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: Long): ResponseEntity<Void> {
        categoryService.delete(id)
        return ResponseEntity.noContent().build()
    }
}
