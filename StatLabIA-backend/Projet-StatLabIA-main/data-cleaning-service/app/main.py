from fastapi import FastAPI
from app.kafka_consumer import consume
import threading

app = FastAPI(title="Data Cleaning Service")

# Lancer le consumer Kafka dans un thread séparé
threading.Thread(target=consume, daemon=True).start()

@app.get("/")
def home():
    return {"message": "Data Cleaning Service running, listening to Kafka events."}
