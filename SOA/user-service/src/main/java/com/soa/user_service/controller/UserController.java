package com.soa.user_service.controller;

import com.soa.user_service.dto.UserResponseDTO;
import com.soa.user_service.entity.User;
import com.soa.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // API lấy danh sách user (Dành cho Admin Dashboard)
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<UserResponseDTO> dtos = users.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // Helper chuyển đổi Entity sang DTO
    private UserResponseDTO mapToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());

        // Chuyển đổi Role từ Object sang Set<String> (VD: ["ROLE_STUDENT"])
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(java.util.stream.Collectors.toSet()));

        // --- QUAN TRỌNG: Map ngày tạo để vẽ biểu đồ ---
        dto.setCreatedAt(user.getCreatedAt());
        // ----------------------------------------------

        return dto;
    }
}