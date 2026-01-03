# Guide Rapide - Démarrage StatLabIA

## 🚀 Démarrage Rapide (1 Commande)

```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project
.\DEMARRAGE-COMPLET.ps1
```

Ce script fait TOUT automatiquement :
1. ✅ Vérifie et libère les ports
2. ✅ Nettoie Docker
3. ✅ Build les images
4. ✅ Démarre l'infrastructure (Consul, PostgreSQL, MongoDB, Redis, Kafka, MinIO)
5. ✅ Démarre Analysis Service (Python)
6. ✅ Propose de lancer les services Spring Boot
7. ✅ Vérifie que tout fonctionne

---

## 📋 Ce Qui Doit Être Lancé Où

### ✅ Docker (Automatique via script)
- consul
- redis
- postgres-auth
- mongodb
- minio
- zookeeper
- kafka
- analysis-service

### ✅ IntelliJ IDEA (OU ligne de commande)
- **auth-service** (port 8081)
- **dataset-service** (port 8082)
- **api-gateway** (port 8080)

---

## 🎯 Option 1 : Lancer depuis IntelliJ IDEA (RECOMMANDÉ)

### Configuration dans IntelliJ :

1. **Run → Edit Configurations...**

2. **Dataset Service :**
   ```
   Name: Dataset Service
   Main class: com.example.dataset_service.DatasetServiceApplication
   Working directory: $PROJECT_DIR$/dataset_service
   Module: dataset_service
   VM options: -Dspring.profiles.active=dev
   
   Environment variables:
   CONSUL_HOST=localhost
   CONSUL_PORT=8500
   MONGODB_HOST=localhost
   MONGODB_PORT=27017
   MONGODB_DATABASE=stattlabDB
   KAFKA_BROKERS=localhost:9092
   MINIO_HOST=localhost
   MINIO_PORT=9000
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin
   SERVER_PORT=8082
   ```

3. **Auth Service :**
   ```
   Name: Auth Service
   Main class: com.example.auth_service.AuthServiceApplication
   Working directory: $PROJECT_DIR$/auth-service
   Module: auth-service
   VM options: -Dspring.profiles.active=dev
   
   Environment variables:
   CONSUL_HOST=localhost
   CONSUL_PORT=8500
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=authdb
   DB_USER=authuser
   DB_PASSWORD=1234yasmine
   SERVER_PORT=8081
   ```

4. **API Gateway :**
   ```
   Name: API Gateway
   Main class: com.example.api_gatway.ApiGatewayApplication
   Working directory: $PROJECT_DIR$/api_gatway
   Module: api_gatway
   VM options: -Dspring.profiles.active=dev
   
   Environment variables:
   CONSUL_HOST=localhost
   CONSUL_PORT=8500
   REDIS_HOST=localhost
   REDIS_PORT=6379
   SERVER_PORT=8080
   ```

5. **Lancer dans l'ordre :**
   - Dataset Service
   - Auth Service
   - API Gateway

---

## 🎯 Option 2 : Lancer depuis la ligne de commande

Le script `DEMARRAGE-COMPLET.ps1` vous proposera de lancer les services automatiquement.

---

## ✅ Vérification

Après le démarrage, exécuter :

```powershell
.\verify-all.ps1
```

Ou tester manuellement :

```powershell
# Analysis Service
curl http://localhost:8000/health

# Dataset Service
curl http://localhost:8082/actuator/health

# Auth Service
curl http://localhost:8081/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health

# Consul
Start-Process "http://localhost:8500"
```

---

## 🔧 En Cas de Problème

1. **Port déjà utilisé :**
   ```powershell
   netstat -ano | findstr :8081
   taskkill /PID <PID> /F
   ```

2. **Service ne démarre pas :**
   ```powershell
   docker-compose logs -f [service-name]
   ```

3. **Réinitialiser tout :**
   ```powershell
   docker-compose down -v
   docker system prune -f
   .\DEMARRAGE-COMPLET.ps1
   ```

---

## 📞 Commandes Utiles

```powershell
# Voir tous les conteneurs
docker-compose ps

# Logs d'un service
docker-compose logs -f auth-service

# Arrêter tout
docker-compose down

# Redémarrer un service
docker-compose restart auth-service
```

---

## ✅ Checklist Finale

- [ ] Infrastructure Docker démarrée et healthy
- [ ] Analysis Service accessible (http://localhost:8000/health)
- [ ] Dataset Service démarré depuis IntelliJ
- [ ] Auth Service démarré depuis IntelliJ
- [ ] API Gateway démarré depuis IntelliJ
- [ ] Tous les services visibles dans Consul (http://localhost:8500)
- [ ] Tous les endpoints répondent (200 OK)

**Si tous les points sont cochés → Votre projet est 100% opérationnel ! 🎉**

