package cn.arorms.blog.backend.dto.requests

/**
 * Request object for password change
 */
data class PasswordChangeRequest(
    val currentPassword: String,
    val newPassword: String
)
