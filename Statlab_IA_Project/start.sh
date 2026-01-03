#!/bin/bash

echo "🚀 Démarrage de StatLabIA Microservices..."

# Vérifier que Docker est en cours d'exécution
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas en cours d'exécution. Veuillez démarrer Docker Desktop."
    exit 1
fi

# Démarrer les services
echo "📦 Démarrage des services avec Docker Compose..."
docker-compose up -d

echo "⏳ Attente du démarrage des services..."
sleep 10

# Vérifier les services
echo "🔍 Vérification des services..."
docker-compose ps

echo ""
echo "✅ Services démarrés!"
echo ""
echo "📍 URLs importantes:"
echo "  - Consul UI: http://localhost:8500"
echo "  - API Gateway: http://localhost:8080"
echo "  - Analysis Service: http://localhost:8000"
echo "  - Auth Service: http://localhost:8081"
echo "  - Dataset Service: http://localhost:8082"
echo "  - MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
echo ""
echo "📊 Voir les logs: docker-compose logs -f [service-name]"
echo "🛑 Arrêter les services: docker-compose down"


