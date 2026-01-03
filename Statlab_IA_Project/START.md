# Commandes pour démarrer le projet

## 1. Nettoyer les conteneurs existants (si nécessaire)
```powershell
cd C:\Users\PC\Desktop\last\Statlab_IA_Project
docker-compose down -v
```

## 2. Construire et démarrer tous les services
```powershell
docker-compose up -d --build
```

## 3. Vérifier le statut des services
```powershell
docker-compose ps
```

## 4. Voir les logs en temps réel
```powershell
docker-compose logs -f
```

## 5. Voir les logs d'un service spécifique
```powershell
docker-compose logs -f auth-service
docker-compose logs -f analysis-service
docker-compose logs -f api-gateway
```

## 6. Arrêter les services
```powershell
docker-compose down
```

## URLs des services
- Consul UI: http://localhost:8500
- API Gateway: http://localhost:8080
- Analysis Service: http://localhost:8000/health
- Auth Service: http://localhost:8081/actuator/health
- Dataset Service: http://localhost:8082/actuator/health
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin)


