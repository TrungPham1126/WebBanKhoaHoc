package com.soa.course_service.controller;

import com.soa.course_service.dto.ExerciseResponseDTO;
import com.soa.course_service.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<?> createExercise(
            @ModelAttribute com.soa.course_service.dto.ExerciseRequestDTO request,
            @RequestParam(value = "file", required = false) MultipartFile file,
            org.springframework.security.core.Authentication authentication) throws IOException {
        return ResponseEntity.ok(exerciseService.createExercise(request, file, authentication.getName()));
    }

    @GetMapping("/video/{videoId}")
    public ResponseEntity<List<ExerciseResponseDTO>> getExercisesByVideo(@PathVariable Long videoId) {
        return ResponseEntity.ok(exerciseService.getExercisesByVideo(videoId));
    }

}