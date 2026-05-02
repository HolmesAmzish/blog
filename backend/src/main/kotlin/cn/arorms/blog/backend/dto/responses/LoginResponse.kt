package cn.arorms.blog.backend.dto.responses

/**
 * DTO for login response
 */
data class LoginResponse(
    val accessToken: String,
    val tokenType: String = "Bearer"
)