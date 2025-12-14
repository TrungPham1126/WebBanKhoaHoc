package com.soa.enrollment_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 THÊM LẠI DÒNG NÀY ĐỂ KHỚP VỚI DATABASE
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "student_email", nullable = false)
    private String studentEmail;

    @Column(name = "course_id", nullable = false)
    private Long courseId;

    @Column(name = "teacher_id")
    private Long teacherId;

    @Column(name = "course_title")
    private String courseTitle;

    // 🔥 THÊM LẠI AMOUNT (để lưu giá tiền lúc mua)
    @Column(name = "amount")
    private Double amount;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private LocalDateTime enrolledAt;

    // --- Constructors ---
    public Enrollment() {
    }

    // --- Getters & Setters (Bổ sung cho userId và amount) ---
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    // ... (Giữ nguyên các getter/setter khác: getId, getStudentEmail, getCourseId,
    // v.v.)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }

    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }

    @PrePersist
    protected void onCreate() {
        this.enrolledAt = LocalDateTime.now();
    }
}