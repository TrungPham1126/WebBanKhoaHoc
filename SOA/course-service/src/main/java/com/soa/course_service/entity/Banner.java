package com.soa.course_service.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "banners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Banner {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title; // Tiêu đề lớn
    private String subtitle; // Dòng mô tả nhỏ
    private String buttonText; // Chữ trên nút (VD: Học ngay)
    private String buttonLink; // Link khi bấm nút
    private String imageUrl; // Đường dẫn ảnh

    private Boolean isActive = false; // Trạng thái kích hoạt (Chỉ 1 banner được true)
}