package cn.arorms.blog.backend.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

/**
 * Spring Security configuration
 */
@Configuration
@EnableWebSecurity
class SecurityConfig {
    
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .csrf { it.disable() }
            .cors { it.configurationSource(corsConfigurationSource()) }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests { auth ->
                // Public endpoints
                auth.requestMatchers("/api/articles/published").permitAll()
                auth.requestMatchers("/api/articles/slug/**").permitAll()
                auth.requestMatchers("/api/articles/{id}").permitAll()
                auth.requestMatchers("/api/articles/category/**").permitAll()
                auth.requestMatchers("/api/articles/tag/**").permitAll()
                auth.requestMatchers("/api/articles/search").permitAll()
                auth.requestMatchers("/api/articles/popular").permitAll()
                auth.requestMatchers("/api/tags").permitAll()
                auth.requestMatchers("/api/tags/{id}").permitAll()
                auth.requestMatchers("/api/tags/slug/**").permitAll()
                auth.requestMatchers("/api/categories").permitAll()
                auth.requestMatchers("/api/categories/{id}").permitAll()
                auth.requestMatchers("/api/categories/slug/**").permitAll()
                auth.requestMatchers("/api/categories/roots").permitAll()
                auth.requestMatchers("/api/categories/{id}/children").permitAll()
                auth.requestMatchers("/api/images/files/**").permitAll()
                
                // Static resources
                auth.requestMatchers("/uploads/**").permitAll()
                auth.requestMatchers("/static/**").permitAll()
                
                // H2 console (for development)
                auth.requestMatchers("/h2-console/**").permitAll()
                
                // Actuator endpoints
                auth.requestMatchers("/actuator/**").permitAll()
                
                // All other requests require authentication
                auth.anyRequest().authenticated()
            }
            .headers { headers ->
                headers.frameOptions { it.disable() } // For H2 console
            }
        
        return http.build()
    }
    
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }
    
    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        configuration.allowedOrigins = listOf("http://localhost:5173", "http://localhost:3000")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        configuration.maxAge = 3600L
        
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/api/**", configuration)
        return source
    }
}