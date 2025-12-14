package com.soa.course_service.controller;

import com.soa.course_service.entity.Banner;
import com.soa.course_service.service.impl.BannerServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/banners")
@RequiredArgsConstructor
// 🔥 ĐÃ XÓA @CrossOrigin ĐỂ TRÁNH XUNG ĐỘT VỚI SECURITY CONFIG
public class BannerController {

    private final BannerServiceImpl bannerService;

    // Public: Lấy banner đang active để hiện trang chủ
    @GetMapping("/active")
    public ResponseEntity<Banner> getActive() {
        // 🔥 Gợi ý: Nếu không có banner nào active, trả về 204 No Content
        Banner banner = bannerService.getActiveBanner();
        if (banner == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(banner);
    }

    // Admin: Lấy danh sách
    @GetMapping
    public ResponseEntity<List<Banner>> getAll() {
        return ResponseEntity.ok(bannerService.getAllBanners());
    }

    // Admin: Tạo mới
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Banner> create(
            @RequestParam("title") String title,
            @RequestParam("subtitle") String subtitle,
            @RequestParam("buttonText") String buttonText,
            @RequestParam("buttonLink") String buttonLink,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        return ResponseEntity.ok(bannerService.createBanner(title, subtitle, buttonText, buttonLink, image));
    }

    // Admin: Kích hoạt banner
    @PutMapping("/{id}/activate")
    public ResponseEntity<Void> activate(@PathVariable Long id) {
        bannerService.activateBanner(id);
        return ResponseEntity.ok().build();
    }

    // Admin: Xóa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        bannerService.deleteBanner(id);
        return ResponseEntity.noContent().build();
    }
}