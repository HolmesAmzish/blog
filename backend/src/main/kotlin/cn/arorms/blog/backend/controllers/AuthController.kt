package cn.arorms.blog.backend.controllers

import cn.arorms.blog.backend.dto.LoginRequest
import cn.arorms.blog.backend.dto.LoginResponse
import cn.arorms.blog.backend.dto.RegisterRequest
import cn.arorms.blog.backend.dto.RegisterResponse
import cn.arorms.blog.backend.entities.User
import cn.arorms.blog.backend.enums.UserRole
import cn.arorms.blog.backend.services.JwtService
import cn.arorms.blog.backend.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
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
}