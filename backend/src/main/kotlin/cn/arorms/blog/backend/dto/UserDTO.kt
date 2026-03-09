package cn.arorms.blog.backend.dto

import cn.arorms.blog.backend.enums.UserRole

/**
 * Data Transfer Object for User
 */
data class UserDTO(
    val id: Long?,
    val username: String,
    val email: String,
    val displayName: String?,
    val bio: String?,
    val avatar: String?,
    val role: UserRole,
    val isEnabled: Boolean,
    val createdAt: String?
)

/**
 * Request object for creating/updating a user
 */
data class UserRequest(
    val username: String,
    val email: String,
    val password: String?,
    val displayName: String?,
    val bio: String?,
    val avatar: String?,
    val role: UserRole = UserRole.GUEST
)

/**
 * Request object for password change
 */
data class PasswordChangeRequest(
    val currentPassword: String,
    val newPassword: String
)

/**
 * Request object for login
 */
data class LoginRequest(
    val username: String,
    val password: String
)

/**
 * Response object for login
 */
data class LoginResponse(
    val token: String,
    val user: UserDTO
)