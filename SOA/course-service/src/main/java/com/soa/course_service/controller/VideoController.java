package com.soa.course_service.controller;

import com.soa.course_service.dto.VideoResponseDTO;
import com.soa.course_service.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/videos") // Gateway sẽ map vào đây
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    // API Upload Video (Chỉ Teacher)
    // POST /api/v1/videos/courses/{courseId}
    @PostMapping(value = "/courses/{courseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<VideoResponseDTO> addVideo(
            @PathVariable Long courseId,
            @RequestParam("title") String title,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "duration", required = false) Integer duration,
            @RequestParam(value = "sectionId", required = false) Long sectionId,
            Authentication authentication) throws IOException {

        String teacherEmail = authentication.getName();
        VideoResponseDTO response = videoService.addVideoToCourse(courseId, sectionId, title, file, duration,
                teacherEmail);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // API Xóa Video
    @DeleteMapping("/{videoId}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long videoId, Authentication authentication) {
        videoService.deleteVideo(videoId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    // API Lấy danh sách Video
    @GetMapping("/courses/{courseId}")
    public ResponseEntity<List<VideoResponseDTO>> getVideos(@PathVariable Long courseId,
            Authentication authentication) {
        // Logic check role ở service có thể phức tạp hơn
        return ResponseEntity.ok(videoService.getVideosForCourse(courseId, authentication.getName(), "UNKNOWN"));
    }
}