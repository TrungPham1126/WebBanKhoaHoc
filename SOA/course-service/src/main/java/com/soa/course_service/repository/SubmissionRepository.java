package com.soa.course_service.repository;

import com.soa.course_service.entity.ExerciseSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<ExerciseSubmission, Long> {
    List<ExerciseSubmission> findByStudentEmailAndExerciseId(String email, Long exerciseId);

    List<ExerciseSubmission> findByExerciseId(Long exerciseId);
}