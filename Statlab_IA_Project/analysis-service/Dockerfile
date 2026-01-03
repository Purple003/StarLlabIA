# ------------------------------
# Dockerfile pour Analysis Service
# ------------------------------

# 1️⃣ Image de base Python slim
FROM python:3.11-slim

# 2️⃣ Installer curl pour healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# 3️⃣ Définir le répertoire de travail
WORKDIR /app

# 3️⃣ Copier les fichiers de dépendances
COPY requirements.txt .

# 4️⃣ Installer les dépendances avec timeout augmenté et sans cache
RUN pip install --upgrade pip \
    && pip install --default-timeout=300 --no-cache-dir -r requirements.txt

# 5️⃣ Copier le code source dans le conteneur
COPY ./app ./app

# 6️⃣ Exposer le port FastAPI
EXPOSE 8000

# 7️⃣ Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 8️⃣ Définir la commande par défaut
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# 8️⃣ Optionnel : pour worker Kafka indépendant
# CMD ["python", "-m", "app.kafka_worker"]
