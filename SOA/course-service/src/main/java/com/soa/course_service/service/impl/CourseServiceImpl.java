package com.soa.course_service.service.impl;

import com.soa.course_service.dto.*;
import com.soa.course_service.entity.*;
import com.soa.course_service.repository.CourseRepository;
import com.soa.course_service.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;

    private CourseResponseDTO mapToDTO(Course course) {
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setPrice(course.getPrice());
        dto.setImageUrl(course.getImageUrl());
        dto.setTeacherName(course.getTeacherEmail());
        dto.setStudentCount(100);
        dto.setStatus(course.getStatus() != null ? course.getStatus().name() : "PENDING");

        // --- THÊM DÒNG NÀY ---
        dto.setCreatedAt(course.getCreatedAt());
        // ---------------------

        return dto;
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path uploadPath = Paths.get("uploads/images");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        try (InputStream inputStream = file.getInputStream()) {
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
        }
        return "/images/" + fileName;
    }

    private Course checkOwnership(Long courseId, String teacherEmail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học: " + courseId));
        if (!teacherEmail.equals(course.getTeacherEmail())) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa khóa học này");
        }
        return course;
    }

    @Transactional(readOnly = true)
    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findByStatus(CourseStatus.APPROVED).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponseDTO getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));
        return mapToDTO(course);
    }

    @Override
    public List<CourseResponseDTO> getMyCourses(String teacherEmail) {
        return courseRepository.findByTeacherEmail(teacherEmail).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CourseResponseDTO createCourse(CourseRequestDTO request, MultipartFile image, String teacherEmail)
            throws IOException {
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());
        course.setTeacherEmail(teacherEmail);

        // Mặc định khi tạo mới là PENDING (Chờ duyệt)
        course.setStatus(CourseStatus.PENDING);

        if (image != null && !image.isEmpty()) {
            course.setImageUrl(saveFile(image));
        }

        return mapToDTO(courseRepository.save(course));
    }

    @Override
    public CourseResponseDTO updateCourse(Long id, CourseRequestDTO request, MultipartFile image, String teacherEmail)
            throws IOException {
        Course course = checkOwnership(id, teacherEmail);

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setPrice(request.getPrice());

        if (image != null && !image.isEmpty()) {
            course.setImageUrl(saveFile(image));
        }

        return mapToDTO(courseRepository.save(course));
    }

    @Override
    public void deleteCourse(Long id, String teacherEmail) {
        Course course = checkOwnership(id, teacherEmail);
        courseRepository.delete(course);
    }

    @Override
    public SectionDTO createSection(Long courseId, SectionRequestDTO request, String teacherEmail) {
        Course course = checkOwnership(courseId, teacherEmail);

        Section section = new Section();
        section.setTitle(request.getTitle());
        section.setCourse(course);

        int orderIndex = course.getSections() == null ? 0 : course.getSections().size();
        section.setOrderIndex(orderIndex);

        course.getSections().add(section);
        courseRepository.save(course);

        Section savedSection = course.getSections().get(course.getSections().size() - 1);
        return new SectionDTO(savedSection.getId(), savedSection.getTitle(), new ArrayList<>());
    }

    @Transactional(readOnly = true)
    @Override
    public List<SectionDTO> getCourseContent(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        return course.getSections().stream().map(section -> {
            SectionDTO dto = new SectionDTO();
            dto.setId(section.getId());
            dto.setTitle(section.getTitle());

            List<LessonDTO> lessons = new ArrayList<>();
            if (section.getVideos() != null) {
                lessons.addAll(section.getVideos().stream().map(video -> {
                    LessonDTO lesson = new LessonDTO();
                    lesson.setId(video.getId());
                    lesson.setTitle(video.getTitle());
                    lesson.setType("video");
                    lesson.setDuration("10:00");
                    lesson.setVideoUrl(video.getVideoUrl());
                    lesson.setStatus(video.getStatus()); // <--- QUAN TRỌNG: Truyền status xuống
                    return lesson;
                }).collect(Collectors.toList()));
            }

            if (section.getExercises() != null) {
                lessons.addAll(section.getExercises().stream().map(ex -> {
                    LessonDTO lesson = new LessonDTO();
                    lesson.setId(ex.getId());
                    lesson.setTitle(ex.getTitle());
                    lesson.setType("exercise");
                    return lesson;
                }).collect(Collectors.toList()));
            }
            dto.setLessons(lessons);
            return dto;
        }).collect(Collectors.toList());
    }
    // --- Chức năng Admin ---

    public void approveCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));
        course.setStatus(CourseStatus.APPROVED);
        courseRepository.save(course);
    }

    public void rejectCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));
        course.setStatus(CourseStatus.REJECTED);
        courseRepository.save(course);
    }

    @Override
    public List<CourseResponseDTO> getAllCoursesForAdmin() {

        return courseRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCourseByAdmin(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));
        courseRepository.delete(course);
    }
}