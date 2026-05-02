package cn.arorms.blog.backend.dto.requests

import cn.arorms.blog.backend.enums.Language

/**
 * Request object for creating/updating a category
 */
data class CategoryUpsertRequest(
    val names: Map<Language, String>,
    val slug: String,
    val parentId: Long?
)