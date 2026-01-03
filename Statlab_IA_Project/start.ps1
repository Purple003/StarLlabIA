# Script PowerShell pour démarrer StatLabIA Microservices

Write-Host "🚀 Démarrage de StatLabIA Microservices..." -ForegroundColor Cyan

# Vérifier que Docker est en cours d'exécution
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop." -ForegroundColor Red
    exit 1
}

# Démarrer les services
Write-Host "📦 Démarrage des services avec Docker Compose..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "⏳ Attente du démarrage des services..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Vérifier les services
Write-Host "🔍 Vérification des services..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "✅ Services démarrés!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Consul UI: http://localhost:8500"
Write-Host "  - API Gateway: http://localhost:8080"
Write-Host "  - Analysis Service: http://localhost:8000"
Write-Host "  - Auth Service: http://localhost:8081"
Write-Host "  - Dataset Service: http://localhost:8082"
Write-Host "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
Write-Host ""
Write-Host "📊 Voir les logs: docker-compose logs -f [service-name]"
Write-Host "🛑 Arrêter les services: docker-compose down"


