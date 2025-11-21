package com.soa.course_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Lấy đường dẫn tuyệt đối tới thư mục uploads trong project
        String uploadPath = Paths.get("uploads").toFile().getAbsolutePath();

        // Cấu hình: Khi truy cập /hls/** -> tìm trong thư mục uploads/hls/
        registry.addResourceHandler("/hls/**")
                .addResourceLocations("file:" + uploadPath + "/hls/");
        registry.addResourceHandler("/exercises/**")
                .addResourceLocations("file:" + uploadPath + "/exercises/");
        // Cấu hình cho ảnh
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadPath + "/images/");
    }
}