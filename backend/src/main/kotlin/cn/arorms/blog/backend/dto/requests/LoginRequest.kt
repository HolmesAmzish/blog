package cn.arorms.blog.backend.dto.requests

/**
 * DTO for login request
 */
data class LoginRequest(
    val username: String,
    val password: String
)