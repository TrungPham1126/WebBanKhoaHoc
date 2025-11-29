package com.soa.payment_service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "transaction_history")

public class TransactionHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String transactionId; // Mã GD VNPAY
    private Long courseId;
    private String courseTitle;
    private String studentEmail; // Người mua
    private String teacherEmail; // Người bán

    private BigDecimal totalAmount; // Tổng tiền (VD: 1.000.000)
    private BigDecimal adminCommission; // 40% (400.000)
    private BigDecimal teacherReceived; // 60% (600.000)

    private LocalDateTime createdAt;
    

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


    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}