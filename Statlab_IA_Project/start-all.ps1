# Script de demarrage automatique pour StatLabIA Microservices
# Usage: .\start-all.ps1

Write-Host "Demarrage de StatLabIA Microservices..." -ForegroundColor Cyan

# 1. Verifier Docker
Write-Host "Verification de Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "[OK] Docker est demarre" -ForegroundColor Green
} catch {
    Write-Host "[ERREUR] Docker n'est pas demarre! Veuillez demarrer Docker Desktop." -ForegroundColor Red
    exit 1
}

# 2. Changer de repertoire
$projectPath = "C:\Users\PC\Desktop\last\Statlab_IA_Project"
if (Test-Path $projectPath) {
    Set-Location $projectPath
} else {
    Write-Host "[ERREUR] Repertoire du projet non trouve: $projectPath" -ForegroundColor Red
    exit 1
}

# 3. Arreter les services existants
Write-Host "Arret des services existants..." -ForegroundColor Yellow
docker-compose down 2>$null

# 4. Demarrer l'infrastructure
Write-Host "Demarrage de l'infrastructure Docker..." -ForegroundColor Yellow
docker-compose up -d consul redis postgres-auth mongodb minio zookeeper kafka

# 5. Attendre que l'infrastructure soit prete
Write-Host "Attente du demarrage de l'infrastructure (30 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 6. Verifier le statut de l'infrastructure
Write-Host "Verification du statut de l'infrastructure..." -ForegroundColor Yellow
docker-compose ps

# 7. Demarrer Analysis Service
Write-Host "Demarrage de Analysis Service..." -ForegroundColor Yellow
docker-compose up -d analysis-service

# 8. Attendre un peu plus
Write-Host "Attente supplementaire (20 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# 9. Verification finale
Write-Host ""
Write-Host "[OK] Infrastructure demarree!" -ForegroundColor Green
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Consul UI: http://localhost:8500"
Write-Host "  - API Gateway: http://localhost:8080 (a lancer depuis IntelliJ)"
Write-Host "  - Analysis Service: http://localhost:8000"
Write-Host "  - Auth Service: http://localhost:8081 (a lancer depuis IntelliJ)"
Write-Host "  - Dataset Service: http://localhost:8082 (a lancer depuis IntelliJ)"
Write-Host "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Yellow
Write-Host "  1. Ouvrir IntelliJ IDEA"
Write-Host "  2. Lancer Dataset Service depuis IntelliJ"
Write-Host "  3. Lancer Auth Service depuis IntelliJ"
Write-Host "  4. Lancer API Gateway depuis IntelliJ"
Write-Host ""
Write-Host "Verifier les services dans Consul: http://localhost:8500" -ForegroundColor Cyan
