package com.soa.user_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, unique = true)
    private ERole name; // Tên Role (ROLE_STUDENT, ROLE_TEACHER, ...)

    // 🔥 Constructor rỗng BẮT BUỘC cho Hibernate
    public Role() {
    }

    // Constructor dùng trong DataSeeder cũ của bạn, nên giữ lại nếu bạn dùng nó ở
    // nơi khác
    public Role(ERole name) {
        this.name = name;
    }

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }
}