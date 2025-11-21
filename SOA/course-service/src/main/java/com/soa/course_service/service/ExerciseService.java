package com.soa.course_service.service;

import com.soa.course_service.dto.ExerciseRequestDTO;
import com.soa.course_service.dto.ExerciseResponseDTO;
import com.soa.course_service.entity.ExerciseType;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface ExerciseService {
    ExerciseResponseDTO createExercise(ExerciseRequestDTO request, MultipartFile questionFile, String teacherEmail)
            throws IOException;

    List<ExerciseResponseDTO> getFreeExercises(ExerciseType type);

    List<ExerciseResponseDTO> getExercisesByVideo(Long videoId);

    void submitExercise(Long exerciseId, String answerText, MultipartFile file, String studentEmail) throws IOException;

    void gradeSubmission(Long submissionId, Double score, String feedback, String teacherEmail);
}