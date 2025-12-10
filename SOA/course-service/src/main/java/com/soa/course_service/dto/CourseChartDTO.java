package com.soa.course_service.dto;

public class CourseChartDTO {
    private String label;
    private Long value;

    public CourseChartDTO(String label, Long value) {
        this.label = label;
        this.value = value;
    }

    // Getters, Setters
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Long getValue() {
        return value;
    }

    public void setValue(Long value) {
        this.value = value;
    }
}