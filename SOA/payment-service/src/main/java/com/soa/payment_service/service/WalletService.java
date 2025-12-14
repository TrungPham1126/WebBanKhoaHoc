package com.soa.payment_service.service;

import com.soa.payment_service.dto.WalletDTO;
import com.soa.payment_service.dto.WalletTransactionDTO;
import com.soa.payment_service.entity.Wallet;
import com.soa.payment_service.entity.WalletTransaction;
import com.soa.payment_service.entity.WithdrawalRequest;
import com.soa.payment_service.repository.WalletRepository;
import com.soa.payment_service.repository.WalletTransactionRepository;
import com.soa.payment_service.repository.WithdrawalRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository transactionRepository;

    @Autowired
    private WithdrawalRequestRepository withdrawalRequestRepository;

    // --- 1. LẤY THÔNG TIN VÍ (Trả về DTO) ---
    public WalletDTO getMyWallet(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Ví không tồn tại"));

        // Map Entity -> DTO
        return new WalletDTO(
                wallet.getId(),
                wallet.getBalance(),
                wallet.getUserId(),
                wallet.getUpdatedAt());
    }

    // --- 2. LẤY LỊCH SỬ GIAO DỊCH (Trả về List DTO) ---
    public List<WalletTransactionDTO> getMyHistory(Long userId) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Ví không tồn tại"));

        List<WalletTransaction> transactions = transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId());

        // Map List Entity -> List DTO (Cắt bỏ quan hệ Lazy với Wallet)
        return transactions.stream()
                .map(tx -> new WalletTransactionDTO(
                        tx.getId(),
                        tx.getAmount(),
                        tx.getDescription(),
                        tx.getType().toString(),
                        tx.getCreatedAt()))
                .collect(Collectors.toList());
    }

    // --- 3. YÊU CẦU RÚT TIỀN ---
    @Transactional
    public void requestWithdrawal(Long userId, BigDecimal amount, String bankInfo) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Ví không tồn tại"));

        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new RuntimeException("Số dư không đủ");
        }

        if (amount.compareTo(new BigDecimal("50000")) < 0) {
            throw new RuntimeException("Số tiền rút tối thiểu là 50.000 VNĐ");
        }

        // 1. Trừ tiền ví ngay lập tức (Pending)
        wallet.setBalance(wallet.getBalance().subtract(amount));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        // 2. Tạo giao dịch trừ tiền
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(amount.negate()); // Số âm
        transaction.setType(WalletTransaction.TransactionType.WITHDRAWAL);
        transaction.setDescription("Yêu cầu rút tiền về: " + bankInfo);
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);

        // 3. Tạo yêu cầu rút tiền
        WithdrawalRequest request = new WithdrawalRequest();
        request.setUserId(userId);
        request.setAmount(amount);
        request.setBankInfo(bankInfo);
        request.setStatus(WithdrawalRequest.WithdrawalStatus.PENDING);
        request.setCreatedAt(LocalDateTime.now());
        withdrawalRequestRepository.save(request);
    }

    // --- 4. XỬ LÝ DOANH THU (Khi có người mua khóa học) ---
    @Transactional
    public void processRevenueShare(Long teacherId, BigDecimal totalAmount, String courseTitle) {
        Wallet wallet = walletRepository.findByUserId(teacherId)
                .orElseGet(() -> {
                    // Nếu chưa có ví thì tạo mới
                    Wallet newWallet = new Wallet();
                    newWallet.setUserId(teacherId);
                    newWallet.setBalance(BigDecimal.ZERO);
                    newWallet.setUpdatedAt(LocalDateTime.now());
                    return walletRepository.save(newWallet);
                });

        // Tính doanh thu: Giả sử giáo viên nhận 60%
        BigDecimal teacherShare = totalAmount.multiply(new BigDecimal("0.60"));

        // Cộng tiền
        wallet.setBalance(wallet.getBalance().add(teacherShare));
        wallet.setUpdatedAt(LocalDateTime.now());
        walletRepository.save(wallet);

        // Lưu lịch sử
        WalletTransaction transaction = new WalletTransaction();
        transaction.setWallet(wallet);
        transaction.setAmount(teacherShare);
        transaction.setType(WalletTransaction.TransactionType.INCOME);
        transaction.setDescription("Doanh thu khóa học: " + courseTitle);
        transaction.setCreatedAt(LocalDateTime.now());
        transactionRepository.save(transaction);
    }

    // --- 5. ADMIN DUYỆT RÚT TIỀN (Optional) ---
    public void approveWithdrawal(Long requestId) {
        WithdrawalRequest request = withdrawalRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Yêu cầu không tồn tại"));

        request.setStatus(WithdrawalRequest.WithdrawalStatus.APPROVED);
        withdrawalRequestRepository.save(request);
    }
}