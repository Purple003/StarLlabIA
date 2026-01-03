package com.example.api_gatway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.client.discovery.composite.CompositeDiscoveryClientAutoConfiguration;

import org.springframework.cloud.client.discovery.simple.SimpleDiscoveryClientAutoConfiguration;

@SpringBootApplication(exclude = { CompositeDiscoveryClientAutoConfiguration.class,
        SimpleDiscoveryClientAutoConfiguration.class })
@EnableDiscoveryClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
