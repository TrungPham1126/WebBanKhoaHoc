package com.soa.enrollment_service.dto;

import lombok.Data;

@Data
public class EnrollmentRequestDTO {
    private Long courseId;
    private String courseTitle; // Gửi kèm tên khóa học để lưu luôn
}