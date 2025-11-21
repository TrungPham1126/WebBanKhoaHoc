package com.soa.course_service.dto;

public class LessonDTO {
    private Long id;
    private String title;
    private String type;
    private String duration;
    private String videoUrl;
    private boolean isCompleted;

    // Constructor
    public LessonDTO(Long id, String title, String type, String duration, String videoUrl) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.duration = duration;
        this.videoUrl = videoUrl;
        this.isCompleted = false;
    }

    // Getters & Setters...
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }

    public String getDuration() {
        return duration;
    }

    public String getVideoUrl() {
        return videoUrl;
    }
}