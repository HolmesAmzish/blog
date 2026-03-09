package cn.arorms.blog.backend.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.*
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit

/**
 * Service for JWT token generation and validation
 */
@Service
class JwtService(
    private val encoder: JwtEncoder
) {
    
    @Value("\${application.security.jwt.expiration:86400000}")
    private var jwtExpiration: Long = 86400000
    
    /**
     * Generate JWT token for authenticated user
     */
    fun generateToken(authentication: Authentication): String {
        val now = Instant.now()
        val jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build()
        val claims = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(now.plus(jwtExpiration, ChronoUnit.MILLIS))
            .subject(authentication.name)
            .build()
        return encoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).tokenValue
    }
}