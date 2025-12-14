package com.soa.enrollment_service.controller;

import com.soa.enrollment_service.dto.EnrollmentRequestDTO;
import com.soa.enrollment_service.service.EnrollmentService;
// Đảm bảo bạn đã copy class UserPrincipal vào project enrollment-service
import com.soa.enrollment_service.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<?> enroll(
            @RequestBody EnrollmentRequestDTO request,
            Authentication authentication) {

        // 1. Lấy User ID từ Token (Authentication)
        Long userId = null;
        if (authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            userId = userPrincipal.getId();
        }

        // 2. Gọi hàm createEnrollment (Thay thế hàm enrollCourse cũ)
        // Lưu ý: RequestDTO cần phải có đủ các trường này
        enrollmentService.createEnrollment(
                userId,
                authentication.getName(), // Email
                request.getCourseId(),
                request.getTeacherId(),
                request.getCourseTitle(),
                request.getAmount() != null ? request.getAmount() : 0.0, // Mặc định 0 nếu null
                request.getImageUrl());

        return ResponseEntity.ok("Đăng ký thành công!");
    }

    @GetMapping("/my-courses")
    public ResponseEntity<?> getMyCourses(Authentication authentication) {
        // Hàm này đã đổi tên trong Interface thành getMyEnrollments
        return ResponseEntity.ok(enrollmentService.getMyEnrollments(authentication.getName()));
    }
}