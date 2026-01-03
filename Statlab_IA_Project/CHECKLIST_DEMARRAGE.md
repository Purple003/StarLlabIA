# 📋 Checklist Complète - Démarrage StatLabIA Microservices

## 🎯 Objectif
Mettre en ligne tous les microservices avec Docker et IntelliJ IDEA sur Windows 11.

---

## ÉTAPE 1 : Vérifier et Libérer les Ports 🔌

### 1.1 Liste des Ports Requis
```
- 8080  : API Gateway
- 8081  : Auth Service
- 8082  : Dataset Service
- 8083  : Report Service
- 8084  : Orchestrator Service
- 8000  : Analysis Service (Python/FastAPI)
- 5432  : PostgreSQL
- 6379  : Redis
- 9092  : Kafka
- 8500  : Consul
- 9000  : MinIO
- 9001  : MinIO Console
- 27017 : MongoDB
```

### 1.2 Vérifier les Ports Utilisés
Ouvrir PowerShell en tant qu'administrateur et exécuter :

```powershell
# Vérifier tous les ports nécessaires
$ports = @(8080, 8081, 8082, 8083, 8084, 8000, 5432, 6379, 9092, 8500, 9000, 9001, 27017)

foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Write-Host "⚠️ Port $port est utilisé par PID: $($connection.OwningProcess)" -ForegroundColor Yellow
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "   Processus: $($process.ProcessName)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "✅ Port $port est libre" -ForegroundColor Green
    }
}
```

### 1.3 Libérer les Ports si Nécessaire

**Option A : Arrêter les processus Docker existants**
```powershell
# Arrêter tous les conteneurs Docker
cd C:\Users\PC\Desktop\last\Statlab_IA_Project
docker-compose down
docker stop $(docker ps -aq) 2>$null
```

**Option B : Tuer un processus spécifique (si nécessaire)**
```powershell
# Remplacer PID par le numéro du processus trouvé
Stop-Process -Id <PID> -Force
```

---

## ÉTAPE 2 : Vérifier Docker Desktop et les Conteneurs 🐳

### 2.1 Vérifier que Docker Desktop est Démarré
```powershell
# Vérifier l'état de Docker
docker info
docker ps
```

**Si Docker n'est pas démarré :**
- Ouvrir Docker Desktop depuis le menu Démarrer
- Attendre que l'icône dans la barre des tâches devienne verte

### 2.2 Nettoyer les Conteneurs Existants
```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project

# Arrêter et supprimer tous les conteneurs
docker-compose down -v

# Supprimer les conteneurs orphelins
docker container prune -f

# Vérifier qu'il n'y a plus de conteneurs
docker ps -a
```

---

## ÉTAPE 3 : Corriger les Configurations de Connexion 🔧

### 3.1 Vérifier les Fichiers de Configuration

**Fichier : `auth-service/src/main/resources/application.yml`**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_HOST:postgres-auth}:${DB_PORT:5432}/${DB_NAME:authdb}
    username: ${DB_USER:authuser}
    password: ${DB_PASSWORD:1234yasmine}
  cloud:
    consul:
      host: ${CONSUL_HOST:consul}
      port: ${CONSUL_PORT:8500}
```

**Fichier : `dataset_service/src/main/resources/application.yml`**
```yaml
spring:
  data:
    mongodb:
      uri: mongodb://${MONGODB_HOST:mongodb}:${MONGODB_PORT:27017}/${MONGODB_DATABASE:stattlabDB}
  cloud:
    consul:
      host: ${CONSUL_HOST:consul}
      port: ${CONSUL_PORT:8500}
```

**Fichier : `api_gatway/src/main/resources/application.yml`**
```yaml
spring:
  cloud:
    consul:
      host: ${CONSUL_HOST:consul}
      port: ${CONSUL_PORT:8500}
  data:
    redis:
      host: ${REDIS_HOST:redis}
      port: ${REDIS_PORT:6379}
```

### 3.2 Vérifier le docker-compose.yml
```powershell
# Ouvrir le fichier docker-compose.yml et vérifier que :
# 1. Tous les services utilisent les noms de conteneurs corrects
# 2. Les variables d'environnement sont bien définies
# 3. Les dépendances (depends_on) sont correctes
```

**Points à vérifier dans `docker-compose.yml` :**
- ✅ Consul utilise `hashicorp/consul:latest`
- ✅ Kafka utilise `kafka:9092` (pas localhost) pour les connexions internes
- ✅ Tous les services Spring Boot ont les variables d'environnement pour les connexions DB

---

## ÉTAPE 4 : Démarrer l'Infrastructure Docker 🏗️

### 4.1 Démarrer les Services d'Infrastructure
```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project

# Démarrer uniquement l'infrastructure (sans les services Spring Boot)
docker-compose up -d consul redis postgres-auth mongodb minio zookeeper kafka
```

### 4.2 Vérifier que Tous les Conteneurs sont en Ligne
```powershell
# Attendre 30 secondes
Start-Sleep -Seconds 30

# Vérifier le statut
docker-compose ps

# Vérifier les logs pour détecter les erreurs
docker-compose logs consul
docker-compose logs postgres-auth
docker-compose logs mongodb
```

**Résultat attendu :**
- ✅ consul : Up (ports 8500)
- ✅ redis : Up (healthy) (port 6379)
- ✅ postgres-auth : Up (healthy) (port 5432)
- ✅ mongodb : Up (healthy) (port 27017)
- ✅ minio : Up (healthy) (ports 9000-9001)
- ✅ zookeeper : Up
- ✅ kafka : Up (healthy) (port 9092)

### 4.3 Tester les Connexions

**Tester Consul :**
```powershell
# Ouvrir dans le navigateur
Start-Process "http://localhost:8500"

# Ou via curl
curl http://localhost:8500/v1/agent/services
```

**Tester PostgreSQL :**
```powershell
docker exec -it postgres-auth psql -U authuser -d authdb -c "SELECT version();"
```

**Tester MongoDB :**
```powershell
docker exec -it mongodb mongosh --eval "db.version()"
```

**Tester Redis :**
```powershell
docker exec -it redis redis-cli ping
```

---

## ÉTAPE 5 : Configurer IntelliJ IDEA pour les Services Spring Boot 💡

### 5.1 Ouvrir le Projet dans IntelliJ IDEA
1. Ouvrir IntelliJ IDEA
2. File → Open → Sélectionner le dossier `Statlab_IA_Project`
3. Attendre que Maven importe les dépendances

### 5.2 Configurer le Run Configuration pour Auth Service

1. **Créer une nouvelle configuration :**
   - Run → Edit Configurations...
   - Cliquer sur `+` → Application

2. **Configuration Auth Service :**
   ```
   Name: Auth Service
   Main class: com.example.auth_service.AuthServiceApplication
   Working directory: $PROJECT_DIR$/auth-service
   Use classpath of module: auth-service
   VM options: -Dspring.profiles.active=dev
   Environment variables:
     - CONSUL_HOST=localhost
     - CONSUL_PORT=8500
     - DB_HOST=localhost
     - DB_PORT=5432
     - DB_NAME=authdb
     - DB_USER=authuser
     - DB_PASSWORD=1234yasmine
     - SERVER_PORT=8081
   ```

### 5.3 Configurer Dataset Service

1. **Créer une nouvelle configuration :**
   ```
   Name: Dataset Service
   Main class: com.example.dataset_service.DatasetServiceApplication
   Working directory: $PROJECT_DIR$/dataset_service
   Use classpath of module: dataset_service
   VM options: -Dspring.profiles.active=dev
   Environment variables:
     - CONSUL_HOST=localhost
     - CONSUL_PORT=8500
     - MONGODB_HOST=localhost
     - MONGODB_PORT=27017
     - MONGODB_DATABASE=stattlabDB
     - KAFKA_BROKERS=localhost:9092
     - MINIO_HOST=localhost
     - MINIO_PORT=9000
   ```

### 5.4 Configurer API Gateway

1. **Créer une nouvelle configuration :**
   ```
   Name: API Gateway
   Main class: com.example.api_gatway.ApiGatewayApplication
   Working directory: $PROJECT_DIR$/api_gatway
   Use classpath of module: api_gatway
   VM options: -Dspring.profiles.active=dev
   Environment variables:
     - CONSUL_HOST=localhost
     - CONSUL_PORT=8500
     - REDIS_HOST=localhost
     - REDIS_PORT=6379
     - SERVER_PORT=8080
   ```

### 5.5 Créer un Compound Run Configuration (Optionnel)

Pour lancer plusieurs services en même temps :
1. Run → Edit Configurations...
2. Cliquer sur `+` → Compound
3. Nom : "All Microservices"
4. Ajouter : Dataset Service, Auth Service, API Gateway

---

## ÉTAPE 6 : Lancer les Services dans l'Ordre Correct 🚀

### 6.1 Ordre de Démarrage Recommandé

```
1. Infrastructure Docker (déjà fait)
2. Dataset Service
3. Auth Service
4. Analysis Service (via Docker ou localement)
5. Report Service (si nécessaire)
6. API Gateway
```

### 6.2 Lancer Dataset Service

**Option A : Via IntelliJ IDEA**
1. Sélectionner la configuration "Dataset Service"
2. Cliquer sur Run (▶️)
3. Vérifier les logs dans la console

**Option B : Via Terminal (depuis le dossier dataset_service)**
```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project\dataset_service
.\mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**Vérifier que le service démarre :**
```powershell
# Attendre 30-60 secondes
Start-Sleep -Seconds 30

# Tester l'endpoint health
curl http://localhost:8082/actuator/health
```

**Logs attendus :**
- ✅ "Started DatasetServiceApplication"
- ✅ "Registered service with Consul"
- ✅ Aucune erreur de connexion MongoDB/Kafka

### 6.3 Lancer Auth Service

**Via IntelliJ IDEA :**
1. Sélectionner la configuration "Auth Service"
2. Cliquer sur Run (▶️)

**Vérifier :**
```powershell
curl http://localhost:8081/actuator/health
```

**Logs attendus :**
- ✅ "Started AuthServiceApplication"
- ✅ "Registered service with Consul"
- ✅ "Hibernate: create table" (première fois)
- ✅ Aucune erreur JDBCConnectionException

### 6.4 Lancer Analysis Service

**Option A : Via Docker (recommandé)**
```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project
docker-compose up -d analysis-service
docker-compose logs -f analysis-service
```

**Option B : Via Terminal local**
```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project\analysis-service
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Vérifier :**
```powershell
curl http://localhost:8000/health
```

### 6.5 Lancer Report Service (si nécessaire)

Même procédure que Auth Service avec le port 8083.

### 6.6 Lancer API Gateway

**Via IntelliJ IDEA :**
1. Sélectionner la configuration "API Gateway"
2. Cliquer sur Run (▶️)

**Vérifier :**
```powershell
# Attendre 30-60 secondes
Start-Sleep -Seconds 30

curl http://localhost:8080/actuator/health
```

---

## ÉTAPE 7 : Vérifier les Routes de l'API Gateway 🛣️

### 7.1 Test des Routes via Navigateur

Ouvrir votre navigateur et tester :

```
✅ Consul UI: http://localhost:8500
✅ API Gateway Health: http://localhost:8080/actuator/health
✅ Auth Service via Gateway: http://localhost:8080/api/auth/actuator/health
✅ Dataset Service via Gateway: http://localhost:8080/api/datasets/actuator/health
✅ Analysis Service via Gateway: http://localhost:8080/api/analysis/health
```

### 7.2 Test avec Postman ou curl

**Créer une collection Postman avec :**

```
GET  http://localhost:8080/actuator/health
GET  http://localhost:8080/api/auth/actuator/health
GET  http://localhost:8080/api/datasets/actuator/health
GET  http://localhost:8080/api/analysis/health
```

**Ou via PowerShell :**
```powershell
# Test API Gateway
Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" | Select-Object StatusCode, Content

# Test Auth Service via Gateway
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/actuator/health" | Select-Object StatusCode

# Test Dataset Service via Gateway
Invoke-WebRequest -Uri "http://localhost:8080/api/datasets/actuator/health" | Select-Object StatusCode
```

### 7.3 Vérifier Consul Service Discovery

```powershell
# Vérifier les services enregistrés
curl http://localhost:8500/v1/agent/services | ConvertFrom-Json | Format-Table ID, Service, Address, Port
```

**Services attendus :**
- ✅ api-gateway
- ✅ auth-service
- ✅ dataset-service
- ✅ analysis-service

---

## ÉTAPE 8 : Vérification Finale et Dépannage 🔍

### 8.1 Vérifier Tous les Logs

**Via Docker Compose :**
```powershell
# Logs de tous les services
docker-compose logs --tail=50

# Logs d'un service spécifique
docker-compose logs --tail=100 auth-service
docker-compose logs --tail=100 dataset-service
docker-compose logs --tail=100 api-gateway
```

**Via IntelliJ IDEA :**
- Vérifier les consoles de chaque service lancé
- Rechercher les erreurs en rouge

### 8.2 Vérifier les Erreurs Communes

**Erreur : UnknownHostException**
- ✅ Solution : Vérifier que les noms de conteneurs dans docker-compose.yml correspondent aux variables d'environnement

**Erreur : Connection refused (PostgreSQL)**
- ✅ Solution : Vérifier que postgres-auth est démarré et healthy
- ✅ Vérifier les credentials dans application.yml

**Erreur : Connection refused (MongoDB)**
- ✅ Solution : Vérifier que mongodb est démarré et healthy

**Erreur : Connection refused (Kafka)**
- ✅ Solution : Vérifier que zookeeper et kafka sont démarrés
- ✅ Attendre 1-2 minutes après le démarrage de Kafka

**Erreur : Connection refused (Consul)**
- ✅ Solution : Vérifier que consul est démarré
- ✅ Ouvrir http://localhost:8500 dans le navigateur

**Erreur : Service not found in Consul**
- ✅ Solution : Attendre 30-60 secondes après le démarrage d'un service
- ✅ Vérifier que le service s'enregistre dans Consul (voir logs)

### 8.3 Checklist de Vérification Finale

```
✅ Tous les ports sont libres (Étape 1)
✅ Docker Desktop est démarré (Étape 2)
✅ Tous les conteneurs d'infrastructure sont Up et Healthy (Étape 4)
✅ Dataset Service démarre sans erreur (Étape 6.2)
✅ Auth Service démarre sans erreur (Étape 6.3)
✅ Analysis Service est accessible (Étape 6.4)
✅ API Gateway démarre sans erreur (Étape 6.6)
✅ Toutes les routes API Gateway fonctionnent (Étape 7)
✅ Tous les services sont visibles dans Consul (Étape 7.3)
✅ Aucune erreur dans les logs (Étape 8.1)
```

---

## ÉTAPE 9 : Script de Démarrage Automatique (Optionnel) 🤖

### 9.1 Créer un Script PowerShell de Démarrage

Créer un fichier `start-all.ps1` :

```powershell
# start-all.ps1
Write-Host "🚀 Démarrage de StatLabIA Microservices..." -ForegroundColor Cyan

# 1. Vérifier Docker
Write-Host "📦 Vérification de Docker..." -ForegroundColor Yellow
docker info | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker n'est pas démarré!" -ForegroundColor Red
    exit 1
}

# 2. Démarrer l'infrastructure
Write-Host "🏗️ Démarrage de l'infrastructure..." -ForegroundColor Yellow
cd C:\Users\PC\Desktop\last\Statlab_IA_Project
docker-compose up -d consul redis postgres-auth mongodb minio zookeeper kafka

# 3. Attendre que l'infrastructure soit prête
Write-Host "⏳ Attente du démarrage (30 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# 4. Vérifier le statut
Write-Host "🔍 Vérification du statut..." -ForegroundColor Yellow
docker-compose ps

# 5. Démarrer Analysis Service
Write-Host "🐍 Démarrage de Analysis Service..." -ForegroundColor Yellow
docker-compose up -d analysis-service

Write-Host ""
Write-Host "✅ Infrastructure démarrée!" -ForegroundColor Green
Write-Host "📍 Vous pouvez maintenant lancer les services Spring Boot depuis IntelliJ IDEA" -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "  - Consul UI: http://localhost:8500"
Write-Host "  - API Gateway: http://localhost:8080"
Write-Host "  - Analysis Service: http://localhost:8000"
Write-Host "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
```

### 9.2 Utiliser le Script

```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project
.\start-all.ps1
```

---

## ÉTAPE 10 : Confirmation Finale ✅

### 10.1 Commandes de Vérification Complète

```powershell
# Vérifier tous les services Docker
docker-compose ps

# Vérifier les services dans Consul
curl http://localhost:8500/v1/agent/services

# Tester tous les endpoints
Write-Host "Test API Gateway..." -ForegroundColor Cyan
curl http://localhost:8080/actuator/health

Write-Host "Test Auth Service..." -ForegroundColor Cyan
curl http://localhost:8081/actuator/health

Write-Host "Test Dataset Service..." -ForegroundColor Cyan
curl http://localhost:8082/actuator/health

Write-Host "Test Analysis Service..." -ForegroundColor Cyan
curl http://localhost:8000/health
```

### 10.2 Résultat Attendu

Si tout fonctionne correctement, vous devriez voir :

```
✅ Tous les conteneurs Docker sont Up et Healthy
✅ Tous les services Spring Boot sont démarrés (vérifier dans IntelliJ)
✅ Tous les endpoints répondent avec StatusCode 200
✅ Tous les services sont visibles dans Consul UI
✅ Aucune erreur dans les logs
```

---

## 🎉 FÉLICITATIONS !

Si toutes les étapes sont complétées avec succès, votre projet StatLabIA est maintenant **100% opérationnel** !

Vous pouvez maintenant :
- ✅ Utiliser l'API Gateway sur http://localhost:8080
- ✅ Accéder à tous les microservices via le Gateway
- ✅ Utiliser Consul pour la découverte de services
- ✅ Développer et tester de nouvelles fonctionnalités

---

## 📞 Support

En cas de problème, vérifier :
1. Les logs de chaque service
2. La configuration dans `application.yml`
3. Les variables d'environnement dans IntelliJ IDEA
4. Le statut des conteneurs Docker avec `docker-compose ps`


