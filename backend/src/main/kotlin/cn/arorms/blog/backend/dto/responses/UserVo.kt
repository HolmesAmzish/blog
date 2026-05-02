package cn.arorms.blog.backend.dto.responses

import cn.arorms.blog.backend.enums.UserRole
import java.time.LocalDateTime

/**
 * Data Transfer Object for User
 */
data class UserVo(
    val id: Long?,
    val username: String,
    val email: String,
    val displayName: String?,
    val bio: String?,
    val avatar: String?,
    val role: UserRole,
    val isEnabled: Boolean,
    val createdAt: LocalDateTime,
)