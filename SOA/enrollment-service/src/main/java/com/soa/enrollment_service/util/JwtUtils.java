package com.soa.enrollment_service.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.List;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    // Lấy secret từ file config (đã có trong enrollment-service.properties)
    @Value("${jwt.secret}")
    private String jwtSecret;

    private Key key() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // 1. Validate Token
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (Exception e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        }
        return false;
    }

    // 2. Lấy Email từ Token
    public String getEmailFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    public List<String> getRolesFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody();
        // Lấy claim "roles" đã được thêm vào từ user-service và cast sang List<String>
        return claims.get("roles", List.class);
    }
}