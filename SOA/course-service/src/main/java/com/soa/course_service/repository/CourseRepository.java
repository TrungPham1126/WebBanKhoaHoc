package com.soa.course_service.repository;

import com.soa.course_service.entity.Course;
import com.soa.course_service.entity.CourseStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByTeacherEmail(String teacherEmail);

    List<Course> findByStatus(CourseStatus status);

    // 🔥 FIX LỖI 500: Dùng Native Query SQL thuần để đảm bảo hàm DATE_FORMAT chạy
    // đúng trên MySQL
    @Query(value = "SELECT DATE_FORMAT(created_at, '%d/%m') as label, COUNT(*) as value " +
            "FROM courses " +
            // Điều kiện lấy dữ liệu trong 30 ngày qua
            "WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) " +
            "GROUP BY label, DATE_FORMAT(created_at, '%d/%m') " + // Group theo label
            "ORDER BY MAX(created_at) ASC", // Sắp xếp theo ngày tạo
            nativeQuery = true) // <--- QUAN TRỌNG: Phải có nativeQuery = true
    List<Object[]> getNewCoursesTrend();

    // 2. Top 5 khóa học nhiều học viên nhất
    List<Course> findTop5ByOrderByStudentCountDesc();
}