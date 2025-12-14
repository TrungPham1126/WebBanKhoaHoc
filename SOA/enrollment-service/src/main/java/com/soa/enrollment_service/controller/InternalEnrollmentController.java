package com.soa.enrollment_service.controller;

import com.soa.enrollment_service.dto.InternalEnrollRequest;
import com.soa.enrollment_service.service.EnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/enrollments/internal")
public class InternalEnrollmentController {

    private final EnrollmentService enrollmentService;
    private static final String INTERNAL_SECRET = "Ba0MatN0iBo_123456";

    public InternalEnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/enroll")
    public void enrollInternal(
            @RequestBody InternalEnrollRequest request,
            @RequestHeader(value = "X-Internal-Secret", required = false) String secretKey) {

        // --- LOG DEBUG ---
        System.out.println(">>> [DEBUG] Internal Enroll Request received!");
        // -----------------

        // 1. Kiểm tra bảo mật
        if (secretKey == null || !secretKey.equals(INTERNAL_SECRET)) {
            System.err.println("!!! [ENROLLMENT] Từ chối truy cập: Sai Secret Key !!!");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: Invalid Secret Key");
        }

        System.out.println(">>> [ENROLLMENT] Nhận yêu cầu kích hoạt cho user: " + request.getStudentEmail());

        // 2. Thiết lập dữ liệu mặc định để tránh lỗi Database (NOT NULL)
        Long userId = 0L; // ID giả định cho Admin/System
        Double amount = 0.0; // Giá tiền 0đ

        // Lấy teacherId từ request (nếu có) hoặc để null
        Long teacherId = request.getTeacherId() != null ? request.getTeacherId() : null;

        // 3. Gọi service với hàm mới (Full tham số)
        enrollmentService.createEnrollment(
                userId,
                request.getStudentEmail(),
                request.getCourseId(),
                teacherId,
                request.getCourseTitle(),
                amount,
                request.getImageUrl());

        System.out.println(">>> [ENROLLMENT] Kích hoạt thành công!");
    }
}