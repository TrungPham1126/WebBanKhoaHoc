package com.soa.course_service.controller;

import com.soa.course_service.dto.*;
import com.soa.course_service.service.CourseService;
import com.soa.course_service.security.UserPrincipal;
import com.soa.course_service.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
// 🔥 ĐÃ XÓA @CrossOrigin ĐỂ TRÁNH LỖI "MULTIPLE VALUES"
public class CourseController {

    private final CourseService courseService;
    private final CourseRepository courseRepository;

    // --- 1. API PUBLIC/TEACHER ---

    @GetMapping
    public ResponseEntity<List<CourseResponseDTO>> getAll() {
        // Đây là API public, ai cũng xem được danh sách khóa học
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseResponseDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/{id}/content")
    public ResponseEntity<List<SectionDTO>> getContent(@PathVariable Long id, Authentication authentication) {
        Long userId = null;
        // Nếu user đã đăng nhập, lấy ID để check tiến độ
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
            userId = user.getId();
        }

        return ResponseEntity.ok(courseService.getCourseContent(id, userId));
    }

    // 2. Thêm API đánh dấu hoàn thành video (User gọi khi xem xong)
    @PostMapping("/progress/video/{videoId}")
    public ResponseEntity<String> markVideoCompleted(@PathVariable Long videoId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();
        courseService.markVideoAsCompleted(videoId, user.getId());

        return ResponseEntity.ok("Đã lưu tiến độ học tập!");
    }

    @GetMapping("/my-courses")
    public ResponseEntity<List<CourseResponseDTO>> getMyCourses(Authentication auth) {
        return ResponseEntity.ok(courseService.getMyCourses(auth.getName()));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<CourseResponseDTO> update(
            @PathVariable Long id,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) throws IOException {

        // Lấy thông tin user đang đăng nhập
        UserPrincipal user = (UserPrincipal) authentication.getPrincipal(); // Hoặc dùng authentication.getName() tùy
                                                                            // logic Service

        CourseRequestDTO request = new CourseRequestDTO();
        request.setTitle(title);
        request.setDescription(description);
        request.setPrice(price);

        // Gọi service update
        // Lưu ý: authentication.getName() trả về email (theo logic
        // UserDetailsServiceImpl của bạn)
        return ResponseEntity.ok(courseService.updateCourse(id, request, image, authentication.getName()));
    }

    // 🔥 THÊM API XÓA KHÓA HỌC (CHO GIÁO VIÊN)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        courseService.deleteCourse(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam(value = "image", required = false) MultipartFile image,
            Authentication authentication) throws IOException {

        UserPrincipal user = (UserPrincipal) authentication.getPrincipal();

        CourseRequestDTO request = new CourseRequestDTO();
        request.setTitle(title);
        request.setDescription(description);
        request.setPrice(price);

        return ResponseEntity.ok(courseService.createCourse(request, image, user.getEmail(), user.getId()));
    }

    @PostMapping("/{id}/sections")
    public ResponseEntity<SectionDTO> createSection(@PathVariable Long id, @RequestBody SectionRequestDTO req,
            Authentication auth) {
        return ResponseEntity.ok(courseService.createSection(id, req, auth.getName()));
    }

    // --- 2. API QUẢN LÝ ADMIN ---

    @GetMapping("/admin/all")
    public ResponseEntity<List<CourseResponseDTO>> getAllForAdmin() {
        return ResponseEntity.ok(courseService.getAllCoursesForAdmin());
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

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteByAdmin(@PathVariable Long id) {
        courseService.deleteCourseByAdmin(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/admin/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> response = new HashMap<>();

        try {
            // 🔥 Code hay: Sử dụng Stream API để map dữ liệu database sang DTO gọn gàng
            List<CourseChartDTO> trend = courseRepository.getNewCoursesTrend().stream()
                    .map(obj -> new CourseChartDTO(
                            (String) obj[0],
                            ((Number) obj[1]).longValue()))
                    .collect(Collectors.toList());

            List<CourseChartDTO> topCourses = courseRepository.findTop5ByOrderByStudentCountDesc().stream()
                    .map(c -> new CourseChartDTO(c.getTitle(), c.getStudentCount().longValue()))
                    .collect(Collectors.toList());

            response.put("trend", trend);
            response.put("topCourses", topCourses);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Lỗi khi lấy dữ liệu thống kê Admin: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/{id}/increment-student")
    public ResponseEntity<Void> incrementStudentCount(@PathVariable Long id) {
        courseService.increaseStudentCount(id);
        return ResponseEntity.ok().build();
    }
}