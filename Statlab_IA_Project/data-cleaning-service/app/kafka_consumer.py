from kafka import KafkaConsumer, KafkaProducer, errors
import threading
import json
import os
import time
from app.minio_client import download_file, upload_file
from app.cleaner import clean_dataset, is_valid_file

# Configuration Kafka
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "kafka:9092")

# Attendre que Kafka soit prêt
while True:
    try:
        producer_test = KafkaProducer(bootstrap_servers=[KAFKA_BROKER])
        producer_test.close()
        print("Kafka est prêt !")
        break
    except errors.NoBrokersAvailable:
        print("Attente de Kafka...")
        time.sleep(3)


def start_consumer():
    print("Démarrage du consumer...")

    # Création du consumer
    consumer = KafkaConsumer(
        'file_uploaded',
        bootstrap_servers=[KAFKA_BROKER],
        auto_offset_reset='earliest',
        group_id='data-cleaning-group',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    # Création du producer
    producer = KafkaProducer(
        bootstrap_servers=[KAFKA_BROKER],
        value_serializer=lambda m: json.dumps(m).encode('utf-8')
    )

    print("Connected to Kafka broker, ready to consume messages")

    for message in consumer:
        data = message.value

        # Identifier le nom du fichier
        if isinstance(data, str):
            filename = data
        elif isinstance(data, dict) and "filename" in data:
            filename = data["filename"]
        else:
            print(f"Skipped message: {data}")
            continue

        # Vérifier extension valide
        if not is_valid_file(filename):
            print(f"Skipped file {filename}: invalid extension")
            continue

        local_path = f"/tmp/{filename}"

        try:
            # Télécharger depuis MinIO
            download_file(filename, local_path)

            # Nettoyer le fichier
            clean_dataset(local_path)

            # Ré-upload sur MinIO
            clean_filename = f"cleaned_{filename}"
            clean_url = upload_file(local_path, clean_filename)

            # Envoyer événement Kafka
            producer.send("data_cleaned", {
                "original": filename,
                "cleaned": clean_filename,
                "url": clean_url
            })

            print(f"Processed {filename} -> {clean_filename}")

        except Exception as e:
            print(f"Error processing {filename}: {e}")


if __name__ == "__main__":
    t = threading.Thread(target=start_consumer, daemon=True)
    t.start()
    t.join()
