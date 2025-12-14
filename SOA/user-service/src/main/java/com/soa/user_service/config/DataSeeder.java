package com.soa.user_service.config;

import java.util.HashSet;
import java.util.Set;
import java.util.Optional; // Cần import Optional để xử lý an toàn

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.soa.user_service.entity.ERole;
import com.soa.user_service.entity.Role;
import com.soa.user_service.entity.User;
import com.soa.user_service.repository.RoleRepository;
import com.soa.user_service.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Tạo các Role cần thiết
        createRoleIfNotFound(ERole.ROLE_STUDENT);
        createRoleIfNotFound(ERole.ROLE_TEACHER);
        createRoleIfNotFound(ERole.ROLE_ADMIN);

        // 2. Tạo tài khoản Admin nếu chưa tồn tại
        if (!userRepository.existsByEmail("admin@gmail.com")) {
            User admin = new User();
            admin.setFullName("Super Admin");
            admin.setEmail("admin@gmail.com");
            admin.setPhoneNumber("0999999999");
            admin.setPassword(passwordEncoder.encode("123456"));

            Set<Role> roles = new HashSet<>();

            // Tìm Role ADMIN đã được tạo ở bước 1
            Optional<Role> adminRoleOpt = roleRepository.findByName(ERole.ROLE_ADMIN);

            if (adminRoleOpt.isPresent()) {
                roles.add(adminRoleOpt.get());
            } else {
                throw new RuntimeException("Error: Role ADMIN is missing after seeding attempt.");
            }

            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("---------------------------------------------");
            System.out.println(">>> ĐÃ KHỞI TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!");
            System.out.println("---------------------------------------------");
        }
    }

    // 🔥 SỬA: Sử dụng constructor rỗng và setter
    private void createRoleIfNotFound(ERole name) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role();
            role.setName(name); // Gán tên Role
            roleRepository.save(role);
            System.out.println(">>> Đã tạo Role mới: " + name);
        }
    }
}