package com.soa.course_service.config;

import com.soa.course_service.util.AuthTokenFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final AuthTokenFilter authTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 1️⃣ Tắt CSRF (JWT → Stateless)
                .csrf(csrf -> csrf.disable())

                // 2️⃣ BẬT CORS cho React
                .cors(Customizer.withDefaults())

                // 3️⃣ Stateless session
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4️⃣ Phân quyền
                .authorizeHttpRequests(auth -> auth

                        // ================== PUBLIC ==================

                        // 🔥 HLS STREAM (BẮT BUỘC PUBLIC)
                        .requestMatchers("/hls/**").permitAll()

                        // Ảnh tĩnh
                        .requestMatchers("/images/**").permitAll()

                        // Banner
                        .requestMatchers(HttpMethod.GET, "/api/v1/banners/**").permitAll()

                        // Xem khóa học
                        .requestMatchers(HttpMethod.GET, "/api/v1/courses/**").permitAll()

                        // API NỘI BỘ: TĂNG HỌC VIÊN (Cho phép Enrollment Service gọi)
                        .requestMatchers(HttpMethod.PUT, "/api/v1/courses/*/increment-student").permitAll()

                        // ================== AUTH REQUIRED ==================
                        .anyRequest().authenticated());

        // 5️⃣ JWT Filter
        http.addFilterBefore(
                authTokenFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}