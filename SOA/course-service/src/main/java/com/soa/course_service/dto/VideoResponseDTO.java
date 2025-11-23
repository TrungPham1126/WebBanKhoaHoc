package com.soa.course_service.dto;

import lombok.Data;

@Data
public class VideoResponseDTO {
    private Long id;
    private String title;
    private String videoUrl;
    private Integer durationInSeconds;
    private Long courseId;
    private String status;
}