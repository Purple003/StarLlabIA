package com.example.api_gatway.filters;

import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Slf4j
@Component
public class CustomRateLimiterFilter
        extends AbstractGatewayFilterFactory<CustomRateLimiterFilter.Config> {

    private final ReactiveStringRedisTemplate redisTemplate;

    public CustomRateLimiterFilter(ReactiveStringRedisTemplate redisTemplate) {
        super(Config.class);
        this.redisTemplate = redisTemplate;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            String clientIp = exchange.getRequest().getRemoteAddress() != null
                    ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                    : "unknown";

            String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
            String rateLimiterKey = userId != null ? userId : clientIp;

            String redisKey = "rate_limit:" + rateLimiterKey + ":" + config.getRouteId();

            return redisTemplate.opsForValue().get(redisKey)
                    .flatMap(currentCount -> {

                        long count = currentCount != null ? Long.parseLong(currentCount) : 0;

                        if (count >= config.getLimit()) {
                            log.warn("Rate limit exceeded for {} on route {}", rateLimiterKey, config.getRouteId());

                            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                            exchange.getResponse().getHeaders()
                                    .add("X-RateLimit-Limit", String.valueOf(config.getLimit()));
                            exchange.getResponse().getHeaders()
                                    .add("X-RateLimit-Remaining", "0");

                            return exchange.getResponse().setComplete();
                        }

                        return redisTemplate.opsForValue()
                                .increment(redisKey)
                                .flatMap(newCount -> {
                                    if (count == 0) {
                                        return redisTemplate.expire(redisKey, config.getWindow())
                                                .thenReturn(newCount);
                                    }
                                    return Mono.just(newCount);
                                })
                                .flatMap(newCount -> {
                                    exchange.getResponse().getHeaders()
                                            .add("X-RateLimit-Limit", String.valueOf(config.getLimit()));
                                    exchange.getResponse().getHeaders()
                                            .add("X-RateLimit-Remaining",
                                                    String.valueOf(config.getLimit() - newCount));

                                    return chain.filter(exchange);
                                });
                    })
                    .switchIfEmpty(Mono.defer(() ->
                            redisTemplate.opsForValue()
                                    .set(redisKey, "1", config.getWindow())
                                    .then(chain.filter(exchange))
                    ));
        };
    }

    // ================= CONFIG =================
    public static class Config {
        private String routeId;
        private int limit = 10;
        private Duration window = Duration.ofSeconds(60);

        public String getRouteId() {
            return routeId;
        }

        public void setRouteId(String routeId) {
            this.routeId = routeId;
        }

        public int getLimit() {
            return limit;
        }

        public void setLimit(int limit) {
            this.limit = limit;
        }

        public Duration getWindow() {
            return window;
        }

        public void setWindow(Duration window) {
            this.window = window;
        }
    }
}
