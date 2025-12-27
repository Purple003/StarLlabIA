import pandas as pd
import os

ALLOWED_EXTENSIONS = ["csv", "xlsx", "json"]

def is_valid_file(filename):
    ext = filename.split('.')[-1].lower()
    return ext in ALLOWED_EXTENSIONS

def clean_dataset(file_path):
    ext = file_path.split('.')[-1].lower()
    
    if ext == "csv":
        df = pd.read_csv(file_path)
    elif ext == "xlsx":
        df = pd.read_excel(file_path)
    elif ext == "json":
        df = pd.read_json(file_path)
    else:
        raise ValueError("Unsupported file type")
    
    # Nettoyage basique
    df.dropna(axis=1, how='all', inplace=True)
    df.drop_duplicates(inplace=True)
    df.fillna(pd.NA, inplace=True)
    
    # Réécriture sur le même fichier
    if ext == "csv":
        df.to_csv(file_path, index=False)
    elif ext == "xlsx":
        df.to_excel(file_path, index=False)
    elif ext == "json":
        df.to_json(file_path, orient='records')
    
    return df
