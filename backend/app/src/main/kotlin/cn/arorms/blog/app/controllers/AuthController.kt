package cn.arorms.blog.app.controllers

import cn.arorms.framework.common.domain.ApiResponse
import cn.arorms.framework.security.User
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthController {
    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal user: User): ApiResponse<String>{
        return ApiResponse.ok(user.toString())
    }
}