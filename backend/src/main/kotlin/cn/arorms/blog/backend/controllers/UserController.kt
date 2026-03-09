package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.*
import cn.arorms.blog.backend.entities.User
import cn.arorms.blog.backend.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * REST Controller for User operations
 */
@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {
    
    @GetMapping
    fun getAllUsers(): ResponseEntity<List<UserDTO>> {
        val users = userService.findAll()
        return ResponseEntity.ok(users.map { it.toDTO() })
    }
    
    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): ResponseEntity<UserDTO> {
        val user = userService.findById(id)
        return if (user != null) {
            ResponseEntity.ok(user.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @GetMapping("/username/{username}")
    fun getUserByUsername(@PathVariable username: String): ResponseEntity<UserDTO> {
        val user = userService.findByUsername(username)
        return if (user != null) {
            ResponseEntity.ok(user.toDTO())
        } else {
            ResponseEntity.notFound().build()
        }
    }
    
    @PostMapping
    fun createUser(@RequestBody request: UserRequest): ResponseEntity<UserDTO> {
        val user = User(
            username = request.username,
            email = request.email,
            password = request.password ?: throw IllegalArgumentException("Password is required"),
            displayName = request.displayName,
            bio = request.bio,
            avatar = request.avatar,
            role = request.role
        )
        val savedUser = userService.create(user)
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser.toDTO())
    }
    
    @PutMapping("/{id}")
    fun updateUser(@PathVariable id: Long, @RequestBody request: UserRequest): ResponseEntity<UserDTO> {
        val user = User(
            username = request.username,
            email = request.email,
            password = request.password,
            displayName = request.displayName,
            bio = request.bio,
            avatar = request.avatar,
            role = request.role
        )
        val updatedUser = userService.update(id, user)
        return ResponseEntity.ok(updatedUser.toDTO())
    }
    
    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<Void> {
        userService.delete(id)
        return ResponseEntity.noContent().build()
    }
    
    @PutMapping("/{id}/password")
    fun changePassword(
        @PathVariable id: Long,
        @RequestBody request: PasswordChangeRequest
    ): ResponseEntity<Void> {
        userService.updatePassword(id, request.currentPassword, request.newPassword)
        return ResponseEntity.ok().build()
    }
    
    @PutMapping("/{id}/role")
    fun updateUserRole(@PathVariable id: Long, @RequestParam role: String?): ResponseEntity<UserDTO> {
        val roleValue = role ?: throw IllegalArgumentException("Role is required")
        val user = userService.updateRole(id, cn.arorms.blog.backend.enums.UserRole.valueOf(roleValue.uppercase()))
        return ResponseEntity.ok(user.toDTO())
    }
    
    @PutMapping("/{id}/enabled")
    fun setUserEnabled(@PathVariable id: Long, @RequestParam enabled: Boolean): ResponseEntity<UserDTO> {
        val user = userService.enableUser(id, enabled)
        return ResponseEntity.ok(user.toDTO())
    }
    
    // Extension function to convert User to UserDTO
    private fun User.toDTO(): UserDTO {
        return UserDTO(
            id = this.id,
            username = this.username,
            email = this.email,
            displayName = this.displayName,
            bio = this.bio,
            avatar = this.avatar,
            role = this.role,
            isEnabled = this.isEnabled,
            createdAt = this.createdAt.toString()
        )
    }
}