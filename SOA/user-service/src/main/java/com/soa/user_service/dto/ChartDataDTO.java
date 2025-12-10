package com.soa.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// DTO này giúp hứng dữ liệu từ câu query GROUP BY
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ChartDataDTO {
    private String label; // Ví dụ: "Tháng 1", "Tháng 2" hoặc "VIP", "NORMAL"
    private Long value; // Giá trị: Tổng tiền hoặc Số lượng
}