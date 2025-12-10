package com.soa.user_service.repository;

import com.soa.user_service.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);

    // [FIX] Sửa query để thống kê theo NGÀY trong 30 ngày gần nhất
    // Lưu ý: Chúng ta giữ nguyên tên hàm 'getNewUsersPerMonth' để không phải sửa
    // code ở Service/Controller
    @Query(value = "SELECT DATE_FORMAT(created_at, '%d/%m/%Y') as label, COUNT(*) as value " +
            "FROM users " +
            "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) " + // Chỉ lấy 30 ngày qua
            "GROUP BY label " +
            "ORDER BY MAX(created_at) ASC", nativeQuery = true)
    List<Object[]> getNewUsersPerMonth();
}