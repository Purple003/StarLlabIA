package com.example.dataset_service.Controller;

import com.example.dataset_service.entity.Dataset;
import com.example.dataset_service.service.DatasetService;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/datasets")
public class DatasetController {

    private final DatasetService datasetService;

    public DatasetController(DatasetService datasetService) {
        this.datasetService = datasetService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Mono<Dataset> upload(@RequestPart("file") FilePart file) {
        return datasetService.uploadDataset(file);
    }
}


