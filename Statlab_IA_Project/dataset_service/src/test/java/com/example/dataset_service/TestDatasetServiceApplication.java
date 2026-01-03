package com.example.dataset_service;

import org.springframework.boot.SpringApplication;

public class TestDatasetServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(DatasetServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
