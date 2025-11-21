// File: SOA/enrollment-service/src/main/java/com/soa/enrollment_service/util/AuthTokenFilter.java
package com.soa.enrollment_service.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// Thêm import cho Role (GrantedAuthority)
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
// Thêm các import cần thiết
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    // Cần thêm Logger nếu chưa có
    // private static final Logger logger =
    // LoggerFactory.getLogger(AuthTokenFilter.class); // (Bạn nên thêm)

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = parseJwt(request);
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                String email = jwtUtils.getEmailFromJwtToken(jwt);

                // --- THAY ĐỔI START ---
                // 1. Lấy danh sách Role từ Token (Ví dụ: ["ROLE_STUDENT", "ROLE_ADMIN"])
                List<String> roles = jwtUtils.getRolesFromJwtToken(jwt);

                // 2. Chuyển đổi sang định dạng Spring Security hiểu (Collection<? extends
                // GrantedAuthority>)
                List<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

                // 3. Tạo đối tượng Authentication (Sử dụng authorities đã trích xuất)
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        email, null, authorities);
                // --- THAY ĐỔI END ---

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Lưu thông tin user vào Context
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            // Nên sử dụng logger của slf4j nếu có
            // logger.error("Cannot set user authentication: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }
}