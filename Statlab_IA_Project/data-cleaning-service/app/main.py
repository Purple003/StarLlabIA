from kafka import KafkaConsumer
from app.minio_client import download_file, upload_file, list_files
from app.cleaner import is_valid_file, clean_dataset
import os

consumer = KafkaConsumer(
    "file_uploaded",
    bootstrap_servers=os.getenv("KAFKA_BROKER", "kafka:9092"),
    auto_offset_reset="earliest",
    group_id="data-cleaning-group"
)

for message in consumer:
    file_name = message.value.decode()
    if not is_valid_file(file_name):
        print(f"Skipping invalid file: {file_name}")
        continue

    local_path = f"/tmp/{file_name}"
    download_file(file_name, local_path)
    clean_dataset(local_path)
    upload_file(local_path, file_name)
    print(f"Processed and uploaded: {file_name}")
