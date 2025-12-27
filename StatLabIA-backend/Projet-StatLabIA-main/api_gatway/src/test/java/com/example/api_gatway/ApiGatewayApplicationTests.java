package com.example.api_gatway;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.cloud.consul.serviceregistry.ConsulAutoServiceRegistration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.consul.ConsulContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
class ApiGatewayApplicationTests {

    @Container
    static ConsulContainer consul =
            new ConsulContainer("hashicorp/consul:1.15")
                    .withExposedPorts(8500);

    @DynamicPropertySource
    static void registerConsulProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.cloud.consul.host", consul::getHost);
        registry.add("spring.cloud.consul.port",
                () -> consul.getMappedPort(8500));
    }

    @Autowired
    private ConsulAutoServiceRegistration consulRegistration;

    @Test
    void contextLoads() {
        assertThat(consulRegistration).isNotNull();
    }

    @Test
    void consulRegistrationBeanIsCreated() {
        // On vérifie simplement que le bean est bien initialisé
        assertThat(consulRegistration).isNotNull();
    }
}
