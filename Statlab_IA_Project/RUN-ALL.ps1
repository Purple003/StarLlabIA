# Script complet pour demarrer tous les services StatLabIA
# Usage: .\RUN-ALL.ps1

$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demarrage de StatLabIA Microservices" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Definir le chemin du projet
$projectRoot = "C:\Users\PC\Desktop\last\Statlab_IA_Project"
Set-Location $projectRoot

Write-Host "=== 1. Verification des ports utilises (8080, 8081, 8082) ===" -ForegroundColor Yellow
Write-Host ""

$ports = @(8080, 8081, 8082)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connections) {
        $pids = $connections | Select-Object -ExpandProperty OwningProcess -Unique
        Write-Host "ATTENTION: Port $port est utilise par les PIDs: $($pids -join ', ')" -ForegroundColor Yellow
        foreach ($pid in $pids) {
            $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "  -> Processus: $($process.ProcessName) (PID: $pid)" -ForegroundColor Yellow
            }
        }
        Write-Host "  Pour stopper: taskkill /PID $pid /F" -ForegroundColor Yellow
    } else {
        Write-Host "[OK] Port $port est libre" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Appuyez sur une touche pour continuer (ou Ctrl+C pour arreter)..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "=== 2. Stop et nettoyage Docker Compose ===" -ForegroundColor Yellow
docker-compose down
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=== 3. Build des images Docker ===" -ForegroundColor Yellow
docker-compose build --no-cache analysis-service auth-service dataset-service api-gateway

Write-Host ""
Write-Host "=== 4. Demarrage de l'infrastructure Docker ===" -ForegroundColor Yellow
docker-compose up -d consul redis postgres-auth mongodb minio zookeeper kafka

Write-Host ""
Write-Host "Attente du demarrage de l'infrastructure (30 secondes)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "=== 5. Verification des conteneurs Docker ===" -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "=== 6. Verification des services dependants ===" -ForegroundColor Yellow

# PostgreSQL
Write-Host "Verification PostgreSQL..." -ForegroundColor Cyan
try {
    docker exec postgres-auth psql -U authuser -d authdb -c "SELECT version();" 2>&1 | Out-Null
    Write-Host "[OK] PostgreSQL est accessible" -ForegroundColor Green
} catch {
    Write-Host "[ATTENTION] PostgreSQL peut ne pas etre pret" -ForegroundColor Yellow
}

# Consul
Write-Host "Verification Consul..." -ForegroundColor Cyan
try {
    $consulStatus = Invoke-RestMethod -Uri "http://localhost:8500/v1/status/leader" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "[OK] Consul est accessible" -ForegroundColor Green
} catch {
    Write-Host "[ATTENTION] Consul peut ne pas etre pret" -ForegroundColor Yellow
}

# MongoDB
Write-Host "Verification MongoDB..." -ForegroundColor Cyan
try {
    docker exec mongodb mongosh --eval "db.version()" 2>&1 | Out-Null
    Write-Host "[OK] MongoDB est accessible" -ForegroundColor Green
} catch {
    Write-Host "[ATTENTION] MongoDB peut ne pas etre pret" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 7. Demarrage de Analysis Service (Docker) ===" -ForegroundColor Yellow
docker-compose up -d analysis-service
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "=== 8. Demarrage des services Spring Boot ===" -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Les services suivants doivent etre lances depuis IntelliJ IDEA:" -ForegroundColor Cyan
Write-Host "  1. Dataset Service (port 8082)"
Write-Host "  2. Auth Service (port 8081)"
Write-Host "  3. API Gateway (port 8080)"
Write-Host ""
Write-Host "Voulez-vous les lancer depuis la ligne de commande maintenant? (O/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "O" -or $response -eq "o") {
    
    # Dataset Service
    Write-Host ""
    Write-Host "--- Demarrage Dataset Service ---" -ForegroundColor Cyan
    $datasetEnv = @{
        "CONSUL_HOST" = "localhost"
        "CONSUL_PORT" = "8500"
        "MONGODB_HOST" = "localhost"
        "MONGODB_PORT" = "27017"
        "MONGODB_DATABASE" = "stattlabDB"
        "KAFKA_BROKERS" = "localhost:9092"
        "MINIO_HOST" = "localhost"
        "MINIO_PORT" = "9000"
        "MINIO_ACCESS_KEY" = "minioadmin"
        "MINIO_SECRET_KEY" = "minioadmin"
        "SPRING_PROFILES_ACTIVE" = "dev"
    }
    
    Push-Location "$projectRoot\dataset_service"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:CONSUL_HOST='localhost'; `$env:CONSUL_PORT='8500'; `$env:MONGODB_HOST='localhost'; `$env:MONGODB_PORT='27017'; `$env:MONGODB_DATABASE='stattlabDB'; `$env:KAFKA_BROKERS='localhost:9092'; `$env:MINIO_HOST='localhost'; `$env:MINIO_PORT='9000'; `$env:SPRING_PROFILES_ACTIVE='dev'; .\mvnw spring-boot:run"
    Pop-Location
    Start-Sleep -Seconds 5
    
    # Auth Service
    Write-Host ""
    Write-Host "--- Demarrage Auth Service ---" -ForegroundColor Cyan
    Push-Location "$projectRoot\auth-service"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:CONSUL_HOST='localhost'; `$env:CONSUL_PORT='8500'; `$env:DB_HOST='localhost'; `$env:DB_PORT='5432'; `$env:DB_NAME='authdb'; `$env:DB_USER='authuser'; `$env:DB_PASSWORD='1234yasmine'; `$env:SERVER_PORT='8081'; `$env:SPRING_PROFILES_ACTIVE='dev'; .\mvnw spring-boot:run"
    Pop-Location
    Start-Sleep -Seconds 5
    
    # API Gateway
    Write-Host ""
    Write-Host "--- Demarrage API Gateway ---" -ForegroundColor Cyan
    Push-Location "$projectRoot\api_gatway"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "`$env:CONSUL_HOST='localhost'; `$env:CONSUL_PORT='8500'; `$env:REDIS_HOST='localhost'; `$env:REDIS_PORT='6379'; `$env:SERVER_PORT='8080'; `$env:SPRING_PROFILES_ACTIVE='dev'; .\mvnw spring-boot:run"
    Pop-Location
    
    Write-Host ""
    Write-Host "[INFO] Les services Spring Boot sont en cours de demarrage dans des fenetres PowerShell separees" -ForegroundColor Cyan
    Write-Host "[INFO] Attendez 60-90 secondes que les services demarrent completement" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "[INFO] Vous devrez lancer les services depuis IntelliJ IDEA" -ForegroundColor Cyan
    Write-Host "      Consultez GUIDE_INTELLIJ.md pour les instructions detaillees" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== 9. Attente du demarrage complet (60 secondes) ===" -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host ""
Write-Host "=== 10. Verification des services ===" -ForegroundColor Yellow

$endpoints = @(
    @{Url = "http://localhost:8000/health"; Name = "Analysis Service"},
    @{Url = "http://localhost:8082/actuator/health"; Name = "Dataset Service"},
    @{Url = "http://localhost:8081/actuator/health"; Name = "Auth Service"},
    @{Url = "http://localhost:8080/actuator/health"; Name = "API Gateway"}
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "[OK] $($endpoint.Name): Accessible (Status 200)" -ForegroundColor Green
        } else {
            Write-Host "[ATTENTION] $($endpoint.Name): Status $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[ERREUR] $($endpoint.Name): Non accessible (peut etre en cours de demarrage)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== 11. Verification Consul Service Discovery ===" -ForegroundColor Yellow
try {
    $services = Invoke-RestMethod -Uri "http://localhost:8500/v1/agent/services" -TimeoutSec 5
    Write-Host "[OK] Consul Service Discovery:" -ForegroundColor Green
    foreach ($serviceId in $services.PSObject.Properties.Name) {
        $service = $services.$serviceId
        Write-Host "  - $($service.Service) @ $($service.Address):$($service.Port)" -ForegroundColor White
    }
} catch {
    Write-Host "[ATTENTION] Impossible de recuperer les services depuis Consul" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services Docker:" -ForegroundColor Cyan
docker-compose ps
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Consul UI: http://localhost:8500"
Write-Host "  - API Gateway: http://localhost:8080"
Write-Host "  - Analysis Service: http://localhost:8000"
Write-Host "  - Auth Service: http://localhost:8081"
Write-Host "  - Dataset Service: http://localhost:8082"
Write-Host "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
Write-Host ""
Write-Host "Si des services Spring Boot ne sont pas accessibles, verifiez:" -ForegroundColor Yellow
Write-Host "  1. Les fenetres PowerShell avec les services (si lances en ligne de commande)"
Write-Host "  2. IntelliJ IDEA si vous les avez lances depuis l'IDE"
Write-Host "  3. Les logs: docker-compose logs [service-name]" -ForegroundColor Yellow
Write-Host ""


