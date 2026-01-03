# ========================================
# Script COMPLET : Scan + Correction + Lancement
# ========================================
# Ce script scanne tout, corrige les problemes et lance tout automatiquement

$ErrorActionPreference = "Continue"
$projectRoot = "C:\Users\PC\Desktop\last\Statlab_IA_Project"
$frontendRoot = "C:\Users\PC\Desktop\last\StatLabIA-frontend"

Clear-Host
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  StatLabIA - SCAN COMPLET + LANCEMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

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
# ETAPE 2: Arret et nettoyage
# ========================================
Write-Host ""
Write-Host "[ETAPE 2] Nettoyage des services existants..." -ForegroundColor Yellow
docker-compose down 2>$null
Start-Sleep -Seconds 2

# ========================================
# ETAPE 3: Demarrage infrastructure
# ========================================
Write-Host ""
Write-Host "[ETAPE 3] Demarrage de l'infrastructure Docker..." -ForegroundColor Yellow
docker-compose up -d consul redis postgres-auth mongodb minio zookeeper kafka

Write-Host "  Attente du demarrage (40 secondes)..." -ForegroundColor Cyan
Start-Sleep -Seconds 40

# Verification infrastructure
Write-Host "  Verification de l'infrastructure..." -ForegroundColor Cyan
$infraOk = $true

# PostgreSQL
try {
    docker exec postgres-auth psql -U authuser -d authdb -c "SELECT 1;" 2>&1 | Out-Null
    Write-Host "    [OK] PostgreSQL" -ForegroundColor Green
} catch {
    Write-Host "    [!] PostgreSQL en cours de demarrage..." -ForegroundColor Yellow
    $infraOk = $false
}

# Consul
try {
    $null = Invoke-RestMethod -Uri "http://localhost:8500/v1/status/leader" -TimeoutSec 5 -UseBasicParsing
    Write-Host "    [OK] Consul" -ForegroundColor Green
} catch {
    Write-Host "    [!] Consul en cours de demarrage..." -ForegroundColor Yellow
    $infraOk = $false
}

# MongoDB
try {
    docker exec mongodb mongosh --eval "1+1" 2>&1 | Out-Null
    Write-Host "    [OK] MongoDB" -ForegroundColor Green
} catch {
    Write-Host "    [!] MongoDB en cours de demarrage..." -ForegroundColor Yellow
}

# Redis
try {
    docker exec redis redis-cli ping 2>&1 | Out-Null
    Write-Host "    [OK] Redis" -ForegroundColor Green
} catch {
    Write-Host "    [!] Redis en cours de demarrage..." -ForegroundColor Yellow
}

# ========================================
# ETAPE 4: Demarrage Analysis Service
# ========================================
Write-Host ""
Write-Host "[ETAPE 4] Demarrage Analysis Service..." -ForegroundColor Yellow
docker-compose up -d analysis-service
Start-Sleep -Seconds 15

# ========================================
# ETAPE 5: Demarrage services Spring Boot
# ========================================
Write-Host ""
Write-Host "[ETAPE 5] Demarrage des services Spring Boot..." -ForegroundColor Yellow
Write-Host "  Les services seront lances dans des fenetres PowerShell separees" -ForegroundColor Cyan
Write-Host "  Cela peut prendre 2-3 minutes..." -ForegroundColor Cyan

# Dataset Service
Write-Host "  -> Dataset Service..." -ForegroundColor Cyan
Push-Location "$projectRoot\dataset_service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$ErrorActionPreference = 'Continue'
Set-Location '$projectRoot\dataset_service'
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
Write-Host '========================================' -ForegroundColor Green
Write-Host '  Dataset Service - Demarrage' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
.\mvnw.cmd spring-boot:run
"@
Pop-Location
Start-Sleep -Seconds 15

# Auth Service
Write-Host "  -> Auth Service..." -ForegroundColor Cyan
Push-Location "$projectRoot\auth-service"
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$ErrorActionPreference = 'Continue'
Set-Location '$projectRoot\auth-service'
`$env:CONSUL_HOST='localhost'
`$env:CONSUL_PORT='8500'
`$env:DB_HOST='localhost'
`$env:DB_PORT='5432'
`$env:DB_NAME='authdb'
`$env:DB_USER='authuser'
`$env:DB_PASSWORD='1234yasmine'
`$env:SERVER_PORT='8081'
`$env:SPRING_PROFILES_ACTIVE='dev'
Write-Host '========================================' -ForegroundColor Green
Write-Host '  Auth Service - Demarrage' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
.\mvnw.cmd spring-boot:run
"@
Pop-Location
Start-Sleep -Seconds 15

# API Gateway
Write-Host "  -> API Gateway..." -ForegroundColor Cyan
Push-Location "$projectRoot\api_gatway"
Start-Process powershell -ArgumentList "-NoExit", "-Command", @"
`$ErrorActionPreference = 'Continue'
Set-Location '$projectRoot\api_gatway'
`$env:CONSUL_HOST='localhost'
`$env:CONSUL_PORT='8500'
`$env:REDIS_HOST='localhost'
`$env:REDIS_PORT='6379'
`$env:SERVER_PORT='8080'
`$env:SPRING_PROFILES_ACTIVE='dev'
Write-Host '========================================' -ForegroundColor Green
Write-Host '  API Gateway - Demarrage' -ForegroundColor Green
Write-Host '========================================' -ForegroundColor Green
Write-Host ''
.\mvnw.cmd spring-boot:run
"@
Pop-Location

# ========================================
# ETAPE 6: Attente et verification progressive
# ========================================
Write-Host ""
Write-Host "[ETAPE 6] Attente et verification progressive..." -ForegroundColor Yellow
Write-Host "  Verification toutes les 15 secondes pendant 3 minutes..." -ForegroundColor Cyan

$maxAttempts = 12
$attempt = 0
$allServicesOk = $false

while ($attempt -lt $maxAttempts -and -not $allServicesOk) {
    $attempt++
    Start-Sleep -Seconds 15
    
    Write-Host ""
    Write-Host "  Verification #$attempt/$maxAttempts..." -ForegroundColor Cyan
    
    $servicesStatus = @{}
    
    # Analysis Service
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "    [OK] Analysis Service (port 8000)" -ForegroundColor Green
            $servicesStatus["Analysis"] = $true
        }
    } catch {
        Write-Host "    [!] Analysis Service..." -ForegroundColor Yellow
        $servicesStatus["Analysis"] = $false
    }
    
    # Dataset Service
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8082/actuator/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "    [OK] Dataset Service (port 8082)" -ForegroundColor Green
            $servicesStatus["Dataset"] = $true
        }
    } catch {
        Write-Host "    [!] Dataset Service..." -ForegroundColor Yellow
        $servicesStatus["Dataset"] = $false
    }
    
    # Auth Service
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8081/actuator/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "    [OK] Auth Service (port 8081)" -ForegroundColor Green
            $servicesStatus["Auth"] = $true
        }
    } catch {
        Write-Host "    [!] Auth Service..." -ForegroundColor Yellow
        $servicesStatus["Auth"] = $false
    }
    
    # API Gateway
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "    [OK] API Gateway (port 8080)" -ForegroundColor Green
            $servicesStatus["Gateway"] = $true
        }
    } catch {
        Write-Host "    [!] API Gateway..." -ForegroundColor Yellow
        $servicesStatus["Gateway"] = $false
    }
    
    # Verification si tous les services sont OK
    $okCount = ($servicesStatus.Values | Where-Object { $_ -eq $true }).Count
    if ($okCount -eq 4) {
        $allServicesOk = $true
        Write-Host ""
        Write-Host "  [SUCCESS] Tous les services sont operationnels!" -ForegroundColor Green
    } else {
        Write-Host "    Services OK: $okCount / 4" -ForegroundColor Cyan
    }
}

# ========================================
# ETAPE 7: Lancer le Frontend
# ========================================
Write-Host ""
Write-Host "[ETAPE 7] Demarrage du Frontend React..." -ForegroundColor Yellow

if (Test-Path $frontendRoot) {
    Push-Location $frontendRoot
    
    if (-not (Test-Path "node_modules")) {
        Write-Host "  Installation des dependances (cela peut prendre 1-2 minutes)..." -ForegroundColor Cyan
        npm install --silent
    }
    
    Write-Host "  Demarrage du serveur de developpement..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendRoot'; npm run dev"
    
    Pop-Location
    Write-Host "  [OK] Frontend lance sur http://localhost:3000" -ForegroundColor Green
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

if ($allServicesOk) {
    Write-Host "[SUCCESS] TOUS LES SERVICES SONT OPERATIONNELS!" -ForegroundColor Green
} else {
    Write-Host "[ATTENTION] Certains services peuvent encore demarrer..." -ForegroundColor Yellow
    Write-Host "  Verifiez les fenetres PowerShell des services Spring Boot" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Statut Docker:" -ForegroundColor Cyan
docker-compose ps | Select-String -Pattern "NAME|analysis|consul|kafka|minio|mongodb|postgres|redis|zookeeper"

Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Frontend React: http://localhost:3000" -ForegroundColor White
Write-Host "  - API Gateway: http://localhost:8080/actuator/health" -ForegroundColor White
Write-Host "  - Auth Service: http://localhost:8081/actuator/health" -ForegroundColor White
Write-Host "  - Dataset Service: http://localhost:8082/actuator/health" -ForegroundColor White
Write-Host "  - Analysis Service: http://localhost:8000/health" -ForegroundColor White
Write-Host "  - Consul UI: http://localhost:8500" -ForegroundColor White
Write-Host "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)" -ForegroundColor White
Write-Host ""
Write-Host "Services Spring Boot:" -ForegroundColor Cyan
Write-Host "  - Verifiez les 3 fenetres PowerShell ouvertes" -ForegroundColor White
Write-Host "  - Dataset Service, Auth Service, API Gateway" -ForegroundColor White
Write-Host ""
Write-Host "Pour arreter tout:" -ForegroundColor Yellow
Write-Host "  1. Fermer les fenetres PowerShell des services" -ForegroundColor White
Write-Host "  2. docker-compose down" -ForegroundColor White
Write-Host ""


