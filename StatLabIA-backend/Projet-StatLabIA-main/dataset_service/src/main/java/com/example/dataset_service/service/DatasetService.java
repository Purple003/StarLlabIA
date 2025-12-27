package com.example.dataset_service.service;

import com.example.dataset_service.entity.Dataset;
import com.example.dataset_service.repository.DatasetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.http.codec.multipart.FilePart;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DatasetService {

    private final MinioService minioService;
    private final DatasetRepository datasetRepository;

    public Mono<Dataset> uploadDataset(FilePart filePart) {
        return minioService.uploadFile(filePart)
                .flatMap(url -> {
                    Dataset dataset = Dataset.builder()
                            .filename(filePart.filename())
                            .size(filePart.headers().getContentLength())
                            .url(url)
                            .uploadedAt(LocalDateTime.now())
                            .build();
                    return datasetRepository.save(dataset);
                });
    }
}
