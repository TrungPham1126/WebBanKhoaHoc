package com.soa.user_service.controller;

import com.soa.user_service.dto.ChartDataDTO;
import com.soa.user_service.dto.UserResponseDTO;
import com.soa.user_service.dto.UserUpdateRequestDTO;
import com.soa.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1. Lấy danh sách tất cả User (Chỉ ADMIN)
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 2. Lấy thông tin User theo ID
    // --- FIX: Cho phép user đã đăng nhập được xem (để Navbar lấy avatar/tên) ---
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // 3. Lấy thông tin cá nhân (Profile)
    @GetMapping("/profile")
    public ResponseEntity<UserResponseDTO> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.getMyProfile(email));
    }

    // 4. Cập nhật thông tin
    @PutMapping("/profile")
    public ResponseEntity<UserResponseDTO> updateMyProfile(
            @RequestBody UserUpdateRequestDTO request,
            Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(userService.updateProfile(email, request));
    }

    // 5. Xóa User (Chỉ ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ChartDataDTO>> getUserStats() {
        return ResponseEntity.ok(userService.getNewUsersStats());
    }

    @PostMapping("/become-teacher")
    public ResponseEntity<?> becomeTeacher(Authentication authentication) {
        try {
            userService.registerAsTeacher(authentication.getName());
            return ResponseEntity.ok("Chúc mừng! Bạn đã trở thành giáo viên. Vui lòng đăng nhập lại.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}