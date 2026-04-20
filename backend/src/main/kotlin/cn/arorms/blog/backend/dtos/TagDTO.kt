package cn.arorms.blog.backend.dtos

/**
 * Data Transfer Object for Tag
 */
data class TagDTO(
    val id: Long?,
    val name: String,
    val description: String?,
    val slug: String,
    val articleCount: Long?
)

/**
 * Request object for creating/updating a tag
 */
data class TagRequest(
    val name: String,
    val description: String?,
    val slug: String
)