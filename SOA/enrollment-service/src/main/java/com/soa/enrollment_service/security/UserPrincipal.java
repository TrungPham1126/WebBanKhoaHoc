package com.soa.enrollment_service.security; // 🔥 Đổi package cho đúng với service

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore; // Tùy chọn nếu dùng Jackson

import java.util.Collection;

public class UserPrincipal implements UserDetails {
    private Long id;
    private String email;

    // Authorities (Roles) từ JWT
    private Collection<? extends GrantedAuthority> authorities;

    public UserPrincipal(Long id, String email, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.email = email;
        this.authorities = authorities;
    }

    // 🔥 Getter quan trọng để Controller lấy ID
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return null; // Không cần password vì dùng JWT
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}