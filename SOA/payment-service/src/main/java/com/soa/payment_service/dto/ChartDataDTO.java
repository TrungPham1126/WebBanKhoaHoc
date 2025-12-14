package com.soa.payment_service.dto;

import java.math.BigDecimal;

public class ChartDataDTO {
    private String label;
    private BigDecimal value;

    public ChartDataDTO() {
    }

    // Constructor cho SUM (Total Amount)
    public ChartDataDTO(String label, BigDecimal value) {
        this.label = label;
        this.value = value != null ? value : BigDecimal.ZERO;
    }

    // Constructor cho COUNT (Số lượng khóa học) - Hibernate trả về Long
    public ChartDataDTO(String label, Long value) {
        this.label = label;
        this.value = value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    // Fix lỗi Hibernate đôi khi trả về Object cho label
    public ChartDataDTO(Object label, BigDecimal value) {
        this.label = label != null ? label.toString() : "";
        this.value = value != null ? value : BigDecimal.ZERO;
    }

    public ChartDataDTO(Object label, Long value) {
        this.label = label != null ? label.toString() : "";
        this.value = value != null ? BigDecimal.valueOf(value) : BigDecimal.ZERO;
    }

    // --- Getters & Setters ---
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public BigDecimal getValue() {
        return value;
    }

    public void setValue(BigDecimal value) {
        this.value = value;
    }
}