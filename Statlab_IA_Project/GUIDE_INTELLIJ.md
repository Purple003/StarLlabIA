# Guide IntelliJ IDEA - Configuration des Services Spring Boot

## IMPORTANT : Où lancer les services ?

### ✅ Services à lancer depuis IntelliJ IDEA :
1. **auth-service** (port 8081)
2. **dataset-service** (port 8082)
3. **api-gateway** (port 8080)
4. **report-service** (port 8083) - optionnel
5. **orchestrator-service** (port 8084) - optionnel

### ✅ Services lancés automatiquement via Docker :
- consul
- redis
- postgres-auth
- mongodb
- minio
- zookeeper
- kafka
- analysis-service (port 8000)

---

## Étape 1 : Ouvrir le Projet dans IntelliJ IDEA

1. Ouvrir IntelliJ IDEA
2. **File → Open**
3. Sélectionner le dossier `Statlab_IA_Project`
4. Attendre que Maven importe toutes les dépendances (barre de progression en bas)

---

## Étape 2 : Configurer Dataset Service

### 2.1 Créer la Configuration Run

1. Aller dans **Run → Edit Configurations...**
2. Cliquer sur le **+** en haut à gauche
3. Sélectionner **Application**

### 2.2 Remplir les Champs

```
Name: Dataset Service
Main class: com.example.dataset_service.DatasetServiceApplication
Working directory: $PROJECT_DIR$/dataset_service
Use classpath of module: dataset_service (cliquer sur la liste déroulante)
VM options: -Dspring.profiles.active=dev
```

### 2.3 Ajouter les Variables d'Environnement

Cliquer sur **Environment variables** (icône avec 3 points) et ajouter :

```
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
```

### 2.4 Sauvegarder

Cliquer sur **Apply** puis **OK**

---

## Étape 3 : Configurer Auth Service

### 3.1 Créer une Nouvelle Configuration

1. **Run → Edit Configurations...**
2. Cliquer sur **+** → **Application**

### 3.2 Remplir les Champs

```
Name: Auth Service
Main class: com.example.auth_service.AuthServiceApplication
Working directory: $PROJECT_DIR$/auth-service
Use classpath of module: auth-service
VM options: -Dspring.profiles.active=dev
```

### 3.3 Variables d'Environnement

```
CONSUL_HOST=localhost
CONSUL_PORT=8500
DB_HOST=localhost
DB_PORT=5432
DB_NAME=authdb
DB_USER=authuser
DB_PASSWORD=1234yasmine
SERVER_PORT=8081
```

### 3.4 Sauvegarder

**Apply** → **OK**

---

## Étape 4 : Configurer API Gateway

### 4.1 Créer une Nouvelle Configuration

1. **Run → Edit Configurations...**
2. Cliquer sur **+** → **Application**

### 4.2 Remplir les Champs

```
Name: API Gateway
Main class: com.example.api_gatway.ApiGatewayApplication
Working directory: $PROJECT_DIR$/api_gatway
Use classpath of module: api_gatway
VM options: -Dspring.profiles.active=dev
```

### 4.3 Variables d'Environnement

```
CONSUL_HOST=localhost
CONSUL_PORT=8500
REDIS_HOST=localhost
REDIS_PORT=6379
SERVER_PORT=8080
```

### 4.4 Sauvegarder

**Apply** → **OK**

---

## Étape 5 : Ordre de Démarrage

### Ordre Recommandé :

1. **Démarrer l'infrastructure Docker** (déjà fait avec start-all.ps1)
2. **Dataset Service** (IntelliJ)
3. **Auth Service** (IntelliJ)
4. **API Gateway** (IntelliJ)

### Comment Lancer :

1. Dans la barre d'outils en haut, il y a un menu déroulant avec "Dataset Service", "Auth Service", "API Gateway"
2. Sélectionner "Dataset Service"
3. Cliquer sur le bouton **Run** (triangle vert ▶️)
4. Attendre que le service démarre (voir console)
5. Répéter pour "Auth Service" puis "API Gateway"

---

## Étape 6 : Vérifier que les Services Démarrant Correctement

### 6.1 Vérifier dans la Console IntelliJ

Pour chaque service, vous devriez voir :
```
Started DatasetServiceApplication in X seconds
Started AuthServiceApplication in X seconds
Started ApiGatewayApplication in X seconds
```

### 6.2 Vérifier les Erreurs

Si vous voyez des erreurs comme :
- `UnknownHostException` → Vérifier que Docker est démarré
- `Connection refused` → Vérifier que les services Docker sont Up
- `JDBCConnectionException` → Vérifier PostgreSQL et les credentials

### 6.3 Tester les Endpoints

Ouvrir un navigateur ou utiliser curl :

```powershell
# Dataset Service
curl http://localhost:8082/actuator/health

# Auth Service
curl http://localhost:8081/actuator/health

# API Gateway
curl http://localhost:8080/actuator/health
```

---

## Étape 7 : Configuration Compound (Optionnel)

Pour lancer plusieurs services en même temps :

1. **Run → Edit Configurations...**
2. Cliquer sur **+** → **Compound**
3. Nom : **All Services**
4. Dans la liste, ajouter :
   - Dataset Service
   - Auth Service
   - API Gateway
5. **Apply** → **OK**

Maintenant, vous pouvez lancer tous les services d'un coup !

---

## Problèmes Courants et Solutions

### Problème : "Module not found"
**Solution :** Aller dans **File → Project Structure → Modules** et vérifier que tous les modules sont présents

### Problème : "Main class not found"
**Solution :** Vérifier que le nom de la classe principale est correct et que le package existe

### Problème : "Port already in use"
**Solution :** 
1. Vérifier quel processus utilise le port : `netstat -ano | findstr :8081`
2. Arrêter le processus ou changer le port dans les variables d'environnement

### Problème : "Connection refused to Consul"
**Solution :** Vérifier que Consul est démarré : `docker-compose ps consul`

---

## Checklist de Vérification

Après avoir lancé tous les services, vérifier :

- [ ] Dataset Service démarre sans erreur (port 8082)
- [ ] Auth Service démarre sans erreur (port 8081)
- [ ] API Gateway démarre sans erreur (port 8080)
- [ ] Analysis Service est accessible (port 8000) via Docker
- [ ] Tous les services sont visibles dans Consul (http://localhost:8500)
- [ ] Tous les endpoints répondent (health checks)
- [ ] Aucune erreur dans les consoles IntelliJ

---

## Résumé Rapide

1. **Docker** → Lancer `.\start-all.ps1` (infrastructure + analysis-service)
2. **IntelliJ** → Lancer Dataset Service
3. **IntelliJ** → Lancer Auth Service
4. **IntelliJ** → Lancer API Gateway
5. **Vérifier** → Utiliser `.\verify-all.ps1`

C'est tout ! 🎉


