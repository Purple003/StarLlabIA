from minio import Minio
import os

# Config MinIO
MINIO_URL = os.getenv("MINIO_URL", "minio:9000")  # juste host:port
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY", "minioadmin")
MINIO_BUCKET = os.getenv("MINIO_BUCKET", "datasets")

# Création du client
client = Minio(
    endpoint=MINIO_URL,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

# Fonctions utilitaires
def download_file(object_name, local_path):
    client.fget_object(MINIO_BUCKET, object_name, local_path)

def upload_file(local_path, object_name):
    client.fput_object(MINIO_BUCKET, object_name, local_path)
    return f"{MINIO_URL}/{MINIO_BUCKET}/{object_name}"
