package com.example.dataset_service.repository;

import com.example.dataset_service.entity.Dataset;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatasetRepository extends ReactiveMongoRepository<Dataset, String> {
    // méthodes personnalisées si besoin
}
