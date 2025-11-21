package com.soa.enrollment_service.repository;

import com.soa.enrollment_service.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    // Kiểm tra xem học viên này đã mua khóa học này chưa
    boolean existsByStudentEmailAndCourseId(String studentEmail, Long courseId);

    // Lấy danh sách khóa học của học viên
    List<Enrollment> findByStudentEmail(String studentEmail);
}