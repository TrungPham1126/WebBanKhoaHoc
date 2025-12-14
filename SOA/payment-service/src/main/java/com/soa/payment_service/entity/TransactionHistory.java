package com.soa.payment_service.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_history")
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id")
    private String transactionId; // Mã giao dịch VNPAY (vnp_TxnRef)

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "course_title")
    private String courseTitle;

    // --- THÊM TRƯỜNG ID NGƯỜI DÙNG (QUAN TRỌNG CHO VÍ) ---
    @Column(name = "student_id")
    private Long studentId;

    @Column(name = "teacher_id")
    private Long teacherId;
    // -----------------------------------------------------

    @Column(name = "student_email")
    private String studentEmail;

    @Column(name = "teacher_email")
    private String teacherEmail;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "admin_commission")
    private BigDecimal adminCommission; // Tiền Admin nhận (40%)

    @Column(name = "teacher_received")
    private BigDecimal teacherReceived; // Tiền Giáo viên nhận (60%)

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // --- CONSTRUCTORS (Bắt buộc khi bỏ Lombok) ---
    public TransactionHistory() {
    }

    // --- GETTERS & SETTERS (Thủ công) ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public String getTeacherEmail() {
        return teacherEmail;
    }

    public void setTeacherEmail(String teacherEmail) {
        this.teacherEmail = teacherEmail;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getAdminCommission() {
        return adminCommission;
    }

    public void setAdminCommission(BigDecimal adminCommission) {
        this.adminCommission = adminCommission;
    }

    public BigDecimal getTeacherReceived() {
        return teacherReceived;
    }

    public void setTeacherReceived(BigDecimal teacherReceived) {
        this.teacherReceived = teacherReceived;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}