package com.example.api_gatway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.server.ServerResponse;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/fallback")
public class FallbackController {

    @RequestMapping("/auth")
    public Mono<Map<String, Object>> authFallback() {
        return Mono.just(createFallbackResponse("Authentication Service is temporarily unavailable"));
    }

    @RequestMapping("/default")
    public Mono<Map<String, Object>> defaultFallback() {
        return Mono.just(createFallbackResponse("Service is temporarily unavailable"));
    }

    private Map<String, Object> createFallbackResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("error", "Service Unavailable");
        response.put("message", message);
        response.put("recovery", "Please try again in a few moments");
        return response;
    }

    @GetMapping("/circuit-breaker-open")
    public Mono<ServerResponse> circuitBreakerOpen() {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        response.put("error", "Circuit Breaker Open");
        response.put("message", "Too many failed requests. Circuit breaker is open.");

        return ServerResponse
                .status(HttpStatus.SERVICE_UNAVAILABLE)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(response);
    }
}