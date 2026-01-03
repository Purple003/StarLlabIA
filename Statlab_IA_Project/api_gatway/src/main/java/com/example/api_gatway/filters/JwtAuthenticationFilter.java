package com.example.api_gatway.filters;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import reactor.core.publisher.Mono;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.function.Function;

@Slf4j
@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Value("${jwt.secret:StatLabIA-Super-Secret-Key-For-JWT-2024}")
    private String jwtSecret;

    public JwtAuthenticationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // Vérifier si c'est une route publique
            if (isPublicRoute(request.getPath().toString())) {
                return chain.filter(exchange);
            }

            // Récupérer le token depuis le header
            String token = extractToken(request);

            if (token == null) {
                return onError(exchange, "Missing authorization token", HttpStatus.UNAUTHORIZED);
            }

            try {
                // Valider le token
                if (!validateToken(token)) {
                    return onError(exchange, "Invalid or expired token", HttpStatus.UNAUTHORIZED);
                }

                // Extraire les claims
                Claims claims = extractAllClaims(token);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                String userId = claims.get("userId", String.class);

                // Ajouter les headers pour les services en aval
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", userId)
                        .header("X-User-Email", username)
                        .header("X-User-Role", role)
                        .build();

                log.debug("User authenticated: {} ({}), role: {}", username, userId, role);

                return chain.filter(exchange.mutate().request(modifiedRequest).build());

            } catch (Exception e) {
                log.error("JWT validation error: {}", e.getMessage());
                return onError(exchange, "Invalid token format", HttpStatus.UNAUTHORIZED);
            }
        };
    }

    private boolean isPublicRoute(String path) {
        return path.startsWith("/api/auth/") ||
                path.equals("/actuator/health") ||
                path.startsWith("/v3/api-docs") ||
                path.startsWith("/swagger-ui");
    }

    private String extractToken(ServerHttpRequest request) {
        String bearerToken = request.getHeaders().getFirst("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        // Vérifier aussi dans les query parameters (pour WebSocket)
        String tokenParam = request.getQueryParams().getFirst("token");
        if (StringUtils.hasText(tokenParam)) {
            return tokenParam;
        }

        return null;
    }

    private boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));

            return !isTokenExpired(token, key);
        } catch (Exception e) {
            return false;
        }
    }

    private Boolean isTokenExpired(String token, SecretKey key) {
        Date expiration = extractExpiration(token, key);
        return expiration.before(new Date());
    }

    private Date extractExpiration(String token, SecretKey key) {
        return extractClaim(token, key, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, SecretKey key, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token, key);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        return extractAllClaims(token, key);
    }

    private Claims extractAllClaims(String token, SecretKey key) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Mono<Void> onError(org.springframework.web.server.ServerWebExchange exchange,
                               String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().add("Content-Type", "application/json");

        String jsonError = String.format("{\"error\": \"%s\", \"timestamp\": \"%s\"}",
                err, new Date());

        DataBuffer buffer = response.bufferFactory()
                .wrap(jsonError.getBytes(StandardCharsets.UTF_8));

        return response.writeWith(Mono.just(buffer));
    }

    public static class Config {
        // Configuration properties if needed
    }
}
