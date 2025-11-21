package com.soa.enrollment_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Thay vì User object, ta lưu email người học
    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    // Thay vì Course object, ta lưu ID khóa học
    @Column(name = "course_id", nullable = false)
    private Long courseId;

    // Có thể lưu thêm title để đỡ phải gọi sang Course Service lấy tên hiển thị
    @Column(name = "course_title")
    private String courseTitle;

    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
    }
}