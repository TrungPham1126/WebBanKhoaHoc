package com.soa.course_service.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/hls")
public class HlsController {

    // ❗ ĐÚNG PATH generate HLS của bạn
    private static final String HLS_BASE_PATH = "D:/hls";

    @GetMapping("/{videoId}/{fileName}")
    public ResponseEntity<Resource> stream(
            @PathVariable String videoId,
            @PathVariable String fileName) throws Exception {

        Path path = Paths.get(HLS_BASE_PATH, videoId, fileName);

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new UrlResource(path.toUri());

        MediaType mediaType = fileName.endsWith(".m3u8")
                ? MediaType.parseMediaType("application/vnd.apple.mpegurl")
                : MediaType.parseMediaType("video/mp2t");

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(resource);
    }
}
