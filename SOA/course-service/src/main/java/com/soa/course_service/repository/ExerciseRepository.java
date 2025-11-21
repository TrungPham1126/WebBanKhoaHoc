package com.soa.course_service.repository;

import com.soa.course_service.entity.Exercise;
import com.soa.course_service.entity.ExerciseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    // Lấy danh sách bài tập theo Video
    List<Exercise> findByVideoId(Long videoId);

    // Lấy danh sách bài tập Free
    List<Exercise> findByIsFreeTrue();

    // Lấy bài tập Free theo loại (VD: Chỉ lấy bài Nghe miễn phí)
    List<Exercise> findByIsFreeTrueAndType(ExerciseType type);
}