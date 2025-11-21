package com.soa.course_service.repository;

import com.soa.course_service.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    // Tìm theo email giáo viên
    List<Course> findByTeacherEmail(String teacherEmail);
}