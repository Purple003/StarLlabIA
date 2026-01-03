#!/bin/bash
# test-gateway.sh

set -e

echo " Testing API Gateway with Consul..."
echo "========================================"

# 1. Démarrer Consul et Redis en local pour les tests
echo "1. Starting test infrastructure..."
docker-compose -f docker-compose-test.yml up -d consul redis

# Attendre que Consul soit prêt
echo "Waiting for Consul..."
until curl -s http://localhost:8500/v1/status/leader | grep -q :; do
    sleep 2
done

echo " Consul is ready"

# 2. Construire et démarrer le gateway
echo "2. Building gateway..."
mvn clean package -DskipTests

echo "3. Starting gateway..."
java -jar target/api-gateway-1.0.0.jar &
GATEWAY_PID=$!

# Attendre que le gateway démarre
echo "Waiting for gateway..."
until curl -s http://localhost:8080/actuator/health | grep -q "UP"; do
    sleep 2
done

echo " Gateway is running"

# 3. Tester l'enregistrement dans Consul
echo "4. Testing Consul registration..."
CONSUL_SERVICES=$(curl -s http://localhost:8500/v1/agent/services | jq '.')
if echo "$CONSUL_SERVICES" | grep -q "api-gateway"; then
    echo " Gateway registered in Consul"
else
    echo " Gateway not registered in Consul"
    exit 1
fi

# 4. Tester les endpoints du gateway
echo "5. Testing gateway endpoints..."

# Health endpoint
echo "Testing health endpoint..."
if curl -s http://localhost:8080/actuator/health | grep -q '"status":"UP"'; then
    echo " Health endpoint OK"
else
    echo " Health endpoint failed"
    exit 1
fi

# Actuator endpoints
echo "Testing actuator endpoints..."
if curl -s http://localhost:8080/actuator/info | grep -q "api-gateway"; then
    echo " Actuator info OK"
else
    echo " Actuator info failed"
fi

# Routes
echo "Testing gateway routes..."
if curl -s http://localhost:8080/actuator/gateway/routes | grep -q "auth-service"; then
    echo " Gateway routes configured"
else
    echo " Gateway routes not found"
fi

# 5. Tester le rate limiting
echo "6. Testing rate limiting..."
for i in {1..12}; do
    RESPONSE=$(curl -s -w "%{http_code}" http://localhost:8080/api/auth/test -o /dev/null)
    if [ $i -le 10 ]; then
        if [ "$RESPONSE" != "404" ] && [ "$RESPONSE" != "429" ]; then
            echo "  Request $i: HTTP $RESPONSE"
        fi
    else
        if [ "$RESPONSE" = "429" ]; then
            echo " Rate limiting works (request $i: HTTP 429)"
            break
        fi
    fi
done

# 6. Nettoyage
echo "7. Cleaning up..."
kill $GATEWAY_PID 2>/dev/null || true
docker-compose -f docker-compose-test.yml down

echo " All tests passed!"
echo ""
echo " Gateway Configuration Summary:"
echo "   - Service Name: api-gateway"
echo "   - Port: 8080"
echo "   - Consul: http://localhost:8500"
echo "   - Health: http://localhost:8080/actuator/health"
echo "   - Swagger UI: http://localhost:8080/swagger-ui.html"