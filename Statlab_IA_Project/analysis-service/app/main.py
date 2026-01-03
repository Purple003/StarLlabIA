import os
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Analysis Service")

# Import Consul client for service registration
try:
    from app.consul_client import start_consul_registration, deregister_service
    import atexit
    atexit.register(deregister_service)
    start_consul_registration()
except Exception as e:
    print(f"⚠️ Consul registration skipped: {e}")

class FileRequest(BaseModel):
    filename: str

@app.get("/health")
async def health_check():
    """Health check endpoint for Consul"""
    return {"status": "healthy", "service": "analysis-service"}

@app.post("/analyze")
async def analyze_file(request: FileRequest):
    return {"status": "ok", "file": request.filename}
