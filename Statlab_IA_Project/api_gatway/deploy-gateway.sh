#!/bin/bash
# deploy-gateway.sh

set -e

echo " Deploying API Gateway..."
echo "==========================="

ENVIRONMENT=${1:-dev}
CONSUL_HOST=${CONSUL_HOST:-localhost}
CONSUL_PORT=${CONSUL_PORT:-8500}

echo "Environment: $ENVIRONMENT"
echo "Consul: $CONSUL_HOST:$CONSUL_PORT"

# 1. Vérifier la connexion à Consul
echo "1. Testing Consul connection..."
if curl -s "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/status/leader" | grep -q :; then
    echo "✅ Consul is accessible"
else
    echo "❌ Cannot connect to Consul"
    exit 1
fi

# 2. Charger la configuration depuis Consul
echo "2. Loading configuration from Consul..."
CONFIG_EXISTS=$(curl -s "http://${CONSUL_HOST}:${CONSUL_PORT}/v1/kv/config/api-gateway/${ENVIRONMENT}?raw" || echo "")

if [ -n "$CONFIG_EXISTS" ]; then
    echo "✅ Configuration found in Consul"
else
    echo "⚠️  No configuration in Consul, using defaults"
fi

# 3. Construire l'image Docker
echo "3. Building Docker image..."
docker build -t statlabia/api-gateway:latest -t statlabia/api-gateway:${ENVIRONMENT} .

# 4. Pousser l'image (si en prod)
if [ "$ENVIRONMENT" = "prod" ]; then
    echo "4. Pushing to registry..."
    docker push statlabia/api-gateway:latest
    docker push statlabia/api-gateway:${ENVIRONMENT}
fi

# 5. Déployer avec Docker Compose
echo "5. Deploying with Docker Compose..."
cat > docker-compose-${ENVIRONMENT}.yml << EOF
version: '3.8'

services:
  api-gateway:
    image: statlabia/api-gateway:${ENVIRONMENT}
    container_name: api-gateway-${ENVIRONMENT}
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=${ENVIRONMENT}
      - CONSUL_HOST=${CONSUL_HOST}
      - CONSUL_PORT=${CONSUL_PORT}
      - JWT_SECRET=\${JWT_SECRET}
      - REDIS_HOST=\${REDIS_HOST}
      - REDIS_PORT=\${REDIS_PORT}
    restart: unless-stopped
    networks:
      - statlabia-network

networks:
  statlabia-network:
    external: true
EOF

docker-compose -f docker-compose-${ENVIRONMENT}.yml up -d

# 6. Vérifier le déploiement
echo "6. Verifying deployment..."
sleep 10

if curl -s http://localhost:8080/actuator/health | grep -q '"status":"UP"'; then
    echo " Gateway deployed successfully!"
    echo ""
    echo " Gateway URL: http://localhost:8080"
    echo " Health check: http://localhost:8080/actuator/health"
    echo " API Docs: http://localhost:8080/swagger-ui.html"
    echo " Consul UI: http://${CONSUL_HOST}:${CONSUL_PORT}"
else
    echo " Gateway deployment failed"
    docker-compose -f docker-compose-${ENVIRONMENT}.yml logs
    exit 1
fi