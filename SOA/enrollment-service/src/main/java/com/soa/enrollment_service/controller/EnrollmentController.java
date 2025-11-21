package com.soa.enrollment_service.controller;

import com.soa.enrollment_service.dto.EnrollmentRequestDTO;
import com.soa.enrollment_service.dto.EnrollmentResponseDTO;
import com.soa.enrollment_service.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping
    public ResponseEntity<EnrollmentResponseDTO> enroll(
            @RequestBody EnrollmentRequestDTO request,
            Authentication authentication) {
        return new ResponseEntity<>(
                enrollmentService.enrollCourse(request, authentication.getName()),
                HttpStatus.CREATED);
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<EnrollmentResponseDTO>> getMyCourses(Authentication authentication) {
        return ResponseEntity.ok(enrollmentService.getMyCourses(authentication.getName()));
    }
}