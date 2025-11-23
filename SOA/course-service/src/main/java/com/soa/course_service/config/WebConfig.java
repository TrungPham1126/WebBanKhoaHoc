package com.soa.course_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

        @Override
        public void addResourceHandlers(ResourceHandlerRegistry registry) {

                String uploadPath = Paths.get("uploads").toFile().getAbsolutePath();

                registry.addResourceHandler("/hls/**")
                                .addResourceLocations("file:" + uploadPath + "/hls/");
                registry.addResourceHandler("/exercises/**")
                                .addResourceLocations("file:" + uploadPath + "/exercises/");

                registry.addResourceHandler("/images/**")
                                .addResourceLocations("file:" + uploadPath + "/images/");
        }
}