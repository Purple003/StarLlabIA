package com.example.api_gatway.security;

import com.ecwid.consul.v1.ConsulClient;
import org.springframework.cloud.consul.discovery.ConsulDiscoveryProperties;
import org.springframework.cloud.consul.discovery.reactive.ConsulReactiveDiscoveryClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class ConsulConfig {

    // Client réactif pour la découverte de services
    @Bean
    @Primary
    public ConsulReactiveDiscoveryClient consulReactiveDiscoveryClient(
            ConsulClient consulClient,
            ConsulDiscoveryProperties discoveryProperties) {
        return new ConsulReactiveDiscoveryClient(consulClient, discoveryProperties);
    }
}
