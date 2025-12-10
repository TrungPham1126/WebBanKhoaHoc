package com.soa.payment_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_history")
@Data // Lombok tự sinh Getter/Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransactionHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Tự động tăng ID (Quan trọng)
    private Long id;

    @Column(name = "transaction_id")
    private String transactionId; // Mã giao dịch VNPAY (vnp_TxnRef)

    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "course_title")
    private String courseTitle;

    @Column(name = "student_email")
    private String studentEmail;

    @Column(name = "teacher_email")
    private String teacherEmail;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "admin_commission")
    private BigDecimal adminCommission; // Tiền Admin nhận

    @Column(name = "teacher_received")
    private BigDecimal teacherReceived; // Tiền Giáo viên nhận

    @CreationTimestamp // Tự động lấy giờ hiện tại khi lưu vào DB (Fix lỗi thiếu ngày tháng)
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}