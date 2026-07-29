package cn.arorms.blog.app.controllers

import cn.arorms.blog.common.responses.CategoryVo
import cn.arorms.blog.common.responses.CategoryTreeNode
import cn.arorms.blog.common.requests.CategoryUpsertRequest
import cn.arorms.blog.app.entities.Category
import cn.arorms.blog.common.enums.Language
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for Category operations
 * @version 0.9.0 2026-07-29
 */
@RestController
@RequestMapping("/api/categories")
class CategoryController(private val categoryService: cn.arorms.blog.app.services.CategoryService) {

    /**
     * @return List<CategoryVo>, without parent and children relationship
     */
    @GetMapping
    fun getAllCategories(
        @RequestParam(defaultValue = "EN") language: Language
    ): ResponseEntity<List<CategoryVo>> {
        val categories = categoryService.findAll(language)
        return ResponseEntity.ok(categories)
    }

    /**
     * @return List<CategoryEntity>, raw entity data for admin
     */
    @GetMapping("/entity")
    fun getAllCategoryEntities(): ResponseEntity<List<Category>> {
        val categories = categoryService.findAllEntities()
        return ResponseEntity.ok(categories)
    }

    @GetMapping("/{id}")
    fun getCategoryById(
        @PathVariable id: Long,
        @RequestParam(defaultValue = "EN") language: Language
    ): ResponseEntity<CategoryVo> {
        val category = categoryService.findById(id, language)
        return ResponseEntity.ok(category)
    }

    @GetMapping("/slug/{slug}")
    fun getCategoryBySlug(
        @PathVariable slug: String,
        @RequestParam(defaultValue = "EN") language: Language
    ): ResponseEntity<CategoryVo> {
        return ResponseEntity.ok(categoryService.findBySlug(slug, language))
    }

    /**
     * Return a tree of CategoryTreeNode with children for frontend echarts to draw a tree
     * @return CategoryTreeNode
     */
    @GetMapping("/tree")
    fun getCategoryTree(
        @RequestParam(defaultValue = "EN") language: Language
    ): ResponseEntity<CategoryTreeNode> {
        val tree = categoryService.buildCategoryTree(language)
        return ResponseEntity.ok(tree)
    }


}
