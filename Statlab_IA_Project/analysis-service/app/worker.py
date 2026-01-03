import os
import json
from kafka import KafkaConsumer, KafkaProducer
from app.minio_client import download_file
from app.analysis import analyze_file

KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")
INPUT_TOPIC = "data_cleaned"
OUTPUT_TOPIC = "analysis_results"
BUCKET_NAME = "datasets-cleaned"

consumer = KafkaConsumer(
    INPUT_TOPIC,
    bootstrap_servers=KAFKA_BROKER,
    auto_offset_reset="earliest",
    enable_auto_commit=True,
    group_id="analysis-service-group",
    value_deserializer=lambda x: json.loads(x.decode("utf-8"))
)

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

print("🚀 Analysis Worker started, waiting for messages...")

for message in consumer:
    try:
        filename = message.value["cleaned"]
        print(f"📥 Received file: {filename}")

        local_path = f"/tmp/{filename}"
        download_file(bucket=BUCKET_NAME, object_name=filename, file_path=local_path)
        print(f"⬇️ Downloaded {filename} to {local_path}")

        result = analyze_file(local_path)
        print(f"🧮 Analysis done for {filename}")

        producer.send(OUTPUT_TOPIC, {"filename": filename, "result": result})
        producer.flush()
        print(f"✅ Sent results for {filename} to topic {OUTPUT_TOPIC}")

    except Exception as e:
        print(f"❌ Error processing {message.value}: {e}")
