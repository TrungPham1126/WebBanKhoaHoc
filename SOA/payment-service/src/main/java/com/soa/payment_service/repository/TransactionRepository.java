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

    List<TransactionHistory> findByTeacherEmail(String teacherEmail);

    List<TransactionHistory> findByStudentEmail(String studentEmail);

    // --- THỐNG KÊ (DASHBOARD) ---

    /**
     * Lấy tổng doanh thu nhóm theo tháng/năm.
     * Sử dụng cho biểu đồ tổng quan/lịch sử.
     * Lưu ý: Cần đảm bảo ChartDataDTO có constructor (String, BigDecimal) để hứng
     * SUM.
     */
    @Query("SELECT new com.soa.payment_service.dto.ChartDataDTO(" +
            "FUNCTION('DATE_FORMAT', t.createdAt, '%Y-%m'), SUM(t.totalAmount)) " +
            "FROM TransactionHistory t " +
            "GROUP BY FUNCTION('DATE_FORMAT', t.createdAt, '%Y-%m') " +
            "ORDER BY FUNCTION('DATE_FORMAT', t.createdAt, '%Y-%m') ASC")
    List<ChartDataDTO> getMonthlyRevenue();

    /**
     * Lấy tổng doanh thu nhóm theo ngày.
     * Dùng cho Line Chart hiển thị chi tiết biến động doanh thu theo ngày trong
     * tháng/tuần.
     */
    @Query("SELECT new com.soa.payment_service.dto.ChartDataDTO(" +
            "FUNCTION('DATE_FORMAT', t.createdAt, '%d/%m'), SUM(t.totalAmount)) " +
            "FROM TransactionHistory t " +
            // Group by cả format display (%d/%m) và giá trị date thật để sắp xếp đúng thứ
            // tự
            "GROUP BY FUNCTION('DATE_FORMAT', t.createdAt, '%d/%m'), FUNCTION('DATE', t.createdAt) " +
            "ORDER BY FUNCTION('DATE', t.createdAt) ASC")
    List<ChartDataDTO> getDailyRevenue();

    /**
     * Lấy Top 5 khóa học bán chạy nhất (tính theo số lượng giao dịch).
     * Dùng cho Doughnut Chart (Biểu đồ tròn).
     * Lưu ý: Query này trả về COUNT (Long), ChartDataDTO cần có constructor
     * (String, Long).
     */
    @Query("SELECT new com.soa.payment_service.dto.ChartDataDTO(" +
            "t.courseTitle, COUNT(t.id)) " +
            "FROM TransactionHistory t " +
            "GROUP BY t.courseTitle " +
            "ORDER BY COUNT(t.id) DESC")
    List<ChartDataDTO> getTopSellingCourses();

    /**
     * Lấy 5 giao dịch gần nhất, sắp xếp theo thời gian tạo giảm dần.
     * Dùng cho bảng "Recent Transactions" trong Dashboard.
     */
    List<TransactionHistory> findTop5ByOrderByCreatedAtDesc();
}