package com.soa.enrollment_service.service;

import com.soa.enrollment_service.dto.EnrollmentRequestDTO;
import com.soa.enrollment_service.dto.EnrollmentResponseDTO;
import com.soa.enrollment_service.entity.Enrollment;
import com.soa.enrollment_service.repository.EnrollmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    public EnrollmentResponseDTO enrollCourse(EnrollmentRequestDTO request, String studentEmail) {
        // 1. Kiểm tra đã đăng ký chưa
        if (enrollmentRepository.existsByStudentEmailAndCourseId(studentEmail, request.getCourseId())) {
            throw new RuntimeException("Bạn đã đăng ký khóa học này rồi!");
        }

        // 2. Lưu thông tin (Ở bước này tạm thời tin tưởng courseId gửi lên là đúng)
        // (Nâng cao: Dùng FeignClient gọi sang Course-Service để check courseId có tồn
        // tại ko)
        Enrollment enrollment = new Enrollment();
        enrollment.setStudentEmail(studentEmail);
        enrollment.setCourseId(request.getCourseId());
        enrollment.setCourseTitle(request.getCourseTitle()); // Lưu tên khóa học để hiển thị cho nhanh

        Enrollment saved = enrollmentRepository.save(enrollment);
        return mapToDTO(saved);
    }

    public List<EnrollmentResponseDTO> getMyCourses(String studentEmail) {
        return enrollmentRepository.findByStudentEmail(studentEmail).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private EnrollmentResponseDTO mapToDTO(Enrollment enrollment) {
        EnrollmentResponseDTO dto = new EnrollmentResponseDTO();
        dto.setId(enrollment.getId());
        dto.setStudentEmail(enrollment.getStudentEmail());
        dto.setCourseId(enrollment.getCourseId());
        dto.setCourseTitle(enrollment.getCourseTitle());
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        return dto;
    }
}