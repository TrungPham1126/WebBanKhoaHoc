package com.soa.enrollment_service.config;

import com.soa.enrollment_service.util.AuthTokenFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Import thêm cái này
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, AuthTokenFilter authTokenFilter)
            throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Cho phép Swagger
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()

                        // 2. [FIX] Mở quyền cho API nội bộ
                        // Thêm HttpMethod.POST để chắc chắn cho phép method này
                        .requestMatchers(HttpMethod.POST, "/api/v1/enrollments/internal/**").permitAll()
                        .requestMatchers("/api/v1/enrollments/internal/**").permitAll() // Giữ lại dòng này cho chắc

                        // 3. Các API khác bắt buộc đăng nhập
                        .anyRequest().authenticated());

        http.addFilterBefore(authTokenFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}