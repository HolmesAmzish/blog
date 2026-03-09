package cn.arorms.blog.backend.services

import cn.arorms.blog.backend.entities.User
import cn.arorms.blog.backend.enums.UserRole
import cn.arorms.blog.backend.repositories.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Service class for User operations
 */
@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    
    fun findAll(): List<User> {
        return userRepository.findAll()
    }
    
    fun findById(id: Long): User? {
        return userRepository.findById(id).orElse(null)
    }
    
    fun findByUsername(username: String): User? {
        return userRepository.findByUsername(username)
    }
    
    fun findByEmail(email: String): User? {
        return userRepository.findByEmail(email)
    }
    
    @Transactional
    fun create(user: User): User {
        if (userRepository.existsByUsername(user.username)) {
            throw IllegalArgumentException("Username '${user.username}' already exists")
        }
        if (userRepository.existsByEmail(user.email)) {
            throw IllegalArgumentException("Email '${user.email}' already exists")
        }
        
        // Encode password before saving
        user.password = passwordEncoder.encode(user.password ?: throw IllegalArgumentException("Password is required"))!!
        
        return userRepository.save(user)
    }
    
    @Transactional
    fun update(id: Long, user: User): User {
        val existingUser = userRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User not found with id: $id") }
        
        if (user.username != existingUser.username && userRepository.existsByUsername(user.username)) {
            throw IllegalArgumentException("Username '${user.username}' already exists")
        }
        if (user.email != existingUser.email && userRepository.existsByEmail(user.email)) {
            throw IllegalArgumentException("Email '${user.email}' already exists")
        }
        
        existingUser.username = user.username
        existingUser.email = user.email
        existingUser.displayName = user.displayName
        existingUser.bio = user.bio
        existingUser.avatar = user.avatar
        existingUser.role = user.role
        existingUser.isEnabled = user.isEnabled
        
        return userRepository.save(existingUser)
    }
    
    @Transactional
    fun updatePassword(id: Long, currentPassword: String, newPassword: String): Boolean {
        val user = userRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User not found with id: $id") }
        
        if (!passwordEncoder.matches(currentPassword, user.password)) {
            throw IllegalArgumentException("Current password is incorrect")
        }
        
        user.password = passwordEncoder.encode(newPassword)!!
        userRepository.save(user)
        return true
    }
    
    @Transactional
    fun delete(id: Long) {
        if (!userRepository.existsById(id)) {
            throw IllegalArgumentException("User not found with id: $id")
        }
        userRepository.deleteById(id)
    }
    
    @Transactional
    fun updateRole(id: Long, role: UserRole): User {
        val user = userRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User not found with id: $id") }
        user.role = role
        return userRepository.save(user)
    }
    
    @Transactional
    fun enableUser(id: Long, enabled: Boolean): User {
        val user = userRepository.findById(id)
            .orElseThrow { IllegalArgumentException("User not found with id: $id") }
        user.isEnabled = enabled
        return userRepository.save(user)
    }
}