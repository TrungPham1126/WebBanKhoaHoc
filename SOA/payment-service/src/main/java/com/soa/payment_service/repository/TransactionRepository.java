package com.soa.payment_service.repository;

import com.soa.payment_service.entity.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<TransactionHistory, Long> {

    TransactionHistory findByTransactionId(String transactionId);

    List<TransactionHistory> findByTeacherEmail(String teacherEmail);

    List<TransactionHistory> findByStudentEmail(String studentEmail);
}