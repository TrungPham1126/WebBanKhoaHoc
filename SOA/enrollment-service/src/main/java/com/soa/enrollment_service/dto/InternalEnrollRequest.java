package com.soa.enrollment_service.dto;

import lombok.Data;

@Data
public class InternalEnrollRequest {

    private Long courseId;
    private String courseTitle;
    private String studentEmail;
    private String imageUrl;
}
