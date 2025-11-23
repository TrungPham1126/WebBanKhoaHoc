package com.soa.course_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LessonDTO {
    private Long id;
    private String title;
    private String type;
    private String duration;
    private String videoUrl;
    private String status;
    private boolean isCompleted;

    public LessonDTO(Long id, String title, String type, String duration, String videoUrl) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.duration = duration;
        this.videoUrl = videoUrl;
    }
}