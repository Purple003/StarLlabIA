package com.example.dataset_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatasetUploadedEvent {
    private String datasetId;
    private String filename;
    private String bucket;
    private String url;
    private LocalDateTime uploadedAt;
}