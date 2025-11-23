package com.soa.user_service.service.impl;

import com.soa.user_service.dto.*;
import com.soa.user_service.entity.ERole;
import com.soa.user_service.entity.Role;
import com.soa.user_service.entity.User;
import com.soa.user_service.exception.BadRequestException;
import com.soa.user_service.repository.RoleRepository;
import com.soa.user_service.repository.UserRepository;
import com.soa.user_service.security.services.UserDetailsImpl;
import com.soa.user_service.service.AuthService;
import com.soa.user_service.util.JwtUtils;
import lombok.RequiredArgsConstructor; // 1. Thêm thư viện này
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor // 2. Tự động tạo Constructor cho các biến final
public class AuthServiceImpl implements AuthService {

    // 3. Thay @Autowired bằng final
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO registerStudent(RegisterRequestDTO registerRequest) {
        // Logic giữ nguyên như bạn viết
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Lỗi: Email đã được sử dụng!");
        }
        User user = createUser(registerRequest);
        Set<Role> roles = new HashSet<>();
        Role studentRole = roleRepository.findByName(ERole.ROLE_STUDENT)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role STUDENT."));
        roles.add(studentRole);
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO registerTeacher(RegisterRequestDTO registerRequest) {
        // Logic giữ nguyên
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Lỗi: Email đã được sử dụng!");
        }
        User user = createUser(registerRequest);
        Set<Role> roles = new HashSet<>();
        Role teacherRole = roleRepository.findByName(ERole.ROLE_TEACHER)
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role TEACHER."));
        roles.add(teacherRole);
        user.setRoles(roles);
        User savedUser = userRepository.save(user);
        return convertToResponseDTO(savedUser);
    }

    @Override
    public LoginResponseDTO loginUser(LoginRequestDTO loginRequest) {
        // Logic giữ nguyên
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        return new LoginResponseDTO(jwt, userDetails.getId(), userDetails.getUsername(), roles);
    }

    private User createUser(RegisterRequestDTO dto) {
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setBio(dto.getBio());
        return user;
    }

    private UserResponseDTO convertToResponseDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setRoles(user.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()));
        dto.setBio(user.getBio());
        dto.setRoles(user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toSet()));
        return dto;
    }
}