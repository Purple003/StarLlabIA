package com.example.dataset_service.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "datasets")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Dataset {

    @Id
    private String id;

    private String filename;
    private String uploadedBy;
    private LocalDateTime uploadDate;
    private long size; // en octets
    private String minioUrl; // URL du fichier dans MinIO
    private String url;
    private LocalDateTime uploadedAt;
}


