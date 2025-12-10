package com.soa.payment_service.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class ChartDataDTO {
    private String label;
    private BigDecimal value; // Sử dụng BigDecimal để giữ độ chính xác tiền tệ

    // --- CÁC CONSTRUCTOR CẦN THIẾT CHO JPQL ---

    // 1. Constructor chuẩn cho SUM(t.totalAmount) - Label là String
    public ChartDataDTO(String label, BigDecimal value) {
        this.label = label;
        this.value = value != null ? value : BigDecimal.ZERO;
    }

    // 2. Constructor chuẩn cho COUNT(t.id) - Label là String
    public ChartDataDTO(String label, Long value) {
        this.label = label;
        this.value = value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    // 3. FIX LỖI HIBERNATE: Chấp nhận tham số đầu tiên là Object (String)
    // Dùng cho SUM(t.totalAmount) - Fix lỗi Cannot instantiate class...
    // [java.lang.Object, java.math.BigDecimal]
    public ChartDataDTO(Object label, BigDecimal value) {
        this.label = label != null ? label.toString() : "";
        this.value = value != null ? value : BigDecimal.ZERO;
    }

    // 4. FIX LỖI HIBERNATE: Chấp nhận tham số đầu tiên là Object (String)
    // Dùng cho COUNT(t.id) - Fix lỗi tương tự cho query Top Selling
    public ChartDataDTO(Object label, Long value) {
        this.label = label != null ? label.toString() : "";
        this.value = value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }
}