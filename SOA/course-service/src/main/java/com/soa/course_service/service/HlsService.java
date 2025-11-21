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
        log.info(">>> BẮT ĐẦU XỬ LÝ VIDEO ID: {}", videoId);
        log.info(">>> File gốc: {}", inputFilePath.toAbsolutePath());

        try {
            // 1. Kiểm tra file đầu vào
            if (!Files.exists(inputFilePath)) {
                log.error("❌ LỖI: Không tìm thấy file đầu vào tại {}", inputFilePath);
                return;
            }

            // 2. Tạo thư mục đầu ra (uploads/hls/{ten_file}/)
            String outputDir = "uploads/hls";
            Path outputFolderPath = Paths.get(outputDir, fileNameWithoutExt);
            if (!Files.exists(outputFolderPath)) {
                Files.createDirectories(outputFolderPath);
            }

            // Đường dẫn file manifest (.m3u8)
            String absoluteOutputPath = outputFolderPath.resolve("index.m3u8").toAbsolutePath().toString();
            String absoluteInputPath = inputFilePath.toAbsolutePath().toString();
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "ffmpeg",
                    "-i", absoluteInputPath,
                    "-codec:", "copy", // Copy stream, không encode lại (nhanh hơn)
                    "-start_number", "0", // Segment bắt đầu từ 0
                    "-hls_time", "10", // Độ dài mỗi segment khoảng 10s
                    "-hls_list_size", "0", // Giữ tất cả segment trong playlist
                    "-f", "hls", // Format HLS
                    absoluteOutputPath);

            processBuilder.redirectErrorStream(true);

            // 4. Thực thi lệnh
            Process process = processBuilder.start();

            // Đọc log từ FFmpeg (để debug nếu cần)
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    // log.debug(line); // Bật lên nếu muốn xem log chi tiết của FFmpeg
                }
            }

            int exitCode = process.waitFor();

            if (exitCode == 0) {
                log.info("✅ CẮT VIDEO THÀNH CÔNG!");

                // 5. Cập nhật URL HLS vào Database
                // URL sẽ là: /hls/{ten_folder}/index.m3u8
                String hlsUrl = "/hls/" + fileNameWithoutExt + "/index.m3u8";

                Video video = videoRepository.findById(videoId).orElse(null);
                if (video != null) {
                    video.setVideoUrl(hlsUrl);
                    videoRepository.save(video);
                    log.info(">>> Đã cập nhật URL vào Database: {}", hlsUrl);
                }

                // 6. Xóa file MP4 gốc để tiết kiệm dung lượng
                Files.deleteIfExists(inputFilePath);
            } else {
                log.error("❌ FFmpeg thất bại với mã lỗi: {}", exitCode);
            }

        } catch (Exception e) {
            log.error("❌ LỖI JAVA EXCEPTION KHI XỬ LÝ VIDEO:", e);
        }
    }
}