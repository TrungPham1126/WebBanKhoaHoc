package com.soa.payment_service.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WalletDTO {
    private Long id;
    private BigDecimal balance;
    private Long userId;
    private LocalDateTime updatedAt;

    public WalletDTO(Long id, BigDecimal balance, Long userId, LocalDateTime updatedAt) {
        this.id = id;
        this.balance = balance;
        this.userId = userId;
        this.updatedAt = updatedAt;
    }

    public WalletDTO() {
    }

    public Long getId() {

        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getBalance() {
        return balance;
    }

    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

}