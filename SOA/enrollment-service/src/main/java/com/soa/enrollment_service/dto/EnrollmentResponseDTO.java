package com.soa.enrollment_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EnrollmentResponseDTO {
    private Long id;
    private String studentEmail;
    private Long courseId;
    private String courseTitle;
    private LocalDateTime enrolledAt;
}