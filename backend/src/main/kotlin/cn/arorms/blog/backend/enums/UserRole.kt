package cn.arorms.blog.backend.enums

/**
 * User roles for authorization
 */
enum class UserRole {
    ADMIN,      // Full access to all features
    PUBLISHER,     // Can create and edit articles
    GUEST      // Read-only access
}