package com.soa.user_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Tên vai trò, ví dụ: "ROLE_STUDENT"
    @Enumerated(EnumType.STRING) // Lưu tên Enum dưới dạng String
    @Column(length = 20, unique = true, nullable = false)
    private ERole name;

    // Constructors, Getters, Setters...

    // Constructor tiện lợi
    public Role() {
    }

    public Role(ERole name) {
        this.name = name;
    }

    // Getters và Setters
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