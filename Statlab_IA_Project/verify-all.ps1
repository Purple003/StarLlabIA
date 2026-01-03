# Script de verification complete pour StatLabIA Microservices
# Usage: .\verify-all.ps1

Write-Host "Verification complete de StatLabIA Microservices..." -ForegroundColor Cyan
Write-Host ""

# 1. Verifier Docker
Write-Host "1. Verification de Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "   [OK] Docker est demarre" -ForegroundColor Green
} catch {
    Write-Host "   [ERREUR] Docker n'est pas demarre!" -ForegroundColor Red
    exit 1
}

# 2. Verifier les conteneurs Docker
Write-Host ""
Write-Host "2. Verification des conteneurs Docker..." -ForegroundColor Yellow
try {
    $containers = docker-compose ps
    Write-Host $containers
    Write-Host ""
    Write-Host "   [INFO] Verifiez ci-dessus que tous les services sont Up et healthy" -ForegroundColor Cyan
} catch {
    Write-Host "   [ERREUR] Impossible de lister les conteneurs" -ForegroundColor Red
}

# 3. Verifier les ports
Write-Host ""
Write-Host "3. Verification des ports..." -ForegroundColor Yellow
$ports = @{
    "8080" = "API Gateway"
    "8081" = "Auth Service"
    "8082" = "Dataset Service"
    "8000" = "Analysis Service"
    "8500" = "Consul"
    "5432" = "PostgreSQL"
    "6379" = "Redis"
    "9092" = "Kafka"
    "27017" = "MongoDB"
    "9000" = "MinIO"
}

foreach ($port in $ports.Keys) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "   [OK] Port $port ($($ports[$port])): Utilise" -ForegroundColor Green
    } else {
        Write-Host "   [ATTENTION] Port $port ($($ports[$port])): Non utilise" -ForegroundColor Yellow
    }
}

# 4. Verifier Consul
Write-Host ""
Write-Host "4. Verification de Consul..." -ForegroundColor Yellow
try {
    $services = Invoke-RestMethod -Uri "http://localhost:8500/v1/agent/services" -TimeoutSec 5
    Write-Host "   [OK] Consul est accessible" -ForegroundColor Green
    Write-Host "   Services enregistres:" -ForegroundColor Cyan
    foreach ($serviceId in $services.PSObject.Properties.Name) {
        $service = $services.$serviceId
        Write-Host "      - $($service.Service) ($($service.Address):$($service.Port))" -ForegroundColor White
    }
} catch {
    Write-Host "   [ERREUR] Consul n'est pas accessible" -ForegroundColor Red
}

# 5. Tester les endpoints
Write-Host ""
Write-Host "5. Test des endpoints..." -ForegroundColor Yellow

$endpoints = @(
    @{Url = "http://localhost:8080/actuator/health"; Name = "API Gateway"},
    @{Url = "http://localhost:8081/actuator/health"; Name = "Auth Service"},
    @{Url = "http://localhost:8082/actuator/health"; Name = "Dataset Service"},
    @{Url = "http://localhost:8000/health"; Name = "Analysis Service"}
)

foreach ($endpoint in $endpoints) {
    try {
        $response = Invoke-WebRequest -Uri $endpoint.Url -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            Write-Host "   [OK] $($endpoint.Name): OK (Status 200)" -ForegroundColor Green
        } else {
            Write-Host "   [ATTENTION] $($endpoint.Name): Status $($response.StatusCode)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   [ERREUR] $($endpoint.Name): Non accessible" -ForegroundColor Red
    }
}

# 6. Resume final
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESUME DE LA VERIFICATION" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Si tous les elements sont [OK], votre projet est operationnel!" -ForegroundColor Green
Write-Host ""
