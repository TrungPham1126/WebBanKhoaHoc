package com.soa.course_service.controller;

import com.soa.course_service.dto.*;
import com.soa.course_service.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAll() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<List<SectionDTO>> getCourseContent(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseContent(id));
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseResponseDTO>> getMyCourses(Authentication authentication) {
        return ResponseEntity.ok(courseService.getMyCourses(authentication.getName()));
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

    @PutMapping("/{id}/approve")
    public ResponseEntity<String> approveCourse(@PathVariable Long id) {
        courseService.approveCourse(id);
        return ResponseEntity.ok("Đã duyệt khóa học!");
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<String> rejectCourse(@PathVariable Long id) {
        courseService.rejectCourse(id);
        return ResponseEntity.ok("Đã từ chối khóa học!");
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CourseResponseDTO> update(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) throws IOException {

        CourseRequestDTO request = new CourseRequestDTO();
        request.setTitle(title);
        request.setDescription(description);
        request.setPrice(price);

        return ResponseEntity.ok(courseService.updateCourse(id, request, image, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        courseService.deleteCourse(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<CourseResponseDTO>> getAllForAdmin() {

        return ResponseEntity.ok(courseService.getAllCoursesForAdmin());
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteByAdmin(@PathVariable Long id) {
        courseService.deleteCourseByAdmin(id);
        return ResponseEntity.noContent().build();
    }
}