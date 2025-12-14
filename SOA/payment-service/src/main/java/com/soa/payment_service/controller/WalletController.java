package com.soa.payment_service.controller;

import com.soa.payment_service.dto.RestResponse;
import com.soa.payment_service.dto.WalletDTO;
import com.soa.payment_service.dto.WalletTransactionDTO;
import com.soa.payment_service.security.UserPrincipal;
import com.soa.payment_service.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    // Helper: Lấy ID user từ token
    private Long getUserIdFromAuth(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new SecurityException("Chưa đăng nhập hoặc Token không hợp lệ.");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof UserPrincipal) {
            return ((UserPrincipal) principal).getId();
        }
        throw new SecurityException("Không tìm thấy thông tin UserPrincipal.");
    }

    // API 1: Xem ví (Trả về DTO)
    @GetMapping("/me")
    public ResponseEntity<?> getMyWallet(Authentication auth) {
        try {
            Long userId = getUserIdFromAuth(auth);
            WalletDTO walletDTO = walletService.getMyWallet(userId);
            return ResponseEntity.ok(RestResponse.success(walletDTO, "Lấy thông tin ví thành công"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(RestResponse.error(e.getMessage(), 401));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RestResponse.error(e.getMessage(), 400));
        }
    }

    // API 2: Lịch sử (Trả về List<DTO>)
    @GetMapping("/history")
    public ResponseEntity<?> getHistory(Authentication auth) {
        try {
            Long userId = getUserIdFromAuth(auth);
            List<WalletTransactionDTO> history = walletService.getMyHistory(userId);
            return ResponseEntity.ok(RestResponse.success(history, "Lấy lịch sử thành công"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(RestResponse.error(e.getMessage(), 401));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RestResponse.error(e.getMessage(), 400));
        }
    }

    // API 3: Rút tiền
    @PostMapping("/withdraw")
    public ResponseEntity<?> requestWithdraw(
            Authentication auth,
            @RequestParam BigDecimal amount,
            @RequestParam String bankInfo) {
        try {
            Long userId = getUserIdFromAuth(auth);
            walletService.requestWithdrawal(userId, amount, bankInfo);
            return ResponseEntity.ok(RestResponse.success("Đã gửi yêu cầu rút tiền", "Thành công"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(RestResponse.error(e.getMessage(), 401));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RestResponse.error(e.getMessage(), 400));
        }
    }

    // API 4: Admin duyệt (Ví dụ)
    @PutMapping("/admin/approve/{requestId}")
    public ResponseEntity<?> approveWithdrawal(@PathVariable Long requestId) {
        try {
            walletService.approveWithdrawal(requestId);
            return ResponseEntity.ok(RestResponse.success("Đã duyệt yêu cầu", "Thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(RestResponse.error(e.getMessage(), 400));
        }
    }
}