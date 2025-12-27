from kafka import KafkaConsumer, KafkaProducer
import threading
import json
import os
from app.minio_client import download_file, upload_file
from app.cleaner import clean_dataset, is_valid_file

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")

def consume():
    consumer = KafkaConsumer(
        "file_uploaded",
        bootstrap_servers=[KAFKA_BROKER],
        auto_offset_reset="earliest",
        group_id="data-cleaning-group",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )

    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BROKER],
        value_serializer=lambda m: json.dumps(m).encode("utf-8")
    )

    for message in consumer:
        data = message.value
        filename = data["filename"]
        
        # Vérification extension
        if not is_valid_file(filename):
            print(f"Skipped file {filename}: invalid extension")
            continue

        local_path = f"/tmp/{filename}"
        
        # Télécharger depuis MinIO
        download_file(filename, local_path)
        
        # Nettoyer
        clean_dataset(local_path)
        
        # Ré-upload
        clean_filename = f"cleaned_{filename}"
        clean_url = upload_file(local_path, clean_filename)
        
        # Émettre événement Kafka
        producer.send("data_cleaned", {
            "original": filename,
            "cleaned": clean_filename,
            "url": clean_url
        })
        print(f"Processed {filename} -> {clean_filename}")
