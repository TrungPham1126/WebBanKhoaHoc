package com.soa.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "transaction_history")
@Data
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

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}