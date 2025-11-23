package com.soa.payment_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EnrollmentMessage {
    private Long courseId;
    private String courseTitle;
    private String studentEmail;
}