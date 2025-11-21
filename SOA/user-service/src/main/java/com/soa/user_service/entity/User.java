package com.soa.user_service.entity;

import jakarta.persistence.*;
import lombok.*; // Import Lombok

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data // Tự sinh Getters, Setters, toString...
@NoArgsConstructor // Tự sinh Constructor rỗng (Bắt buộc cho JPA)
@AllArgsConstructor // Tự sinh Constructor có tham số
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phoneNumber;

    @Lob
    private String bio;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}