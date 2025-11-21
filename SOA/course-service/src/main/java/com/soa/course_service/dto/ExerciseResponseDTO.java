package com.soa.course_service.dto;

import com.soa.course_service.entity.ExerciseType;
import lombok.Data;

@Data
public class ExerciseResponseDTO {
    private Long id;
    private String title;
    private String description;
    private String questionUrl;
    private ExerciseType type;
    private Boolean isFree;
    private Long videoId;
    private Long courseId; // Để biết bài này của khóa nào (nếu có)
}