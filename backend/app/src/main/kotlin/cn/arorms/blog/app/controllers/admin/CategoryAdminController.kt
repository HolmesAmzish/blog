package cn.arorms.blog.app.controllers.admin

import cn.arorms.blog.common.requests.CategoryUpsertRequest
import cn.arorms.blog.common.responses.CategoryVo
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * @version 0.9.0 2026-07-29
 */
@RestController
@RequestMapping("/api/admin/categories")
class CategoryAdminController (private val categoryService: cn.arorms.blog.app.services.CategoryService) {
    @PostMapping
    fun createCategory(@RequestBody request: CategoryUpsertRequest): ResponseEntity<CategoryVo> {
        val savedCategory = categoryService.create(request)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedCategory)
    }

    @PutMapping("/{id}")
    fun updateCategory(
        @PathVariable id: Long,
        @RequestBody request: CategoryUpsertRequest
    ): ResponseEntity<CategoryVo> {
        val updatedCategory = categoryService.update(id, request)
        return ResponseEntity.ok(updatedCategory)
    }

    @DeleteMapping("/{id}")
    fun deleteCategory(@PathVariable id: Long): ResponseEntity<Void> {
        categoryService.delete(id)
        return ResponseEntity.noContent().build()
    }
}