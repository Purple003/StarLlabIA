package com.example.orchestrator_service;

import org.springframework.boot.SpringApplication;

public class TestOrchestratorServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(OrchestratorServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
