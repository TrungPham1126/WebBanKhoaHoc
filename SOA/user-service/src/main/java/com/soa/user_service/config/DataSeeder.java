package com.soa.user_service.config;

import java.util.HashSet;
import java.util.Set;

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
        // [FIX] Kiểm tra từng Role, thiếu cái nào tạo cái đó
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
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role ADMIN is not found."));
            roles.add(adminRole);

            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("---------------------------------------------");
            System.out.println(">>> ĐÃ KHỞI TẠO TÀI KHOẢN ADMIN THÀNH CÔNG!");
            System.out.println("---------------------------------------------");
        }
    }

    // Hàm phụ trợ giúp code gọn hơn
    private void createRoleIfNotFound(ERole name) {
        if (roleRepository.findByName(name).isEmpty()) {
            roleRepository.save(new Role(name));
            System.out.println(">>> Đã tạo Role mới: " + name);
        }
    }
}