package cn.arorms.blog.backend.dto.requests

/**
 * DTO for register request
 */
data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val displayName: String? = null
)