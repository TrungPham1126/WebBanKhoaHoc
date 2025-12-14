package com.soa.enrollment_service.service.impl;

import com.soa.enrollment_service.dto.EnrollmentResponseDTO;
import com.soa.enrollment_service.entity.Enrollment;
import com.soa.enrollment_service.repository.EnrollmentRepository;
import com.soa.enrollment_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;

    @Value("${service.course.url:http://localhost:8082}")
    private String courseServiceBaseUrl;

    @Override
    @Transactional
    public void createEnrollment(Long userId, String email, Long courseId, Long teacherId, String courseTitle,
            Double amount, String imageUrl) {
        // 1. Check trùng
        if (enrollmentRepository.existsByStudentEmailAndCourseId(email, courseId)) {
            System.out.println(">>> User " + email + " đã sở hữu khóa học này.");
            return;
        }

        // 2. Lưu Enrollment (Đã có userId)
        Enrollment enrollment = new Enrollment();
        enrollment.setUserId(userId); // 🔥 QUAN TRỌNG: Phải set dòng này
        enrollment.setStudentEmail(email);
        enrollment.setCourseId(courseId);
        enrollment.setTeacherId(teacherId);
        enrollment.setCourseTitle(courseTitle);
        enrollment.setAmount(amount);
        enrollment.setImageUrl(imageUrl);

        enrollmentRepository.save(enrollment);
        System.out.println(">>> Đã lưu Enrollment thành công cho UserID: " + userId);

        // 3. Gọi Course Service tăng số lượng
        try {
            incrementStudentCountInCourseService(courseId);
        } catch (Exception e) {
            System.err.println("⚠️ Lỗi gọi Course Service: " + e.getMessage());
        }
    }

    // ... (Giữ nguyên các hàm getMyEnrollments,
    // incrementStudentCountInCourseService, mapToDTO cũ)

    @Override
    public List<EnrollmentResponseDTO> getMyEnrollments(String email) {
        return enrollmentRepository.findByStudentEmail(email).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private void incrementStudentCountInCourseService(Long courseId) {
        RestTemplate restTemplate = new RestTemplate();
        String url = courseServiceBaseUrl + "/api/v1/courses/" + courseId + "/increment-student";
        restTemplate.put(url, null);
    }

    private EnrollmentResponseDTO mapToDTO(Enrollment enrollment) {
        EnrollmentResponseDTO dto = new EnrollmentResponseDTO();
        dto.setId(enrollment.getId());
        dto.setUserId(enrollment.getUserId());
        dto.setStudentEmail(enrollment.getStudentEmail());
        dto.setCourseId(enrollment.getCourseId());
        dto.setTeacherId(enrollment.getTeacherId());
        dto.setCourseTitle(enrollment.getCourseTitle());
        dto.setAmount(enrollment.getAmount());
        dto.setImageUrl(enrollment.getImageUrl());
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        return dto;
    }
}