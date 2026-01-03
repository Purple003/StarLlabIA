# Script complet pour lancer TOUT automatiquement
# Usage: .\LANCER-TOUT.ps1

$ErrorActionPreference = "Continue"

Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StatLabIA - LANCEMENT COMPLET" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "C:\Users\PC\Desktop\last\Statlab_IA_Project"
$frontendRoot = "C:\Users\PC\Desktop\last\StatLabIA-frontend"

Set-Location $projectRoot

# ========================================
# ETAPE 1: Verification Docker
# ========================================
Write-Host "[ETAPE 1] Verification de Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "  [OK] Docker est demarre" -ForegroundColor Green
} catch {
    Write-Host "  [ERREUR] Docker n'est pas demarre!" -ForegroundColor Red
    Write-Host "  Veuillez demarrer Docker Desktop et relancer ce script." -ForegroundColor Yellow
    exit 1
}

# ========================================
# ETAPE 2: Arret des services existants
# ========================================
Write-Host ""
Write-Host "[ETAPE 2] Arret des services existants..." -ForegroundColor Yellow
docker-compose down 2>$null
Start-Sleep -Seconds 2

# ========================================
# ETAPE 3: Demarrage infrastructure Docker
# ========================================
Write-Host ""
Write-Host "[ETAPE 3] Demarrage de l'infrastructure Docker..." -ForegroundColor Yellow
docker-compose up -d consul redis postgres-auth mongodb minio zookeeper kafka

Write-Host "  Attente du demarrage (30 secondes)..." -ForegroundColor Cyan
Start-Sleep -Seconds 30

# Verification infrastructure
$infraOk = $true
try {
    docker exec postgres-auth psql -U authuser -d authdb -c "SELECT 1;" 2>&1 | Out-Null
    Write-Host "  [OK] PostgreSQL" -ForegroundColor Green
} catch {
    Write-Host "  [!] PostgreSQL en cours de demarrage..." -ForegroundColor Yellow
    $infraOk = $false
}

try {
    $null = Invoke-RestMethod -Uri "http://localhost:8500/v1/status/leader" -TimeoutSec 5 -UseBasicParsing
    Write-Host "  [OK] Consul" -ForegroundColor Green
} catch {
    Write-Host "  [!] Consul en cours de demarrage..." -ForegroundColor Yellow
    $infraOk = $false
}

# ========================================
# ETAPE 4: Demarrage Analysis Service
# ========================================
Write-Host ""
Write-Host "[ETAPE 4] Demarrage Analysis Service (Docker)..." -ForegroundColor Yellow
docker-compose up -d analysis-service
Start-Sleep -Seconds 10

# ========================================
# ETAPE 5: Demarrage services Spring Boot
# ========================================
Write-Host ""
Write-Host "[ETAPE 5] Demarrage des services Spring Boot..." -ForegroundColor Yellow
Write-Host "  Cela peut prendre 2-3 minutes..." -ForegroundColor Cyan

# Dataset Service
Write-Host "  -> Dataset Service (fenetre PowerShell separee)..." -ForegroundColor Cyan
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
Write-Host 'Working directory:' `$PWD -ForegroundColor Cyan
.\mvnw.cmd spring-boot:run
"@
Pop-Location
Start-Sleep -Seconds 10

# Auth Service
Write-Host "  -> Auth Service (fenetre PowerShell separee)..." -ForegroundColor Cyan
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
Write-Host 'Working directory:' `$PWD -ForegroundColor Cyan
.\mvnw.cmd spring-boot:run
"@
Pop-Location
Start-Sleep -Seconds 10

# API Gateway
Write-Host "  -> API Gateway (fenetre PowerShell separee)..." -ForegroundColor Cyan
Push-Location "$projectRoot\api_gatway"
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$env:CONSUL_HOST='localhost'
`$env:CONSUL_PORT='8500'
`$env:REDIS_HOST='localhost'
`$env:REDIS_PORT='6379'
`$env:SERVER_PORT='8080'
`$env:SPRING_PROFILES_ACTIVE='dev'
Write-Host 'API Gateway - Demarrage...' -ForegroundColor Green
Write-Host 'Working directory:' `$PWD -ForegroundColor Cyan
.\mvnw.cmd spring-boot:run
"@
Pop-Location

# ========================================
# ETAPE 6: Attente du demarrage
# ========================================
Write-Host ""
Write-Host "[ETAPE 6] Attente du demarrage complet (120 secondes)..." -ForegroundColor Yellow
Write-Host "  Les services sont en cours de demarrage en arriere-plan..." -ForegroundColor Cyan
Write-Host "  Cela peut prendre jusqu'a 2-3 minutes pour Auth Service et API Gateway..." -ForegroundColor Cyan

for ($i = 1; $i -le 24; $i++) {
    Start-Sleep -Seconds 5
    if ($i % 6 -eq 0) {
        Write-Host ""
        Write-Host "  ($i/24) Verification des services..." -ForegroundColor Cyan
        try {
            $ds = Invoke-WebRequest -Uri "http://localhost:8082/actuator/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($ds.StatusCode -eq 200) {
                Write-Host "    [OK] Dataset Service" -ForegroundColor Green
            }
        } catch {}
        try {
            $as = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($as.StatusCode -eq 200) {
                Write-Host "    [OK] Auth Service" -ForegroundColor Green
            }
        } catch {}
        try {
            $gw = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 2 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($gw.StatusCode -eq 200) {
                Write-Host "    [OK] API Gateway" -ForegroundColor Green
            }
        } catch {}
        Write-Host "  " -NoNewline
    } else {
        Write-Host "  ." -NoNewline -ForegroundColor Gray
    }
}
Write-Host ""

# ========================================
# ETAPE 7: Verification des services
# ========================================
Write-Host ""
Write-Host "[ETAPE 7] Verification des services..." -ForegroundColor Yellow

$services = @{
    "Analysis Service" = "http://localhost:8000/health"
    "Dataset Service" = "http://localhost:8082/actuator/health"
    "Auth Service" = "http://localhost:8081/actuator/health"
    "API Gateway" = "http://localhost:8080/actuator/health"
}

$servicesOk = 0
foreach ($serviceName in $services.Keys) {
    $url = $services[$serviceName]
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "  [OK] $serviceName" -ForegroundColor Green
            $servicesOk++
        }
    } catch {
        Write-Host "  [!] $serviceName : En cours de demarrage..." -ForegroundColor Yellow
    }
}

# ========================================
# ETAPE 8: Lancer le Frontend
# ========================================
Write-Host ""
Write-Host "[ETAPE 8] Demarrage du Frontend React..." -ForegroundColor Yellow

if (Test-Path $frontendRoot) {
    Push-Location $frontendRoot
    
    # Verifier si node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-Host "  Installation des dependances..." -ForegroundColor Cyan
        npm install
    }
    
    Write-Host "  Demarrage du serveur de developpement..." -ForegroundColor Cyan
    Write-Host "  Le frontend sera accessible sur http://localhost:3000" -ForegroundColor Green
    
    # Lancer le frontend dans une nouvelle fenetre
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendRoot'; npm run dev"
    
    Pop-Location
} else {
    Write-Host "  [!] Repertoire frontend non trouve: $frontendRoot" -ForegroundColor Yellow
}

# ========================================
# RESUME FINAL
# ========================================
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUME FINAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services verifies: $servicesOk / $($services.Count)" -ForegroundColor $(if ($servicesOk -eq $services.Count) { "Green" } else { "Yellow" })
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  - API Gateway: http://localhost:8080" -ForegroundColor White
Write-Host "  - Analysis Service: http://localhost:8000/health" -ForegroundColor White
Write-Host "  - Auth Service: http://localhost:8081/actuator/health" -ForegroundColor White
Write-Host "  - Dataset Service: http://localhost:8082/actuator/health" -ForegroundColor White
Write-Host "  - Consul UI: http://localhost:8500" -ForegroundColor White
Write-Host "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)" -ForegroundColor White
Write-Host ""
Write-Host "Les services Spring Boot sont dans des fenetres PowerShell separees" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour arreter les services:" -ForegroundColor Yellow
Write-Host "  1. Fermer les fenetres PowerShell des services" -ForegroundColor White
Write-Host "  2. docker-compose down" -ForegroundColor White
Write-Host ""

