package com.soa.user_service.controller;

import com.soa.user_service.dto.ForgotPasswordRequestDTO;
import com.soa.user_service.dto.LoginRequestDTO;
import com.soa.user_service.dto.LoginResponseDTO;
import com.soa.user_service.dto.RegisterRequestDTO;
import com.soa.user_service.dto.ResetPasswordRequestDTO;
import com.soa.user_service.dto.UserResponseDTO;
import com.soa.user_service.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")

public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/student")
    public ResponseEntity<UserResponseDTO> registerStudent(@RequestBody RegisterRequestDTO registerRequest) {
        UserResponseDTO response = authService.registerStudent(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/register/teacher")
    public ResponseEntity<UserResponseDTO> registerTeacher(@RequestBody RegisterRequestDTO registerRequest) {
        UserResponseDTO response = authService.registerTeacher(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> authenticateUser(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO loginResponse = authService.loginUser(loginRequest);
        return new ResponseEntity<>(loginResponse, HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    // [KHẮC PHỤC] Dùng @RequestBody và DTO để đọc email từ JSON Body
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequestDTO request) {
        // Gọi service với email từ request
        authService.forgotPassword(request.getEmail());

        // Trả về thông báo thành công (chống User Enumeration)
        return ResponseEntity.ok("Nếu email tồn tại, chúng tôi đã gửi hướng dẫn khôi phục mật khẩu.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequestDTO request) {
        authService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
    }

}