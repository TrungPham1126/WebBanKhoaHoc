package com.soa.enrollment_service.dto;

import lombok.Data;

@Data
public class EnrollmentRequestDTO {
    private Long courseId;
    private String courseTitle;
    private String imageUrl; // Thêm trường này
}