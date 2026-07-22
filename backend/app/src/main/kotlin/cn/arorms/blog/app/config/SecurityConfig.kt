package cn.arorms.blog.app.config

import cn.arorms.framework.security.KeycloakAuthenticationConverter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

/**
 * Spring Security configuration for JWT authentication
 */
@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Bean
    fun keycloakAuthenticationConverter(): KeycloakAuthenticationConverter {
        return KeycloakAuthenticationConverter()
    }

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        return http
            .csrf { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    .requestMatchers("/api/auth/me").authenticated()
                    .requestMatchers("/api/llm/**").authenticated()
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/public/**").permitAll()

                    // Public read-only endpoints for articles
                    .requestMatchers(HttpMethod.GET, "/api/articles/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/tags/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/pictures/**").permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/statistics/**").permitAll()

//                    .requestMatchers(HttpMethod.GET, "/uploads/**").permitAll()
                    // All other requests require authentication
                    .anyRequest().authenticated()
//                    .anyRequest().permitAll()
            }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt { jwt ->
                    jwt.jwtAuthenticationConverter(keycloakAuthenticationConverter())
                }
            }
            .build()
    }
    
//    @Bean
//    @Throws(Exception::class)
//    fun authenticationManager(config: AuthenticationConfiguration): AuthenticationManager {
//        return config.authenticationManager
//    }
//
//    @Bean
//    fun passwordEncoder(): PasswordEncoder {
//        return BCryptPasswordEncoder()
//    }
//
//    @Bean
//    @Throws(Exception::class)
//    fun jwtEncoder(): JwtEncoder {
//        val secretKey = SecretKeySpec(jwtKey.toByteArray(), "HmacSHA256")
//        val jwk = OctetSequenceKey.Builder(secretKey).keyID("jwt-secret").build()
//        val jwks: JWKSource<SecurityContext> = ImmutableJWKSet(JWKSet(jwk))
//        return NimbusJwtEncoder(jwks)
//    }
//
//    @Bean
//    @Throws(Exception::class)
//    fun jwtDecoder(): JwtDecoder {
//        val secretKey = SecretKeySpec(jwtKey.toByteArray(), "HmacSHA256")
//        return NimbusJwtDecoder.withSecretKey(secretKey).build()
//    }
}
