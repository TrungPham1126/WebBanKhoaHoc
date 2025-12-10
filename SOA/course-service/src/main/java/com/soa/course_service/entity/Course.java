package com.soa.course_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime; // Import thời gian
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer studentCount = 0;
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal price;
    private String imageUrl;

    @Column(name = "teacher_email")
    private String teacherEmail;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Section> sections = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private CourseStatus status = CourseStatus.PENDING;
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

}