package cn.arorms.blog.backend.dto

/**
 * Data Transfer Object for Category
 */
data class CategoryDTO(
    val id: Long?,
    val name: String,
    val description: String?,
    val slug: String,
    val parentId: Long?,
    val parentName: String?,
    val children: List<CategoryDTO>,
    val articleCount: Long?
)

/**
 * Request object for creating/updating a category
 */
data class CategoryRequest(
    val name: String,
    val description: String?,
    val slug: String,
    val parentId: Long?
)