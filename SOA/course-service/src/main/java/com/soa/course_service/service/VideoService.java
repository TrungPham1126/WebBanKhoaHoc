package com.soa.course_service.service;

import com.soa.course_service.dto.VideoResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface VideoService {

        VideoResponseDTO addVideoToCourse(Long courseId, Long sectionId, String title, MultipartFile file,
                        Integer duration,
                        String teacherEmail) throws IOException;

        void deleteVideo(Long videoId, String teacherEmail);

        List<VideoResponseDTO> getVideosForCourse(Long courseId, String userEmail, String userRole);

        VideoResponseDTO addVideoToCourse(Long courseId, Long sectionId, String title, MultipartFile file,
                        Long duration,
                        String teacherEmail) throws IOException;

        VideoResponseDTO getVideoById(Long videoId);

        VideoResponseDTO uploadVideo(MultipartFile file, Long courseId, String teacherEmail) throws IOException;
}