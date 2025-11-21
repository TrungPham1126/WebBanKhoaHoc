package com.soa.course_service.dto;

import com.soa.course_service.entity.ExerciseType;
import lombok.Data;

@Data
public class ExerciseRequestDTO {
    private String title;
    private String description;
    private ExerciseType type;
    private Boolean isFree;
    // ID của video nếu bài tập này thuộc về 1 video cụ thể
    private Long videoId;
}