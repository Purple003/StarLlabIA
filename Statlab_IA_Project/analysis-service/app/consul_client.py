import os
import requests
import socket
import time
import threading

CONSUL_HOST = os.getenv("CONSUL_HOST", "localhost")
CONSUL_PORT = os.getenv("CONSUL_PORT", "8500")
SERVICE_NAME = os.getenv("SERVICE_NAME", "analysis-service")
SERVICE_PORT = int(os.getenv("SERVICE_PORT", "8000"))
SERVICE_ID = os.getenv("SERVICE_ID", f"{SERVICE_NAME}-{socket.gethostname()}")

def get_local_ip():
    """Get local IP address"""
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except Exception:
        return "127.0.0.1"

def register_service():
    """Register this service with Consul"""
    consul_url = f"http://{CONSUL_HOST}:{CONSUL_PORT}/v1/agent/service/register"
    
    service_ip = get_local_ip()
    health_check_url = f"http://{service_ip}:{SERVICE_PORT}/health"
    
    service_def = {
        "ID": SERVICE_ID,
        "Name": SERVICE_NAME,
        "Tags": ["statlabia", "analysis", "python"],
        "Address": service_ip,
        "Port": SERVICE_PORT,
        "Check": {
            "HTTP": health_check_url,
            "Interval": "10s",
            "Timeout": "3s",
            "DeregisterCriticalServiceAfter": "30s"
        }
    }
    
    try:
        response = requests.put(consul_url, json=service_def, timeout=5)
        if response.status_code == 200:
            print(f"✅ Service {SERVICE_ID} registered with Consul at {CONSUL_HOST}:{CONSUL_PORT}")
            return True
        else:
            print(f"❌ Failed to register service: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"⚠️ Could not register with Consul: {e}. Service will continue without Consul registration.")
        return False

def deregister_service():
    """Deregister this service from Consul"""
    consul_url = f"http://{CONSUL_HOST}:{CONSUL_PORT}/v1/agent/service/deregister/{SERVICE_ID}"
    
    try:
        response = requests.put(consul_url, timeout=5)
        if response.status_code == 200:
            print(f"✅ Service {SERVICE_ID} deregistered from Consul")
        else:
            print(f"⚠️ Failed to deregister service: {response.status_code}")
    except Exception as e:
        print(f"⚠️ Could not deregister from Consul: {e}")

def keep_alive():
    """Periodically renew service registration"""
    while True:
        time.sleep(30)
        register_service()

_keep_alive_thread = None

def start_consul_registration():
    """Start Consul registration and keep-alive"""
    global _keep_alive_thread
    if os.getenv("CONSUL_AUTO_REGISTER", "true").lower() == "true":
        # Initial registration
        register_service()
        # Start keep-alive in background thread
        if _keep_alive_thread is None or not _keep_alive_thread.is_alive():
            _keep_alive_thread = threading.Thread(target=keep_alive, daemon=True)
            _keep_alive_thread.start()


