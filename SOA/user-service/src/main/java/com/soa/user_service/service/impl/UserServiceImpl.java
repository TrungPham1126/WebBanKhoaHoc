package com.soa.user_service.service.impl;

import com.soa.user_service.dto.ChartDataDTO;
import com.soa.user_service.dto.UserResponseDTO;
import com.soa.user_service.dto.UserUpdateRequestDTO;
import com.soa.user_service.entity.ERole;
import com.soa.user_service.entity.Role;
import com.soa.user_service.entity.User;
import com.soa.user_service.exception.ResourceNotFoundException;
import com.soa.user_service.repository.RoleRepository;
import com.soa.user_service.repository.UserRepository;
import com.soa.user_service.service.UserService;

import lombok.Value;

import org.springframework.beans.factory.annotation.Autowired; // Cần import cái này
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    // --- SỬA LỖI TẠI ĐÂY: Thêm Constructor thủ công ---
    @Autowired
    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }
    // --------------------------------------------------

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với ID: " + id));
        return convertToDTO(user);
    }

    @Override
    public UserResponseDTO getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với email: " + email));
        return convertToDTO(user);
    }

    @Override
    @Transactional
    public UserResponseDTO updateProfile(String email, UserUpdateRequestDTO updateRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user: " + email));

        // Chỉ cập nhật các trường cho phép
        if (updateRequest.getFullName() != null) {
            user.setFullName(updateRequest.getFullName());
        }
        if (updateRequest.getPhoneNumber() != null) {
            user.setPhoneNumber(updateRequest.getPhoneNumber());
        }
        if (updateRequest.getBio() != null) {
            user.setBio(updateRequest.getBio());
        }

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Không tìm thấy user để xóa với ID: " + id);
        }
        userRepository.deleteById(id);
    }

    // Helper function để chuyển Entity -> DTO
    private UserResponseDTO convertToDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setBio(user.getBio());

        // Convert Roles Set<Entity> -> Set<String>
        if (user.getRoles() != null) {
            dto.setRoles(user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .collect(Collectors.toSet()));
        }
        return dto;
    }

    @Override
    public List<ChartDataDTO> getNewUsersStats() {
        List<Object[]> results = userRepository.getNewUsersPerMonth();

        return results.stream()
                .map(row -> new ChartDataDTO(
                        (String) row[0],
                        // [FIX] Ép kiểu an toàn qua Number để tránh lỗi ClassCastException
                        ((Number) row[1]).longValue()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void registerAsTeacher(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        // Lấy Role TEACHER. Nếu không tìm thấy, log lỗi ra console và throw exception
        Role teacherRole = roleRepository.findByName(ERole.ROLE_TEACHER)
                .orElseThrow(() -> {
                    System.err.println(
                            "!!! LỖI QUAN TRỌNG: Role TEACHER không tồn tại trong DB. Vui lòng chạy DataSeeder. !!!");
                    return new RuntimeException("Error: Teacher role is not found in database.");
                });

        // ... logic thêm role và save
        Set<Role> roles = user.getRoles();

        boolean isAlreadyTeacher = roles.stream()
                .anyMatch(r -> r.getName().equals(ERole.ROLE_TEACHER));

        if (isAlreadyTeacher) {
            throw new RuntimeException("Bạn đã là giáo viên rồi!");
        }

        roles.add(teacherRole);
        user.setRoles(roles);
        userRepository.save(user);
        System.out.println("✅ User " + email + " successfully upgraded to TEACHER.");
    }

}