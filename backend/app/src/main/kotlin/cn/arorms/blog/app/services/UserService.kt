package cn.arorms.blog.app.services

import cn.arorms.blog.app.repositories.UserRepository
import cn.arorms.blog.app.entities.UserProfile
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Service class for User operations
 * Implements UserDetailsService for Spring Security authentication
 */
@Service
class UserService(
    private val userRepository: UserRepository
){
    
    /**
     * Load user by username for Spring Security authentication
     */
//    override fun loadUserByUsername(username: String): UserDetails {
//        val user = userRepository.findByUsername(username)
//            ?: throw UsernameNotFoundException("User not found with username: $username")
//
//        return org.springframework.security.core.userdetails.User.builder()
//            .username(user.username)
//            .password(user.password)
//            .authorities(user.role.name)
//            .accountLocked(!user.isEnabled)
//            .build()
//    }
    
    fun findAll(): List<UserProfile> {
        return userRepository.findAll()
    }
    
    fun findById(id: Long): UserProfile? {
        return userRepository.findById(id).orElse(null)
    }
    
    fun findByUsername(username: String): UserProfile? {
        return userRepository.findByUsername(username)
            ?: throw UsernameNotFoundException("User not found with username: $username")
    }
    
    fun findByEmail(email: String): UserProfile? {
        return userRepository.findByEmail(email)
    }
    
//    @Transactional
//    fun create(request: RegisterRequest): UserProfile {
//        if (userRepository.existsByUsername(request.username)) {
//            throw IllegalArgumentException("Username '${request.username}' already exists")
//        }
//        if (userRepository.existsByEmail(request.email)) {
//            throw IllegalArgumentException("Email '${request.email}' already exists")
//        }
//
//        // Encode password before saving
//        val encodedPassword = passwordEncoder.encode(request.password)
//
//        val newUser = UserProfile(
//            username = request.username,
//            email = request.email,
//            password = encodedPassword!!,
//            displayName = request.displayName,
//            role = UserRole.USER,
//        )
//
//        return userRepository.save(newUser)
//    }
    
    @Transactional
    fun update(id: Long, user: UserProfile): UserProfile {
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
//        existingUser.displayName = user.displayName
//        existingUser.bio = user.bio
//        existingUser.avatar = user.avatar
//        existingUser.role = user.role
//        existingUser.isEnabled = user.isEnabled
        
        return userRepository.save(existingUser)
    }
    
//    @Transactional
//    fun updatePassword(id: Long, currentPassword: String, newPassword: String): Boolean {
//        val user = userRepository.findById(id)
//            .orElseThrow { IllegalArgumentException("User not found with id: $id") }
//
//        if (!passwordEncoder.matches(currentPassword, user.password)) {
//            throw IllegalArgumentException("Current password is incorrect")
//        }
//
//        val encodedNewPassword = passwordEncoder.encode(newPassword)
//        user.password = encodedNewPassword!!
//        userRepository.save(user)
//        return true
//    }
    
//    @Transactional
//    fun delete(id: Long) {
//        if (!userRepository.existsById(id)) {
//            throw IllegalArgumentException("User not found with id: $id")
//        }
//        userRepository.deleteById(id)
//    }
//
//    @Transactional
//    fun updateRole(id: Long, role: UserRole): UserProfile {
//        val user = userRepository.findById(id)
//            .orElseThrow { IllegalArgumentException("User not found with id: $id") }
//        user.role = role
//        return userRepository.save(user)
//    }
//
//    @Transactional
//    fun enableUser(id: Long, enabled: Boolean): UserProfile {
//        val user = userRepository.findById(id)
//            .orElseThrow { IllegalArgumentException("User not found with id: $id") }
//        user.isEnabled = enabled
//        return userRepository.save(user)
//    }
}