package com.soa.course_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
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

    private String title;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    private BigDecimal price;
    private String imageUrl;

    // --- THAY ĐỔI QUAN TRỌNG: Lưu email giáo viên ---
    @Column(name = "teacher_email")
    private String teacherEmail;

    // Cascade ALL để xóa Course thì xóa luôn Section, Video
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL)
    private List<Section> sections = new ArrayList<>();
}