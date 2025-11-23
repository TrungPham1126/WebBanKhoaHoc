package com.soa.course_service.repository;

import com.soa.course_service.entity.Course;
import com.soa.course_service.entity.CourseStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByTeacherEmail(String teacherEmail);

    List<Course> findByStatus(CourseStatus status);

}