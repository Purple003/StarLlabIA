from minio import Minio
import os

client = Minio(
    "minio:9000",
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False
)

bucket_name = "datasets"
clean_bucket_name = "datasets-cleaned"

if not client.bucket_exists(clean_bucket_name):
    client.make_bucket(clean_bucket_name)
    print(f"Bucket {clean_bucket_name} créé")

objects = list(client.list_objects(bucket_name, recursive=True))
print(f"{len(objects)} fichiers trouvés dans le bucket {bucket_name}")

def clean_file(file_path):
    cleaned_lines = []
    with open(file_path, "r") as f:
        for line in f:
            if line.strip():
                cleaned_lines.append(line)
    return cleaned_lines


def download_file(bucket_name, object_name, file_path):
    """Télécharge un fichier depuis MinIO vers le chemin local"""
    client.fget_object(bucket_name, object_name, file_path)
    print(f"{object_name} téléchargé dans {file_path}")



def upload_file(bucket_name, object_name, file_path):
    """Upload un fichier local vers un bucket MinIO"""
    client.fput_object(bucket_name, object_name, file_path)
    print(f"{object_name} uploadé vers {bucket_name}")
    return f"{bucket_name}/{object_name}"


for obj in objects:
    print("Traitement de :", obj.object_name)
    
    tmp_file = f"/tmp/{obj.object_name.replace('/', '_')}"
    client.fget_object(bucket_name, obj.object_name, tmp_file)
    print(f"{obj.object_name} téléchargé dans {tmp_file}")
    
    cleaned_content = clean_file(tmp_file)
    
    cleaned_file_path = f"/tmp/cleaned_{obj.object_name.replace('/', '_')}"
    with open(cleaned_file_path, "w") as f:
        f.writelines(cleaned_content)
    
    client.fput_object(clean_bucket_name, obj.object_name, cleaned_file_path)
    print(f"{obj.object_name} traité et envoyé vers {clean_bucket_name}")
