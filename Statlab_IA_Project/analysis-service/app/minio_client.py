from minio import Minio

client = Minio(
    "minio:9000",
    access_key="minioadmin",
    secret_key="minioadmin",
    secure=False
)

def download_file(filename, local_path, bucket="datasets-cleaned"):
    client.fget_object(bucket, filename, local_path)
