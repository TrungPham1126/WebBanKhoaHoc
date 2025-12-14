package com.soa.payment_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WalletTransactionDTO {
    private Long id;
    private BigDecimal amount;
    private String description;
    private String type; // Trả về String cho an toàn (INCOME/WITHDRAWAL)
    private LocalDateTime createdAt;

    public WalletTransactionDTO() {
    }

    public WalletTransactionDTO(Long id, BigDecimal amount, String description, String type, LocalDateTime createdAt) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.type = type;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

}