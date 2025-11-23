package com.soa.course_service.dto;

import com.soa.course_service.entity.ExerciseType;
import lombok.Data;

@Data
public class ExerciseRequestDTO {
    private String title;
    private String description;
    private ExerciseType type;
    private Boolean isFree;
    private Long videoId;
}