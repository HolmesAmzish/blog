package cn.arorms.blog.app.repositories

import cn.arorms.blog.app.entities.UserProfile
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for User entity
 */
@Repository
interface UserRepository : JpaRepository<UserProfile, Long> {
    
    fun findByUsername(username: String): UserProfile?
    
    fun findByEmail(email: String): UserProfile?
    
    fun existsByUsername(username: String): Boolean
    
    fun existsByEmail(email: String): Boolean
}