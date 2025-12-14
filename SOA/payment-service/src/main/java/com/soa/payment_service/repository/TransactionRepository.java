package com.soa.payment_service.repository;

import com.soa.payment_service.dto.ChartDataDTO;
import com.soa.payment_service.entity.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionHistory, Long> {

        // --- CRUD mặc định ---
        TransactionHistory findByTransactionId(String transactionId);

        // ✅ NÊN THÊM: Tìm theo ID (Nhanh & Chuẩn hơn Email)
        List<TransactionHistory> findByTeacherId(Long teacherId);

        List<TransactionHistory> findByStudentId(Long studentId);

        // Giữ lại tìm theo Email nếu cần (để tương thích code cũ)
        List<TransactionHistory> findByTeacherEmail(String teacherEmail);

        List<TransactionHistory> findByStudentEmail(String studentEmail);

        // --- THỐNG KÊ (DASHBOARD ADMIN) ---

        /**
         * Lấy tổng doanh thu nhóm theo tháng/năm.
         */
        @Query("SELECT new com.soa.payment_service.dto.ChartDataDTO(" +
                        "FUNCTION('DATE_FORMAT', t.createdAt, '%Y-%m'), SUM(t.totalAmount)) " +
                        "FROM TransactionHistory t " +
                        "GROUP BY FUNCTION('DATE_FORMAT', t.createdAt, '%Y-%m') " +
                        "ORDER BY FUNCTION('DATE_FORMAT', t.createdAt, '%Y-%m') ASC")
        List<ChartDataDTO> getMonthlyRevenue();

        /**
         * Lấy tổng doanh thu nhóm theo ngày.
         */
        @Query("SELECT new com.soa.payment_service.dto.ChartDataDTO(" +
                        "FUNCTION('DATE_FORMAT', t.createdAt, '%d/%m'), SUM(t.totalAmount)) " +
                        "FROM TransactionHistory t " +
                        "GROUP BY FUNCTION('DATE_FORMAT', t.createdAt, '%d/%m'), FUNCTION('DATE', t.createdAt) " +
                        "ORDER BY FUNCTION('DATE', t.createdAt) ASC")
        List<ChartDataDTO> getDailyRevenue();

        /**
         * Lấy Top 5 khóa học bán chạy nhất.
         */
        @Query("SELECT new com.soa.payment_service.dto.ChartDataDTO(" +
                        "t.courseTitle, COUNT(t.id)) " +
                        "FROM TransactionHistory t " +
                        "GROUP BY t.courseTitle " +
                        "ORDER BY COUNT(t.id) DESC")
        List<ChartDataDTO> getTopSellingCourses();

        /**
         * Lấy 5 giao dịch gần nhất.
         */
        List<TransactionHistory> findTop5ByOrderByCreatedAtDesc();
}