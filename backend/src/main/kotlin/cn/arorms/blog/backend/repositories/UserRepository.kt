package cn.arorms.blog.backend.repositories

import cn.arorms.blog.backend.entities.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

/**
 * Repository interface for User entity
 */
@Repository
interface UserRepository : JpaRepository<User, Long> {
    
    fun findByUsername(username: String): User?
    
    fun findByEmail(email: String): User?
    
    fun existsByUsername(username: String): Boolean
    
    fun existsByEmail(email: String): Boolean
}