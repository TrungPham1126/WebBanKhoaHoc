package com.soa.enrollment_service.controller;

import com.soa.enrollment_service.dto.EnrollmentRequestDTO;
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

        // --- THÊM LOG DEBUG ---
        System.out.println(">>> [DEBUG] Internal Enroll Request received!");
        System.out.println(">>> [DEBUG] Secret Key received: " + secretKey);
        System.out.println(">>> [DEBUG] Expected Key: " + INTERNAL_SECRET);
        // ---------------------

        // 1. Kiểm tra bảo mật
        if (secretKey == null || !secretKey.equals(INTERNAL_SECRET)) {
            System.err.println("!!! [ENROLLMENT] Từ chối truy cập: Sai Secret Key !!!");
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Forbidden: Invalid Secret Key");
        }

        System.out.println(">>> [ENROLLMENT] Nhận yêu cầu kích hoạt cho user: " + request.getStudentEmail());

        // 2. Chuyển đổi dữ liệu
        EnrollmentRequestDTO dto = new EnrollmentRequestDTO();
        dto.setCourseId(request.getCourseId());
        dto.setCourseTitle(request.getCourseTitle());
        dto.setImageUrl(request.getImageUrl());

        // 3. Gọi service lưu DB
        enrollmentService.enrollCourse(dto, request.getStudentEmail());
    }
}