# ✅ Corrections Appliquées - StatLabIA

## 🔧 Problèmes Résolus

### 1. **Erreur Consul Discovery Client (API Gateway & Auth Service)**

**Problème :** 
```
more than one 'primary' bean found among candidates: 
[consulReactiveDiscoveryClient, reactiveCompositeDiscoveryClient, simpleReactiveDiscoveryClient]
```

**Solution appliquée :**
- ✅ Exclusion de `CompositeDiscoveryClientAutoConfiguration` dans `ApiGatewayApplication` et `AuthServiceApplication`
- ✅ Ajout de `@EnableDiscoveryClient` pour activer explicitement la découverte
- ✅ Modification de `ConsulConfig` pour marquer le client Consul comme primaire
- ✅ Correction de `LoadBalancerConfig` avec `@Configuration`

**Fichiers modifiés :**
- `api_gatway/src/main/java/com/example/api_gatway/ApiGatewayApplication.java`
- `api_gatway/src/main/java/com/example/api_gatway/security/ConsulConfig.java`
- `api_gatway/src/main/java/com/example/api_gatway/config/LoadBalancerConfig.java`
- `auth-service/src/main/java/com/example/auth_service/AuthServiceApplication.java`
- `auth-service/src/main/resources/application.yml`
- `api_gatway/src/main/resources/application.yml`

### 2. **Frontend - Configuration API**

**Solution appliquée :**
- ✅ Création de `StatLabIA-frontend/src/config/api.ts` avec configuration centralisée
- ✅ Service API avec gestion des tokens JWT
- ✅ Helpers pour authentification (login, register, logout)

**Fichiers créés :**
- `StatLabIA-frontend/src/config/api.ts`

---

## 🚀 Instructions de Démarrage Finales

### ÉTAPE 1 : Lancer l'Infrastructure Docker

```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project
.\DEMARRAGE-COMPLET.ps1
```

**Répondre :**
- Ports utilisés ? → `N` (normal si Docker les utilise)
- Lancer les services Spring Boot ? → `O` (Oui) ou `N` (si vous préférez IntelliJ)

### ÉTAPE 2 : Vérifier que l'Infrastructure est Prête

```powershell
docker-compose ps
```

Tous les conteneurs doivent être "Up" :
- ✅ consul
- ✅ redis
- ✅ postgres-auth
- ✅ mongodb
- ✅ minio
- ✅ zookeeper
- ✅ kafka
- ✅ analysis-service

### ÉTAPE 3 : Lancer les Services Spring Boot

#### Option A : Depuis IntelliJ IDEA (Recommandé)

1. **Ouvrir IntelliJ IDEA**
2. **Ouvrir le projet** : `C:\Users\PC\Desktop\last\Statlab_IA_Project`
3. **Créer les Run Configurations** (voir `GUIDE_INTELLIJ.md`)
4. **Lancer dans l'ordre :**
   - Dataset Service (port 8082)
   - Auth Service (port 8081)
   - API Gateway (port 8080)

#### Option B : Depuis la Ligne de Commande

Si vous avez répondu `O` dans le script, les services sont déjà en cours de démarrage dans des fenêtres PowerShell séparées.

### ÉTAPE 4 : Vérifier que Tout Fonctionne

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

# Consul UI
Start-Process "http://localhost:8500"
```

### ÉTAPE 5 : Lancer le Frontend React

```powershell
cd C:\Users\PC\Desktop\last\StatLabIA-frontend
npm install
npm run dev
```

Le frontend sera accessible sur : **http://localhost:3000**

---

## ✅ Checklist de Vérification Finale

- [ ] Infrastructure Docker démarrée (tous les conteneurs "Up")
- [ ] Analysis Service accessible (http://localhost:8000/health)
- [ ] Dataset Service démarré et accessible (http://localhost:8082/actuator/health)
- [ ] Auth Service démarré et accessible (http://localhost:8081/actuator/health)
- [ ] API Gateway démarré et accessible (http://localhost:8080/actuator/health)
- [ ] Tous les services visibles dans Consul (http://localhost:8500)
- [ ] Frontend React lancé (http://localhost:3000)
- [ ] Pas d'erreurs dans les logs des services

---

## 🔍 En Cas de Problème

### Services Spring Boot ne démarrent pas

1. **Vérifier les logs :**
   ```powershell
   # Dans IntelliJ : Voir les logs de la console
   # En ligne de commande : Regarder les fenêtres PowerShell
   ```

2. **Vérifier que les services Docker sont accessibles :**
   ```powershell
   # PostgreSQL
   docker exec postgres-auth psql -U authuser -d authdb -c "SELECT 1;"
   
   # MongoDB
   docker exec mongodb mongosh --eval "1+1"
   
   # Consul
   curl http://localhost:8500/v1/status/leader
   ```

3. **Vérifier les variables d'environnement :**
   - Dans IntelliJ : Run Configuration → Environment variables
   - Vérifier que `CONSUL_HOST=localhost` (pas `consul` si lancé depuis l'hôte)

### Erreur "Connection refused" ou "UnknownHostException"

- ✅ Si services lancés depuis IntelliJ : Utiliser `localhost` au lieu de `consul`
- ✅ Si services lancés depuis Docker : Utiliser les noms de conteneurs (`consul`, `postgres-auth`, etc.)

### Frontend ne se connecte pas à l'API

1. **Vérifier que l'API Gateway est accessible :**
   ```powershell
   curl http://localhost:8080/actuator/health
   ```

2. **Vérifier la configuration API dans le frontend :**
   - Créer un fichier `.env` dans `StatLabIA-frontend/` :
     ```
     VITE_API_BASE_URL=http://localhost:8080
     ```
   - Redémarrer le serveur de développement : `npm run dev`

---

## 📝 Notes Importantes

1. **Ports utilisés :**
   - 8080 : API Gateway
   - 8081 : Auth Service
   - 8082 : Dataset Service
   - 8000 : Analysis Service (Python)
   - 8500 : Consul UI
   - 5432 : PostgreSQL
   - 6379 : Redis
   - 9092 : Kafka
   - 27017 : MongoDB
   - 9000-9001 : MinIO

2. **Ordre de démarrage important :**
   - Infrastructure Docker d'abord
   - Puis Dataset Service
   - Puis Auth Service
   - Enfin API Gateway

3. **Les services Spring Boot doivent pouvoir accéder à :**
   - Consul (pour la découverte de services)
   - PostgreSQL/MongoDB (selon le service)
   - Kafka (pour dataset-service)
   - Redis (pour api-gateway)

---

## 🎉 Si Tout Fonctionne

Vous devriez pouvoir :
- ✅ Accéder au frontend sur http://localhost:3000
- ✅ Vous authentifier (login/register)
- ✅ Uploader des datasets
- ✅ Effectuer des analyses
- ✅ Voir les résultats et visualisations

**Félicitations ! Votre projet StatLabIA est opérationnel ! 🚀**


