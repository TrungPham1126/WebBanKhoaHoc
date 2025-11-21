package com.soa.course_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exercise_submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String studentEmail; // Email học viên nộp bài

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String answerText;

    private String answerFileUrl;

    private Double score;
    @Lob
    @Column(columnDefinition = "TEXT")
    private String teacherFeedback;

    private LocalDateTime submittedAt;

    @PrePersist
    protected void onCreate() {
        submittedAt = LocalDateTime.now();
    }
}