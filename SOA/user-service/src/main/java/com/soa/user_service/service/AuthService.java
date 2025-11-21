package com.soa.user_service.service;

import com.soa.user_service.dto.LoginRequestDTO;
import com.soa.user_service.dto.LoginResponseDTO;
import com.soa.user_service.dto.RegisterRequestDTO;
import com.soa.user_service.dto.UserResponseDTO;

public interface AuthService {
    UserResponseDTO registerStudent(RegisterRequestDTO registerRequest);

    UserResponseDTO registerTeacher(RegisterRequestDTO registerRequest);

    LoginResponseDTO loginUser(LoginRequestDTO loginRequest);
}