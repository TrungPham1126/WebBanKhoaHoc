package com.soa.user_service.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.soa.user_service.dto.LoginRequestDTO;
import com.soa.user_service.dto.LoginResponseDTO;
import com.soa.user_service.dto.RegisterRequestDTO;
import com.soa.user_service.dto.UserResponseDTO;
import com.soa.user_service.entity.ERole;
import com.soa.user_service.entity.Role;
import com.soa.user_service.entity.User;
import com.soa.user_service.exception.BadRequestException;
import com.soa.user_service.exception.ResourceNotFoundException;
import com.soa.user_service.repository.RoleRepository;
import com.soa.user_service.repository.UserRepository;
import com.soa.user_service.security.services.UserDetailsImpl;
import com.soa.user_service.service.AuthService;
import com.soa.user_service.util.JwtUtils;

@Service
public class AuthServiceImpl implements AuthService {

    // 3. Thay @Autowired bằng final
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository tokenRepository;
    private final RabbitTemplate rabbitTemplate;
    public AuthServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           AuthenticationManager authenticationManager,
                           JwtUtils jwtUtils,
                           PasswordEncoder passwordEncoder,
                           PasswordResetTokenRepository tokenRepository,
                           RabbitTemplate rabbitTemplate) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepository = tokenRepository;
        this.rabbitTemplate = rabbitTemplate;
    }
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
    @Override
    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy user với email: " + email));

        // 1. Tạo Token ngẫu nhiên
        String token = UUID.randomUUID().toString();

        // 2. Lưu vào DB
        PasswordResetToken myToken = new PasswordResetToken(token, user);
        tokenRepository.save(myToken);

        // 3. Gửi message sang Notification Service qua RabbitMQ
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String emailBody = "Xin chào " + user.getFullName() + ",\n\n" +
                "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới:\n" +
                resetLink + "\n\n" +
                "Link này sẽ hết hạn sau 15 phút.";

        NotificationMessageDTO message = new NotificationMessageDTO(user.getEmail(), "Yêu cầu đặt lại mật khẩu", emailBody);
        
        // Gửi vào queue "notification_queue"
        rabbitTemplate.convertAndSend("notification_queue", message);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Token không hợp lệ!"));

        if (resetToken.isExpired()) {
            throw new BadRequestException("Token đã hết hạn!");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Xóa token sau khi dùng xong
        tokenRepository.delete(resetToken);
    }
}