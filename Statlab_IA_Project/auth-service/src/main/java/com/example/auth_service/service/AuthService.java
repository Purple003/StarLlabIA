package com.example.auth_service.service;

import com.example.auth_service.config.JwtUtils;
import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    private final com.example.auth_service.repository.UserRepository userRepository;

    public LoginResponse authenticateUser(LoginRequest request) {
        log.debug("Authenticating user: {}", request.getUsername());
        try {
            // Simplified for MVP: just check if user exists and return mock token
            if (!userRepository.findByUsername(request.getUsername()).isPresent()) {
                throw new RuntimeException("User not found");
            }
            log.debug("User authenticated successfully: {}", request.getUsername());
            // Return mock token for MVP
            return new LoginResponse("mock-jwt-token-for-mvp");
        } catch (Exception e) {
            log.error("Authentication failed for user {}: {}", request.getUsername(), e.getMessage());
            throw e;
        }
    }

    public void registerUser(com.example.auth_service.dto.RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Error: Username is already taken!");
        }

        com.example.auth_service.entity.User user = com.example.auth_service.entity.User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : "USER")
                .build();

        userRepository.save(user);
    }
}
