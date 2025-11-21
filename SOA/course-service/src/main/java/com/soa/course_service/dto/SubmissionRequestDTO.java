package com.soa.course_service.dto;

import lombok.Data;

@Data
public class SubmissionRequestDTO {
    private Long exerciseId;
    private String answerText;
}