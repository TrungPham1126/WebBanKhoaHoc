package com.soa.payment_service.repository;

import com.soa.payment_service.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    // Sắp xếp giảm dần theo ngày tạo để hiện giao dịch mới nhất lên đầu
    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);
}