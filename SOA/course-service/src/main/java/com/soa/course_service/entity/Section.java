package com.soa.course_service.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Section {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private Integer orderIndex;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    private List<Video> videos = new ArrayList<>();

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL)
    private List<Exercise> exercises = new ArrayList<>();
}