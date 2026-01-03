# ========================================
# Script de demarrage complet StatLabIA
# ========================================
# Usage: .\DEMARRAGE-COMPLET.ps1

Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StatLabIA - Demarrage Complet" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Changer vers le repertoire du projet
$projectRoot = "C:\Users\PC\Desktop\last\Statlab_IA_Project"
if (-not (Test-Path $projectRoot)) {
    Write-Host "[ERREUR] Repertoire non trouve: $projectRoot" -ForegroundColor Red
    exit 1
}
Set-Location $projectRoot

# ========================================
# ETAPE 1: Verification des ports
# ========================================
Write-Host "[ETAPE 1] Verification des ports..." -ForegroundColor Yellow
$portsToCheck = @(8080, 8081, 8082, 8000, 5432, 6379, 9092, 8500, 27017, 9000)
$portsInUse = @()

foreach ($port in $portsToCheck) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        $processId = $connection.OwningProcess
        $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
        $processName = if ($process) { $process.ProcessName } else { "Unknown" }
        Write-Host "  [!] Port $port utilise par: $processName (PID: $processId)" -ForegroundColor Yellow
        $portsInUse += $port
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host ""
    Write-Host "Ports en conflit detectes. Voulez-vous les liberer? (O/N)" -ForegroundColor Yellow
    $response = Read-Host
    if ($response -eq "O" -or $response -eq "o") {
        foreach ($port in $portsInUse) {
            $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            if ($connection) {
                $processId = $connection.OwningProcess
                try {
                    Stop-Process -Id $processId -Force -ErrorAction Stop
                    Write-Host "  [OK] Processus $processId arrete" -ForegroundColor Green
                } catch {
                    Write-Host "  [!] Impossible d'arreter le processus $processId" -ForegroundColor Yellow
                }
            }
        }
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "  [OK] Tous les ports sont libres" -ForegroundColor Green
}

Write-Host ""

# ========================================
# ETAPE 2: Arret et nettoyage Docker
# ========================================
Write-Host "[ETAPE 2] Arret des services Docker existants..." -ForegroundColor Yellow
docker-compose down 2>$null
Start-Sleep -Seconds 2

# ========================================
# ETAPE 3: Build des images
# ========================================
Write-Host "[ETAPE 3] Build des images Docker..." -ForegroundColor Yellow
Write-Host "  Cela peut prendre plusieurs minutes..." -ForegroundColor Cyan
docker-compose build --no-cache analysis-service auth-service dataset-service api-gateway

# ========================================
# ETAPE 4: Demarrage infrastructure
# ========================================
Write-Host ""
Write-Host "[ETAPE 4] Demarrage de l'infrastructure..." -ForegroundColor Yellow
docker-compose up -d consul redis postgres-auth mongodb minio zookeeper kafka

Write-Host "  Attente du demarrage (30 secondes)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# ========================================
# ETAPE 5: Verification infrastructure
# ========================================
Write-Host ""
Write-Host "[ETAPE 5] Verification de l'infrastructure..." -ForegroundColor Yellow
docker-compose ps

# Test PostgreSQL
Write-Host ""
Write-Host "  Test PostgreSQL..." -ForegroundColor Cyan
try {
    docker exec postgres-auth psql -U authuser -d authdb -c "SELECT 1;" 2>&1 | Out-Null
    Write-Host "    [OK] PostgreSQL accessible" -ForegroundColor Green
} catch {
    Write-Host "    [!] PostgreSQL en cours de demarrage..." -ForegroundColor Yellow
}

# Test Consul
Write-Host "  Test Consul..." -ForegroundColor Cyan
try {
    $null = Invoke-RestMethod -Uri "http://localhost:8500/v1/status/leader" -TimeoutSec 5
    Write-Host "    [OK] Consul accessible" -ForegroundColor Green
} catch {
    Write-Host "    [!] Consul en cours de demarrage..." -ForegroundColor Yellow
}

# Test MongoDB
Write-Host "  Test MongoDB..." -ForegroundColor Cyan
try {
    docker exec mongodb mongosh --eval "1+1" 2>&1 | Out-Null
    Write-Host "    [OK] MongoDB accessible" -ForegroundColor Green
} catch {
    Write-Host "    [!] MongoDB en cours de demarrage..." -ForegroundColor Yellow
}

# ========================================
# ETAPE 6: Demarrage Analysis Service
# ========================================
Write-Host ""
Write-Host "[ETAPE 6] Demarrage Analysis Service (Docker)..." -ForegroundColor Yellow
docker-compose up -d analysis-service
Start-Sleep -Seconds 10

# ========================================
# ETAPE 7: Instructions pour services Spring Boot
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTRUCTIONS POUR LES SERVICES SPRING BOOT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Vous avez 2 options:" -ForegroundColor Yellow
Write-Host ""
Write-Host "OPTION A - Depuis IntelliJ IDEA (RECOMMANDE):" -ForegroundColor Green
Write-Host "  1. Ouvrir IntelliJ IDEA"
Write-Host "  2. Ouvrir le projet: $projectRoot"
Write-Host "  3. Configurer les Run Configurations (voir GUIDE_INTELLIJ.md)"
Write-Host "  4. Lancer dans l'ordre:"
Write-Host "     a) Dataset Service"
Write-Host "     b) Auth Service"
Write-Host "     c) API Gateway"
Write-Host ""
Write-Host "OPTION B - Depuis la ligne de commande:" -ForegroundColor Green
Write-Host "  Voulez-vous lancer les services maintenant? (O/N)" -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "O" -or $response -eq "o") {
    Write-Host ""
    Write-Host "[ETAPE 7] Demarrage des services Spring Boot..." -ForegroundColor Yellow
    
    # Dataset Service
    Write-Host "  -> Demarrage Dataset Service (fenetre PowerShell separee)..." -ForegroundColor Cyan
    Push-Location "$projectRoot\dataset_service"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$env:CONSUL_HOST='localhost'
`$env:CONSUL_PORT='8500'
`$env:MONGODB_HOST='localhost'
`$env:MONGODB_PORT='27017'
`$env:MONGODB_DATABASE='stattlabDB'
`$env:KAFKA_BROKERS='localhost:9092'
`$env:MINIO_HOST='localhost'
`$env:MINIO_PORT='9000'
`$env:MINIO_ACCESS_KEY='minioadmin'
`$env:MINIO_SECRET_KEY='minioadmin'
`$env:SERVER_PORT='8082'
`$env:SPRING_PROFILES_ACTIVE='dev'
Write-Host 'Dataset Service - Demarrage...' -ForegroundColor Green
.\mvnw spring-boot:run
"@
    Pop-Location
    Start-Sleep -Seconds 5
    
    # Auth Service
    Write-Host "  -> Demarrage Auth Service (fenetre PowerShell separee)..." -ForegroundColor Cyan
    Push-Location "$projectRoot\auth-service"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$env:CONSUL_HOST='localhost'
`$env:CONSUL_PORT='8500'
`$env:DB_HOST='localhost'
`$env:DB_PORT='5432'
`$env:DB_NAME='authdb'
`$env:DB_USER='authuser'
`$env:DB_PASSWORD='1234yasmine'
`$env:SERVER_PORT='8081'
`$env:SPRING_PROFILES_ACTIVE='dev'
Write-Host 'Auth Service - Demarrage...' -ForegroundColor Green
.\mvnw spring-boot:run
"@
    Pop-Location
    Start-Sleep -Seconds 5
    
    # API Gateway
    Write-Host "  -> Demarrage API Gateway (fenetre PowerShell separee)..." -ForegroundColor Cyan
    Push-Location "$projectRoot\api_gatway"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$env:CONSUL_HOST='localhost'
`$env:CONSUL_PORT='8500'
`$env:REDIS_HOST='localhost'
`$env:REDIS_PORT='6379'
`$env:SERVER_PORT='8080'
`$env:SPRING_PROFILES_ACTIVE='dev'
Write-Host 'API Gateway - Demarrage...' -ForegroundColor Green
.\mvnw spring-boot:run
"@
    Pop-Location
    
    Write-Host ""
    Write-Host "  [INFO] Les services sont en cours de demarrage dans des fenetres separees" -ForegroundColor Cyan
    Write-Host "  [INFO] Attendez 60-90 secondes avant de tester les endpoints" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "  [INFO] Vous lancerez les services depuis IntelliJ IDEA" -ForegroundColor Cyan
    Write-Host "        Consultez GUIDE_INTELLIJ.md pour les instructions" -ForegroundColor Cyan
}

# ========================================
# ETAPE 8: Attente et verification finale
# ========================================
Write-Host ""
Write-Host "[ETAPE 8] Attente du demarrage complet (60 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 60

Write-Host ""
Write-Host "[ETAPE 9] Verification des services..." -ForegroundColor Yellow

$endpoints = @(
    @{Url = "http://localhost:8000/health"; Name = "Analysis Service"},
    @{Url = "http://localhost:8082/actuator/health"; Name = "Dataset Service"},
    @{Url = "http://localhost:8081/actuator/health"; Name = "Auth Service"},
    @{Url = "http://localhost:8080/actuator/health"; Name = "API Gateway"}
)

$servicesOk = 0
foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  [OK] $($endpoint.Name): Accessible" -ForegroundColor Green
            $servicesOk++
        }
    } catch {
        Write-Host "  [!] $($endpoint.Name): Non accessible (peut etre en cours de demarrage)" -ForegroundColor Yellow
    }
}

# ========================================
# RESUME FINAL
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUME FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Statut Docker:" -ForegroundColor Cyan
docker-compose ps
Write-Host ""
Write-Host "Services verifies: $servicesOk / $($endpoints.Count)" -ForegroundColor $(if ($servicesOk -eq $endpoints.Count) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Consul UI: http://localhost:8500"
Write-Host "  - API Gateway: http://localhost:8080"
Write-Host "  - Analysis Service: http://localhost:8000/health"
Write-Host "  - Auth Service: http://localhost:8081/actuator/health"
Write-Host "  - Dataset Service: http://localhost:8082/actuator/health"
Write-Host "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
Write-Host ""
Write-Host "Pour verifier les logs:" -ForegroundColor Yellow
Write-Host "  docker-compose logs -f [service-name]"
Write-Host ""
Write-Host "Pour arreter tout:" -ForegroundColor Yellow
Write-Host "  docker-compose down"
Write-Host ""

