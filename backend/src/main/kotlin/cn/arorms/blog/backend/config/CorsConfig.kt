package cn.arorms.blog.backend.config

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * CorsConfig.kt
 * @author Cacciatore
 * @version 1.0 2026-03-12
 */
@Configuration
class CorsConfig : WebMvcConfigurer {
    override fun addCorsMappings(corsRegistry: CorsRegistry) {
        corsRegistry.addMapping("/**") // Apply to all endpoints
            .allowedOrigins("http://localhost:5173",
                "http://192.168.0.190:5173",
                "http://192.168.0.111:5173",
                "http://blog.arorms.cn")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600); // Cache the preflight response for 1 hour
    }
}