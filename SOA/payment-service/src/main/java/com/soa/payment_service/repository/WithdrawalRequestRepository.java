package com.soa.payment_service.repository;

import com.soa.payment_service.entity.WithdrawalRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WithdrawalRequestRepository extends JpaRepository<WithdrawalRequest, Long> {
    List<WithdrawalRequest> findByUserId(Long userId);

    List<WithdrawalRequest> findByStatus(WithdrawalRequest.WithdrawalStatus status);
}