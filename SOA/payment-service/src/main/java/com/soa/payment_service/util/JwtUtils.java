package com.soa.payment_service.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SecurityException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets; // 🔥 Cần import thư viện này
import java.security.Key;
import java.util.List;

@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    /**
     * @comment SỬA LỖI 401: Thay đổi cách tạo Key.
     *          Vì secret key của bạn là plain text (văn bản thường), không phải
     *          chuỗi Base64,
     *          nên ta dùng getBytes(UTF_8) thay vì Decoders.BASE64.decode().
     */
    private Key key() {
        // 🔥 FIX QUAN TRỌNG: Lấy byte từ chuỗi UTF-8
        // Nếu dùng Decoders.BASE64.decode(jwtSecret) sẽ bị sai key -> Lỗi 401
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    // --- CÁC PHƯƠNG THỨC LẤY THÔNG TIN TỪ JWT ---

    public Long getUserIdFromJwtToken(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Lấy id từ claims (đảm bảo bên Course Service lúc tạo token đã put "id" vào)
            return claims.get("id", Long.class);
        } catch (Exception e) {
            logger.error("Error extracting User ID from Token: {}", e.getMessage());
            return null;
        }
    }

    public String getUserEmailFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key()).build()
                .parseClaimsJws(token).getBody();

        return claims.getSubject();
    }

    public List<String> getUserRolesFromJwtToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key()).build()
                .parseClaimsJws(token).getBody();

        return claims.get("roles", List.class);
    }

    // --- PHƯƠNG THỨC XÁC THỰC JWT ---

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
            return true;
        } catch (SecurityException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}