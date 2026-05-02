package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.requests.LoginRequest
import cn.arorms.blog.backend.dto.requests.RegisterRequest
import cn.arorms.blog.backend.dto.responses.LoginResponse
import cn.arorms.blog.backend.dto.responses.RegisterResponse
import cn.arorms.blog.backend.dto.responses.UserVo
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
    fun getCurrentUser(@AuthenticationPrincipal jwt: Jwt): ResponseEntity<UserVo> {
        val username = jwt.subject

        val user = userService.findByUsername(username)
            ?: return ResponseEntity.status(404).build()

        return ResponseEntity.ok(toUserVo(user))
    }

    fun toUserVo(user: User): UserVo {
        return UserVo(
            id = user.id,
            username = user.username,
            email = user.email,
            displayName = user.displayName,
            isEnabled = user.isEnabled,
            createdAt = user.createdAt,
            bio = user.bio,
            avatar = user.avatar,
            role = user.role,
        )
    }
}
