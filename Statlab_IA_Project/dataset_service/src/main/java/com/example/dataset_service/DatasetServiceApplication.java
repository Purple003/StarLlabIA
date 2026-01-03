package com.example.dataset_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;

@SpringBootApplication
@EnableReactiveMongoRepositories(basePackages = "com.example.dataset_service.repository")

public class DatasetServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DatasetServiceApplication.class, args);
	}

}
