package com.soa.course_service.service;

import com.soa.course_service.entity.Video;
import com.soa.course_service.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
@Slf4j
public class HlsService {

    private final VideoRepository videoRepository;

    @Async
    public void processVideoAsync(Long videoId, Path inputFilePath, String fileNameWithoutExt) {
        log.info(">>> BẮT ĐẦU XỬ LÝ VIDEO NGẦM ID: {}", videoId);

        try {
            if (!Files.exists(inputFilePath)) {
                log.error("❌ LỖI: Không tìm thấy file đầu vào tại {}", inputFilePath);
                updateStatus(videoId, "FAILED");
                return;
            }

            String outputDir = "uploads/hls";
            Path outputFolderPath = Paths.get(outputDir, fileNameWithoutExt);
            if (!Files.exists(outputFolderPath)) {
                Files.createDirectories(outputFolderPath);
            }

            String absoluteOutputPath = outputFolderPath.resolve("index.m3u8").toAbsolutePath().toString();
            String absoluteInputPath = inputFilePath.toAbsolutePath().toString();

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "ffmpeg",
                    "-i", absoluteInputPath,
                    "-codec:", "copy",
                    "-start_number", "0",
                    "-hls_time", "10",
                    "-hls_list_size", "0",
                    "-f", "hls",
                    absoluteOutputPath);

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                }
            }

            int exitCode = process.waitFor();

            if (exitCode == 0) {
                log.info(" CẮT VIDEO THÀNH CÔNG! ID: {}", videoId);
                String hlsUrl = "/hls/" + fileNameWithoutExt + "/index.m3u8";

                updateStatusAndUrl(videoId, "READY", hlsUrl);

                Files.deleteIfExists(inputFilePath);
            } else {
                log.error(" FFmpeg thất bại ID: {}", videoId);
                updateStatus(videoId, "FAILED");
            }

        } catch (Exception e) {
            log.error(" LỖI JAVA EXCEPTION:", e);
            updateStatus(videoId, "FAILED");
        }
    }

    private void updateStatus(Long videoId, String status) {
        Video video = videoRepository.findById(videoId).orElse(null);
        if (video != null) {
            video.setStatus(status);
            videoRepository.save(video);
        }
    }

    private void updateStatusAndUrl(Long videoId, String status, String url) {
        Video video = videoRepository.findById(videoId).orElse(null);
        if (video != null) {
            video.setStatus(status);
            video.setVideoUrl(url);
            videoRepository.save(video);
        }
    }
}