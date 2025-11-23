package com.soa.course_service.service.impl;

import com.soa.course_service.dto.*;
import com.soa.course_service.entity.*;
import com.soa.course_service.repository.*;
import com.soa.course_service.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final VideoRepository videoRepository;
    private final SubmissionRepository submissionRepository;
    private final CourseRepository courseRepository;

    private ExerciseResponseDTO mapToDTO(Exercise exercise) {
        ExerciseResponseDTO dto = new ExerciseResponseDTO();
        dto.setId(exercise.getId());
        dto.setTitle(exercise.getTitle());
        dto.setDescription(exercise.getDescription());
        dto.setQuestionUrl(exercise.getQuestionUrl());
        dto.setType(exercise.getType());
        dto.setIsFree(exercise.getIsFree());
        if (exercise.getVideo() != null) {
            dto.setVideoId(exercise.getVideo().getId());
            dto.setCourseId(exercise.getVideo().getCourse().getId());
        }
        return dto;
    }

    private String uploadFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty())
            return null;
        String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path path = Paths.get("uploads/exercises"); // Lưu vào folder riêng
        if (!Files.exists(path))
            Files.createDirectories(path);
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        }
        return "/exercises/" + fileName;
    }

    @Override
    public ExerciseResponseDTO createExercise(ExerciseRequestDTO request, MultipartFile questionFile,
            String teacherEmail) throws IOException {
        Exercise exercise = new Exercise();
        exercise.setTitle(request.getTitle());
        exercise.setDescription(request.getDescription());
        exercise.setType(request.getType());
        exercise.setIsFree(request.getIsFree());

        if (questionFile != null) {
            exercise.setQuestionUrl(uploadFile(questionFile));
        }

        if (request.getVideoId() != null) {
            Video video = videoRepository.findById(request.getVideoId())
                    .orElseThrow(() -> new RuntimeException("Video không tồn tại"));

            if (!video.getCourse().getTeacherEmail().equals(teacherEmail)) {
                throw new RuntimeException("Không có quyền thêm bài tập vào video này");
            }
            exercise.setVideo(video);
            exercise.setIsFree(false);
        }

        return mapToDTO(exerciseRepository.save(exercise));
    }

    @Override
    public List<ExerciseResponseDTO> getFreeExercises(ExerciseType type) {
        List<Exercise> exercises;
        if (type != null) {
            exercises = exerciseRepository.findByIsFreeTrueAndType(type);
        } else {
            exercises = exerciseRepository.findByIsFreeTrue();
        }
        return exercises.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<ExerciseResponseDTO> getExercisesByVideo(Long videoId) {
        return exerciseRepository.findByVideoId(videoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void submitExercise(Long exerciseId, String answerText, MultipartFile file, String studentEmail)
            throws IOException {
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new RuntimeException("Bài tập không tồn tại"));

        ExerciseSubmission submission = new ExerciseSubmission();
        submission.setStudentEmail(studentEmail);
        submission.setExercise(exercise);
        submission.setAnswerText(answerText);

        if (file != null) {
            submission.setAnswerFileUrl(uploadFile(file));
        }

        submissionRepository.save(submission);
    }

    @Override
    public void gradeSubmission(Long submissionId, Double score, String feedback, String teacherEmail) {
        ExerciseSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Bài nộp không tồn tại"));

        Exercise ex = submission.getExercise();
        if (!ex.getIsFree() && ex.getVideo() != null) {
            String courseOwner = ex.getVideo().getCourse().getTeacherEmail();
            if (!courseOwner.equals(teacherEmail)) {
                throw new RuntimeException("Không có quyền chấm bài này");
            }
        }

        submission.setScore(score);
        submission.setTeacherFeedback(feedback);
        submissionRepository.save(submission);
    }
}