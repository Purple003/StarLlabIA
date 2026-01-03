# app/utils.py

ALLOWED_EXTENSIONS = ['.csv', '.xlsx']

def is_valid_file(filename: str) -> bool:
    return any(filename.endswith(ext) for ext in ALLOWED_EXTENSIONS)
