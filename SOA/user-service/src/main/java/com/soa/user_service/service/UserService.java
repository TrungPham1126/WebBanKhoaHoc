package com.soa.user_service.service;

import com.soa.user_service.dto.ChartDataDTO;
import com.soa.user_service.dto.UserResponseDTO;
import com.soa.user_service.dto.UserUpdateRequestDTO;
import java.util.List;

public interface UserService {
    // Lấy danh sách tất cả user (Dành cho Admin)
    List<UserResponseDTO> getAllUsers();

    // Lấy thông tin user theo ID (Admin hoặc chính chủ)
    UserResponseDTO getUserById(Long id);

    // Lấy thông tin của chính user đang đăng nhập
    UserResponseDTO getMyProfile(String email);

    // Cập nhật thông tin cá nhân
    UserResponseDTO updateProfile(String email, UserUpdateRequestDTO updateRequest);

    // Xóa user (Dành cho Admin)
    void deleteUser(Long id);

    List<ChartDataDTO> getNewUsersStats();
}