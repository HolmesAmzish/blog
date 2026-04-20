package cn.arorms.blog.backend.dtos

/**
 * DTO for login request
 */
data class LoginRequest(
    val username: String,
    val password: String
)

/**
 * DTO for register request
 */
data class RegisterRequest(
    val username: String,
    val email: String,
    val password: String,
    val displayName: String? = null
)

/**
 * DTO for login response
 */
data class LoginResponse(
    val accessToken: String,
    val tokenType: String = "Bearer"
)

/**
 * DTO for register response
 */
data class RegisterResponse(
    val message: String,
    val username: String
)