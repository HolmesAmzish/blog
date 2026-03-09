package cn.arorms.blog.backend.entities

import cn.arorms.blog.backend.enums.UserRole
import jakarta.persistence.*
import java.time.LocalDateTime

/**
 * User entity for authentication and authorization
 */
@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null,

    @Column(nullable = false, unique = true, length = 50)
    var username: String,

    @Column(nullable = false, unique = true, length = 100)
    var email: String,

    @Column(nullable = false)
    var password: String,

    @Column(length = 100)
    var displayName: String? = null,

    @Column(length = 500)
    var bio: String? = null,

    @Column(length = 500)
    var avatar: String? = null, // URL to avatar image

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    var role: UserRole = UserRole.GUEST,

    @Column(name = "is_enabled")
    var isEnabled: Boolean = true,

    @Column(name = "created_at")
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @OneToMany(mappedBy = "author")
    var articles: MutableSet<Article> = mutableSetOf()
) {
    @PreUpdate
    fun onUpdate() {
        updatedAt = LocalDateTime.now()
    }
}