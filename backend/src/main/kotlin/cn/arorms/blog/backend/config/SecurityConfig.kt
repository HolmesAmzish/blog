package cn.arorms.blog.backend.config

import com.nimbusds.jose.jwk.JWKSet
import com.nimbusds.jose.jwk.OctetSequenceKey
import com.nimbusds.jose.jwk.source.ImmutableJWKSet
import com.nimbusds.jose.jwk.source.JWKSource
import com.nimbusds.jose.proc.SecurityContext
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import org.springframework.security.web.SecurityFilterChain
import javax.crypto.spec.SecretKeySpec

/**
 * Spring Security configuration for JWT authentication
 */
@Configuration
@EnableWebSecurity
class SecurityConfig {
    
    @Value("\${application.security.jwt.secret-key}")
    private lateinit var jwtKey: String
    
    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/auth/me").authenticated()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll()

                    // Public read-only endpoints for articles
                    .requestMatchers(HttpMethod.GET, "/api/articles").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/articles/published").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/articles/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/articles/slug/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/articles/category/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/articles/tag/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/articles/search").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/articles/popular").permitAll()

                    // Public read-only endpoints for categories
                    .requestMatchers(HttpMethod.GET, "/api/categories").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/categories/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/categories/slug/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/categories/roots").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/categories/*/children").permitAll()

                    // Public read-only endpoints for tags
                    .requestMatchers(HttpMethod.GET, "/api/tags").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/tags/*").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/tags/slug/*").permitAll()

                    .requestMatchers(HttpMethod.GET, "/api/statistics").permitAll()

                    // Public read-only endpoints for images
                    .requestMatchers(HttpMethod.GET, "/api/images/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/uploads/*").permitAll()
                    // All other requests require authentication
                    .anyRequest().authenticated()
//                    .anyRequest().permitAll()
            }
            .oauth2ResourceServer { oauth2 -> oauth2.jwt { } }
            .sessionManagement { session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .build()
    }
    
    @Bean
    @Throws(Exception::class)
    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {
        return config.authenticationManager
    }
    
    @Bean
    fun passwordEncoder(): PasswordEncoder {
        return BCryptPasswordEncoder()
    }

    @Bean
    @Throws(Exception::class)
    fun jwtEncoder(): JwtEncoder {
        val secretKey = SecretKeySpec(jwtKey.toByteArray(), "HmacSHA256")
        val jwk = OctetSequenceKey.Builder(secretKey).keyID("jwt-secret").build()
        val jwks: JWKSource<SecurityContext> = ImmutableJWKSet(JWKSet(jwk))
        return NimbusJwtEncoder(jwks)
    }

    @Bean
    @Throws(Exception::class)
    fun jwtDecoder(): JwtDecoder {
        val secretKey = SecretKeySpec(jwtKey.toByteArray(), "HmacSHA256")
        return NimbusJwtDecoder.withSecretKey(secretKey).build()
    }
}
