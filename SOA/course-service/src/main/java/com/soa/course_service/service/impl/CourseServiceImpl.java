package com.soa.course_service.service.impl;

import com.soa.course_service.dto.*;
import com.soa.course_service.entity.*;
import com.soa.course_service.repository.CourseRepository;
import com.soa.course_service.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

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

    // --- Helper Methods ---

    private CourseResponseDTO mapToDTO(Course course) {
        CourseResponseDTO dto = new CourseResponseDTO();
        dto.setId(course.getId());
        dto.setTitle(course.getTitle());
        dto.setDescription(course.getDescription());
        dto.setPrice(course.getPrice());
        dto.setImageUrl(course.getImageUrl());

        // Trong Microservice, Course chỉ lưu email giáo viên, không lưu object User
        dto.setTeacherName(course.getTeacherEmail());

        // Tạm thời để studentCount = 0 hoặc cần gọi sang Enrollment Service để lấy
        // (nâng cao)
        dto.setStudentCount(0);

        return dto;
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path path = Paths.get("uploads/images");
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
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

    // --- Implement Methods ---

    @Override
    public List<CourseResponseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
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

        // QUAN TRỌNG: Lưu email thay vì User entity
        course.setTeacherEmail(teacherEmail);

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

        // Tự động set thứ tự
        int orderIndex = course.getSections() == null ? 0 : course.getSections().size();
        section.setOrderIndex(orderIndex);

        course.getSections().add(section);
        courseRepository.save(course); // Cascade sẽ lưu section

        // Trả về DTO
        // Lấy section vừa lưu (là phần tử cuối cùng)
        Section savedSection = course.getSections().get(course.getSections().size() - 1);
        return new SectionDTO(savedSection.getId(), savedSection.getTitle(), new ArrayList<>());
    }

    @Override
    public List<SectionDTO> getCourseContent(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khóa học"));

        // Convert List<Section> -> List<SectionDTO>
        return course.getSections().stream().map(section -> {
            SectionDTO dto = new SectionDTO();
            dto.setId(section.getId());
            dto.setTitle(section.getTitle());

            // Map Videos
            List<LessonDTO> lessons = new ArrayList<>();
            if (section.getVideos() != null) {
                lessons.addAll(section.getVideos().stream().map(video -> new LessonDTO(
                        video.getId(),
                        video.getTitle(),
                        "video",
                        "10:00", // Placeholder duration
                        video.getVideoUrl())).collect(Collectors.toList()));
            }
            // Map Exercises
            if (section.getExercises() != null) {
                lessons.addAll(section.getExercises().stream().map(ex -> new LessonDTO(
                        ex.getId(),
                        ex.getTitle(),
                        "exercise",
                        null,
                        null)).collect(Collectors.toList()));
            }
            dto.setLessons(lessons);
            return dto;
        }).collect(Collectors.toList());
    }
}