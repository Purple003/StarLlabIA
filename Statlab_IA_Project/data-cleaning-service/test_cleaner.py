from minio import Minio
import os

# Connexion à MinIO
client = Minio(
    "minio:9000",
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False
)

bucket_name = "datasets"
clean_bucket_name = "datasets-cleaned"

# Créer le bucket "cleaned" si il n'existe pas
if not client.bucket_exists(clean_bucket_name):
    client.make_bucket(clean_bucket_name)

# Fonction simple de nettoyage (exemple)
def clean_file(file_path):
    """
    Cette fonction lit un CSV, supprime les lignes vides et retourne le contenu nettoyé.
    """
    cleaned_lines = []
    with open(file_path, "r") as f:
        for line in f:
            if line.strip():  # Supprime les lignes vides
                cleaned_lines.append(line)
    return cleaned_lines

# Parcourir les fichiers du bucket source
for obj in client.list_objects(bucket_name, recursive=True):
    print("Traitement de :", obj.object_name)
    
    # Télécharger le fichier temporairement
    tmp_file = f"/tmp/{obj.object_name}"
    client.fget_object(bucket_name, obj.object_name, tmp_file)
    
    # Nettoyer le fichier
    cleaned_content = clean_file(tmp_file)
    
    # Sauvegarder le fichier nettoyé
    cleaned_file_path = f"/tmp/cleaned_{obj.object_name}"
    with open(cleaned_file_path, "w") as f:
        f.writelines(cleaned_content)
    
    # Uploader le fichier nettoyé vers le bucket "datasets-cleaned"
    client.fput_object(clean_bucket_name, obj.object_name, cleaned_file_path)
    
    print(f"{obj.object_name} traité et envoyé vers {clean_bucket_name}")
