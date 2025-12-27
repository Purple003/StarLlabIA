from kafka import KafkaProducer
import json
import os

# Lire les variables d'environnement pour Kafka
KAFKA_BROKER = os.environ.get("KAFKA_BROKER", "localhost:9092")
TOPIC = "file_uploaded"

producer = KafkaProducer(
    bootstrap_servers=KAFKA_BROKER,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

# Message simulant un fichier uploadé
message = {
    "filename": "employees.csv",
    "url": "http://minio:9000/datasets/employees.csv",
    "size": 1024
}

producer.send(TOPIC, message)
producer.flush()
print(f"Message envoyé sur le topic {TOPIC}")
