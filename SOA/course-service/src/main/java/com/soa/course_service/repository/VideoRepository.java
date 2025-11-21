package com.soa.course_service.repository;

import com.soa.course_service.entity.Course;
import com.soa.course_service.entity.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByCourse(Course course);
}