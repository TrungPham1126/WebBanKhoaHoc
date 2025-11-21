package com.soa.course_service.controller;

import com.soa.course_service.dto.*;
import com.soa.course_service.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/courses") // Đã thêm v1
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAll() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CourseResponseDTO> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) throws IOException {

        CourseRequestDTO request = new CourseRequestDTO();
        request.setTitle(title);
        request.setDescription(description);
        request.setPrice(price);

        return ResponseEntity.ok(courseService.createCourse(request, image, authentication.getName()));
    }

    @PostMapping("/{id}/sections")
    public ResponseEntity<SectionDTO> createSection(
            @PathVariable Long id,
            @RequestBody SectionRequestDTO request,
            Authentication authentication) {
        return ResponseEntity.ok(courseService.createSection(id, request, authentication.getName()));
    }
}