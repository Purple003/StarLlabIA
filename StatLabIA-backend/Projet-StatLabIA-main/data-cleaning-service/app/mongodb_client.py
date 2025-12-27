from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/")
DB_NAME = os.getenv("MONGO_DB", "stattlabDB")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_dataset_by_filename(filename):
    return db.StatLabdb.find_one({"filename": filename})
