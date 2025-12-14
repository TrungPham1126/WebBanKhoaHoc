package com.soa.enrollment_service.service;

import com.soa.enrollment_service.dto.EnrollmentResponseDTO;
import java.util.List;

public interface EnrollmentService {

    /**
     * Tạo đăng ký khóa học mới (Full tham số).
     * Hàm này dùng cho cả:
     * 1. Thanh toán thành công (VNPay/PayPal)
     * 2. Kích hoạt nội bộ (Internal Enroll)
     * 3. Đăng ký khóa học miễn phí
     */
    void createEnrollment(Long userId, String email, Long courseId, Long teacherId, String courseTitle, Double amount,
            String imageUrl);

    /**
     * Lấy danh sách các khóa học đã đăng ký của học viên.
     */
    List<EnrollmentResponseDTO> getMyEnrollments(String email);
}