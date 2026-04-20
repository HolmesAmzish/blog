package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dtos.LoginRequest
import cn.arorms.blog.backend.dtos.LoginResponse
import cn.arorms.blog.backend.dtos.RegisterRequest
import cn.arorms.blog.backend.dtos.RegisterResponse
import cn.arorms.blog.backend.dtos.UserDTO
import cn.arorms.blog.backend.entities.User
import cn.arorms.blog.backend.services.JwtService
import cn.arorms.blog.backend.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * REST Controller for Authentication operations
 */
@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val userService: UserService,
    private val jwtService: JwtService,
    private val authenticationManager: AuthenticationManager
) {
    
    /**
     * Register a new user
     */
    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<RegisterResponse> {
        
        userService.create(request)
        
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(RegisterResponse("User registered successfully", request.username))
    }
    
    /**
     * Login and get JWT token
     */
    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {
        val authentication = authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.username, request.password)
        )
        
        val token = jwtService.generateToken(authentication)
        
        return ResponseEntity.ok(LoginResponse(accessToken = token))
    }
    
    /**
     * Get current authenticated user info
     */
    @GetMapping("/me")
    fun getCurrentUser(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<UserDTO> {
        val username = jwt.subject

        val user = userService.findByUsername(username)
            ?: return ResponseEntity.status(404).build()

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
