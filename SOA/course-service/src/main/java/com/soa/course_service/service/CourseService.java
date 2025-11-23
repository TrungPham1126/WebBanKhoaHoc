package com.soa.course_service.service;

import com.soa.course_service.dto.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface CourseService {
        List<CourseResponseDTO> getAllCourses();

        CourseResponseDTO getCourseById(Long id);

        List<CourseResponseDTO> getMyCourses(String teacherEmail);

        CourseResponseDTO createCourse(CourseRequestDTO request, MultipartFile image, String teacherEmail)
                        throws IOException;

        CourseResponseDTO updateCourse(Long id, CourseRequestDTO request, MultipartFile image, String teacherEmail)
                        throws IOException;

        void deleteCourse(Long id, String teacherEmail);

        SectionDTO createSection(Long courseId, SectionRequestDTO request, String teacherEmail);

        List<SectionDTO> getCourseContent(Long courseId);

        void approveCourse(Long id);

        void rejectCourse(Long id);

        List<CourseResponseDTO> getAllCoursesForAdmin();

        void deleteCourseByAdmin(Long id);
}