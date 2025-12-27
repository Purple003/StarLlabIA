package com.example.dataset_service.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import lombok.RequiredArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.core.io.buffer.DataBufferUtils;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;
    private final String bucketName = "datasets";
    private final String minioUrl = "http://localhost:9000";

    public Mono<String> uploadFile(FilePart filePart) {
        return DataBufferUtils.join(filePart.content())
                .flatMap(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    DataBufferUtils.release(dataBuffer);

                    InputStream inputStream = new ByteArrayInputStream(bytes);

                    try {
                        minioClient.putObject(
                                PutObjectArgs.builder()
                                        .bucket(bucketName)
                                        .object(filePart.filename())
                                        .stream(inputStream, bytes.length, -1)
                                        .contentType(filePart.headers().getContentType().toString())
                                        .build()
                        );
                    } catch (Exception e) {
                        return Mono.error(e);
                    }

                    return Mono.just(minioUrl + "/" + bucketName + "/" + filePart.filename());
                });
    }
}
