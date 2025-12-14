package com.soa.user_service.controller;

import com.soa.user_service.dto.LoginRequestDTO;
import com.soa.user_service.dto.LoginResponseDTO;
import com.soa.user_service.dto.RegisterRequestDTO;
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
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok("Vui lòng kiểm tra email để đặt lại mật khẩu.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Đặt lại mật khẩu thành công!");
    }

}