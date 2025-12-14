package com.soa.course_service.repository;

import com.soa.course_service.entity.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {

    // Tìm danh sách ID các video mà user này đã học xong trong 1 khóa học cụ thể
    // (Join bảng video để lọc theo courseId)
    @Query("SELECT ulp.videoId FROM UserLessonProgress ulp " +
            "WHERE ulp.userId = :userId AND ulp.videoId IN " +
            "(SELECT v.id FROM Video v WHERE v.course.id = :courseId)")
    Set<Long> findCompletedVideoIdsByCourse(Long userId, Long courseId);

    // Kiểm tra đã học chưa
    boolean existsByUserIdAndVideoId(Long userId, Long videoId);
}