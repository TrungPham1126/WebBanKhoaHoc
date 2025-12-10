package com.soa.course_service.repository;

import com.soa.course_service.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Long> {
    // Tìm banner đang kích hoạt
    Optional<Banner> findByIsActiveTrue();

    // Reset tất cả banner về inactive (dùng khi kích hoạt banner mới)
    @Modifying
    @Query("UPDATE Banner b SET b.isActive = false")
    void disableAllBanners();
}