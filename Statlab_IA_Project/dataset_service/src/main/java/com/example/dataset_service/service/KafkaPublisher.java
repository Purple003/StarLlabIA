package com.example.dataset_service.service;

import com.example.dataset_service.dto.DatasetUploadedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.stream.function.StreamBridge;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaPublisher {

    private final StreamBridge streamBridge;

    public void publishDatasetUploaded(DatasetUploadedEvent event) {
        // "fileUploaded-out-0" correspond au binding défini dans application.yml
        streamBridge.send("fileUploaded-out-0", event);
    }
}