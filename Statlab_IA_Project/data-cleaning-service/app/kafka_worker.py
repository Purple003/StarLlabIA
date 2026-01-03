import json
import os
import time
from kafka import KafkaConsumer, KafkaProducer
from app.minio_client import download_file, upload_file
from app.cleaner import clean_dataset

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
INPUT_TOPIC = "file_uploaded"
OUTPUT_TOPIC = "data_cleaned"

print("⏳ Waiting for Kafka...")

# Attendre Kafka
while True:
    try:
        KafkaProducer(bootstrap_servers=KAFKA_BROKER).close()
        print("✅ Kafka ready")
        break
    except Exception:
        time.sleep(3)

# Consumer
consumer = KafkaConsumer(
    INPUT_TOPIC,
    bootstrap_servers=KAFKA_BROKER,
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="data-cleaning-group",
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)

# Producer
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

producer.send("file_uploaded", {
    "filename": "employees.csv"
})
producer.flush()


print("🚀 Data Cleaning Worker started")

for message in consumer:
    try:
        filename = message.value["filename"]
        print(f"📥 Received file: {filename}")

        local_path = f"/tmp/{filename}"
        cleaned_name = f"cleaned_{filename}"

        # Télécharger depuis MinIO
        download_file(filename, local_path)
        print(f"⬇️ Downloaded {filename}")

        # Nettoyage
        clean_dataset(local_path)
        print(f"🧹 Cleaned {filename}")

        # Upload vers MinIO
        url = upload_file(local_path, cleaned_name)
        print(f"⬆️ Uploaded {cleaned_name}")

        # Publier événement Kafka
        producer.send(OUTPUT_TOPIC, {
            "original": filename,
            "cleaned": cleaned_name,
            "bucket": "datasets-cleaned",
            "url": url,
            "status": "success"
        })
        producer.flush()

        print(f"✅ Finished processing {filename}")

    except Exception as e:
        print(f"❌ Error processing file: {e}")


from app.minio_client import download_file, upload_file

download_file("datasets", "RH_performance.csv", "/tmp/RH_performance.csv")
upload_file("datasets-cleaned", "RH_performance.csv", "/tmp/cleaned_RH_performance.csv")
