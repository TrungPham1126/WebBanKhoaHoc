package com.soa.course_service.dto;

import java.util.List;
import java.util.ArrayList;

public class SectionDTO {
    private Long id;
    private String title;
    private List<LessonDTO> lessons = new ArrayList<>();

    public SectionDTO() {
    }

    public SectionDTO(Long id, String title, List<LessonDTO> lessons) {
        this.id = id;
        this.title = title;
        this.lessons = lessons;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<LessonDTO> getLessons() {
        return lessons;
    }

    public void setLessons(List<LessonDTO> lessons) {
        this.lessons = lessons;
    }
}