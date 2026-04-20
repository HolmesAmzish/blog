package cn.arorms.blog.backend.dtos;

data class CategoryDto (
    val id: Long?,
    val name: String,
    val slug: String,
    val parentId: Long?,
)
