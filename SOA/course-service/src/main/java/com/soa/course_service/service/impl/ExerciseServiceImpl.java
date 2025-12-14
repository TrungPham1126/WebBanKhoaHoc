package com.soa.course_service.service.impl;

import com.soa.course_service.dto.*;
import com.soa.course_service.entity.*;
import com.soa.course_service.repository.*;
import com.soa.course_service.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 🔥 Import Logger
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
@Slf4j // 🔥 Tự động tạo logger
public class ExerciseServiceImpl implements ExerciseService {

    private final ExerciseRepository exerciseRepository;
    private final VideoRepository videoRepository;
    private final SubmissionRepository submissionRepository;

    // Map Entity -> DTO
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

        // 🔥 SỬA: Dùng đường dẫn tuyệt đối hoặc log ra để kiểm tra
        Path path = Paths.get("uploads/exercises");

        if (!Files.exists(path)) {
            try {
                Files.createDirectories(path);
            } catch (IOException e) {
                log.error("❌ KHÔNG THỂ TẠO THƯ MỤC: uploads/exercises", e);
                throw new RuntimeException("Lỗi server: Không thể tạo thư mục lưu trữ.");
            }
        }

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, path.resolve(fileName), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("❌ LỖI GHI FILE", e);
            throw new RuntimeException("Lỗi server: Không thể ghi file.");
        }

        return "/exercises/" + fileName;
    }

    @Override
    public ExerciseResponseDTO createExercise(ExerciseRequestDTO request, MultipartFile questionFile,
            String teacherEmail) throws IOException {
        log.info(">>> Đang tạo bài tập: {}", request.getTitle()); // 🔥 Log debug

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
                    .orElseThrow(() -> new RuntimeException("Video không tồn tại (ID: " + request.getVideoId() + ")"));

            // 🔥 Log kiểm tra quyền
            log.info(">>> Check quyền: TeacherEmail={}, CourseOwner={}", teacherEmail,
                    video.getCourse().getTeacherEmail());

            if (!video.getCourse().getTeacherEmail().equals(teacherEmail)) {
                throw new RuntimeException("Bạn không có quyền chỉnh sửa khóa học này (Email không khớp).");
            }
            exercise.setVideo(video);
            exercise.setIsFree(false);
        }

        return mapToDTO(exerciseRepository.save(exercise));
    }

    // ... (Giữ nguyên các hàm getFreeExercises, getExercisesByVideo, submit,
    // grade...)
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