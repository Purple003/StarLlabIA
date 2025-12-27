package com.example.api_gatway.filters;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Component
public class RequestLoggingFilter
        extends AbstractGatewayFilterFactory<RequestLoggingFilter.Config> {

    public RequestLoggingFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            Instant start = Instant.now();
            ServerHttpRequest request = exchange.getRequest();

            String requestId = request.getId();
            String method = request.getMethod() != null ? request.getMethod().name() : "UNKNOWN";
            String path = request.getPath().value();
            String remoteAddress = request.getRemoteAddress() != null
                    ? request.getRemoteAddress().toString()
                    : "unknown";

            // 🔹 Log requête entrante
            log.info("Incoming request: {} {} from {} [ID: {}]",
                    method, path, remoteAddress, requestId);

            return chain.filter(exchange)
                    .doOnError(e -> {
                        // 🔴 Log erreur
                        Instant end = Instant.now();
                        Duration duration = Duration.between(start, end);

                        int status = exchange.getResponse().getStatusCode() != null
                                ? exchange.getResponse().getStatusCode().value()
                                : 500;

                        log.error("Request failed: {} {} - Status: {} - Duration: {}ms [ID: {}] - Error: {}",
                                method, path, status, duration.toMillis(), requestId, e.getMessage());
                    })
                    .doOnSuccess(v -> {
                        // 🟢 Log succès
                        Instant end = Instant.now();
                        Duration duration = Duration.between(start, end);

                        int status = exchange.getResponse().getStatusCode() != null
                                ? exchange.getResponse().getStatusCode().value()
                                : 200;

                        log.info("Request completed: {} {} - Status: {} - Duration: {}ms [ID: {}]",
                                method, path, status, duration.toMillis(), requestId);
                    });
        };
    }

    // ================= CONFIG =================
    public static class Config {
        private boolean logHeaders = false;

        public boolean isLogHeaders() {
            return logHeaders;
        }

        public void setLogHeaders(boolean logHeaders) {
            this.logHeaders = logHeaders;
        }
    }
}
