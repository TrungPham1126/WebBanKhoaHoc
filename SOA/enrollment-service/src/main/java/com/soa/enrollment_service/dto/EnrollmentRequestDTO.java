package com.soa.enrollment_service.dto;

import lombok.Data;

@Data
public class EnrollmentRequestDTO {
    private Long courseId;

    // 🔥 CÁC TRƯỜNG MỚI CẦN THÊM ĐỂ KHỚP VỚI CONTROLLER
    private Long teacherId;
    private String courseTitle;
    private Double amount;
    private String imageUrl;
}