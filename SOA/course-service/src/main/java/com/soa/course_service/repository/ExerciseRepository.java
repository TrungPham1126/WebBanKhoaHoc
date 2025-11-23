package com.soa.course_service.repository;

import com.soa.course_service.entity.Exercise;
import com.soa.course_service.entity.ExerciseType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    List<Exercise> findByVideoId(Long videoId);

    List<Exercise> findByIsFreeTrue();

    List<Exercise> findByIsFreeTrueAndType(ExerciseType type);
}