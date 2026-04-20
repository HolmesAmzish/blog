package cn.arorms.blog.backend.dtos

/**
 * Request object for creating a category
 */
data class CategoryCreateRequest(
    val name: String,
    val slug: String,
    val parentId: Long?
)