package com.example.auth_service.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String role; // facultatif, tu peux mettre USER par défaut
}
