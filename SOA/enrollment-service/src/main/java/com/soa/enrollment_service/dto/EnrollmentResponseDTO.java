package com.soa.enrollment_service.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EnrollmentResponseDTO {
    private Long id;

    // 🔥 MỚI THÊM: userId (Để biết ai đã mua)
    private Long userId;

    private String studentEmail;
    private Long courseId;

    // ID giáo viên (để thống kê doanh thu cho GV)
    private Long teacherId;

    private String courseTitle;

    // 🔥 NÊN CÓ: Giá tiền lúc mua (để hiển thị lịch sử giao dịch)
    private Double amount;

    private String imageUrl;
    private LocalDateTime enrolledAt;
}