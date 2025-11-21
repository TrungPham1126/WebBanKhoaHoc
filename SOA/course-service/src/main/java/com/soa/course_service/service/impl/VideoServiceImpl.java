package com.soa.course_service.service.impl;

import com.soa.course_service.dto.VideoResponseDTO;
import com.soa.course_service.entity.Course;
import com.soa.course_service.entity.Section;
import com.soa.course_service.entity.Video;
import com.soa.course_service.exception.BadRequestException; // Tự tạo hoặc dùng RuntimeException
import com.soa.course_service.repository.CourseRepository;
import com.soa.course_service.repository.VideoRepository;
import com.soa.course_service.service.HlsService;
import com.soa.course_service.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {

    private final VideoRepository videoRepository;
    private final CourseRepository courseRepository;
    private final HlsService hlsService;

    @Override
    public VideoResponseDTO addVideoToCourse(Long courseId, Long sectionId, String title, MultipartFile file,
            Integer duration, String teacherEmail) throws IOException {

        // 1. Kiểm tra quyền sở hữu khóa học
        Course course = checkTeacherOwnership(courseId, teacherEmail);

        if (file.isEmpty()) {
            throw new RuntimeException("File upload rỗng!");
        }

        // 2. Lưu file MP4 tạm thời vào ổ đĩa
        Path tempMp4Path = saveTempFile(file);
        // Lấy tên file không đuôi để tạo folder HLS
        String fileNameWithoutExt = tempMp4Path.getFileName().toString().replace(".mp4", "");

        // 3. Xác định Section (Chương học)
        Section targetSection = null;
        if (sectionId != null) {
            // Nếu giáo viên chọn chương cụ thể
            targetSection = course.getSections().stream()
                    .filter(s -> s.getId().equals(sectionId))
                    .findFirst()
                    .orElseThrow(
                            () -> new RuntimeException("Section ID " + sectionId + " không tồn tại trong khóa này."));
        } else {
            // Nếu không chọn chương, tạo chương mặc định hoặc lấy chương đầu tiên
            if (course.getSections().isEmpty()) {
                targetSection = new Section();
                targetSection.setTitle("Chương 1: Mặc định");
                targetSection.setCourse(course);
                targetSection.setOrderIndex(1);
                course.getSections().add(targetSection);
                // Lưu course sẽ cascade lưu section
            } else {
                targetSection = course.getSections().get(0);
            }
        }

        // 4. Tạo Entity Video
        Video video = new Video();
        video.setCourse(course);
        video.setSection(targetSection);
        video.setTitle(title);
        video.setDurationInSeconds(duration != null ? duration : 0);
        // URL tạm thời (sẽ được HLS service update sau khi cắt xong)
        video.setVideoUrl("/uploads/temp/" + tempMp4Path.getFileName().toString());

        // Lưu Course (để đảm bảo Section được lưu nếu mới tạo)
        courseRepository.save(course);

        // Lưu Video
        Video savedVideo = videoRepository.save(video);

        // 5. Gọi Async Service để cắt video HLS
        hlsService.processVideoAsync(savedVideo.getId(), tempMp4Path, fileNameWithoutExt);

        return convertToResponseDTO(savedVideo);
    }

    @Override
    public void deleteVideo(Long videoId, String teacherEmail) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new RuntimeException("Video không tồn tại"));
        checkTeacherOwnership(video.getCourse().getId(), teacherEmail);
        videoRepository.delete(video);
    }

    @Override
    public List<VideoResponseDTO> getVideosForCourse(Long courseId, String userEmail, String userRole) {
        // Logic kiểm tra quyền xem video (Teacher hoặc Student đã mua)
        // Tạm thời trả về hết để test
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));

        return videoRepository.findByCourse(course).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    // --- Helper Methods ---

    private Course checkTeacherOwnership(Long courseId, String teacherEmail) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Khóa học không tồn tại"));
        if (!course.getTeacherEmail().equals(teacherEmail)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa khóa học này.");
        }
        return course;
    }

    private Path saveTempFile(MultipartFile file) throws IOException {
        String uniqueFileName = UUID.randomUUID().toString();
        Path tempDir = Paths.get("uploads/temp");
        if (!Files.exists(tempDir)) {
            Files.createDirectories(tempDir);
        }
        // Lưu file với tên UUID.mp4
        Path tempFilePath = tempDir.resolve(uniqueFileName + ".mp4");
        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, tempFilePath, StandardCopyOption.REPLACE_EXISTING);
        }
        return tempFilePath;
    }

    private VideoResponseDTO convertToResponseDTO(Video video) {
        VideoResponseDTO dto = new VideoResponseDTO();
        dto.setId(video.getId());
        dto.setTitle(video.getTitle());
        dto.setVideoUrl(video.getVideoUrl());
        dto.setDurationInSeconds(video.getDurationInSeconds());
        if (video.getCourse() != null) {
            dto.setCourseId(video.getCourse().getId());
        }
        return dto;
    }
}