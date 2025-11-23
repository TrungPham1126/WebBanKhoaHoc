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

        if (enrollmentRepository.existsByStudentEmailAndCourseId(studentEmail, request.getCourseId())) {
            throw new RuntimeException("Bạn đã đăng ký khóa học này rồi!");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudentEmail(studentEmail);
        enrollment.setCourseId(request.getCourseId());
        enrollment.setCourseTitle(request.getCourseTitle());
        enrollment.setImageUrl(request.getImageUrl());

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
        dto.setImageUrl(enrollment.getImageUrl()); // <--- MAP DỮ LIỆU Ở ĐÂY
        dto.setEnrolledAt(enrollment.getEnrolledAt());
        return dto;
    }
}