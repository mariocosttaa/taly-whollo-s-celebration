#!/bin/bash

# Script de Operações para o Backend (Produção/Docker)
# Use este script para acessar o terminal do container backend ou ver logs.

# Função para encontrar o ID do container
get_container_id() {
    # 1. Tenta encontrar pelo label do docker-compose (padrão)
    local id=$(docker ps --filter "label=com.docker.compose.service=backend" --format "{{.ID}}" | head -n 1)
    
    # 2. Se não encontrar, tenta pelo nome (fallback)
    if [ -z "$id" ]; then
        id=$(docker ps --filter "name=backend" --format "{{.ID}}" | head -n 1)
    fi
    
    echo "$id"
}

# Verifica se o docker está disponível
if ! command -v docker &> /dev/null; then
    echo "❌ Erro: Comando 'docker' não encontrado."
    exit 1
fi

CONTAINER_ID=$(get_container_id)

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ Erro: Container do backend não encontrado."
    echo "Certifique-se de que o deploy foi feito e o container está rodando."
    echo "Tente rodar: docker ps"
    exit 1
fi

echo "✅ Container encontrado: $CONTAINER_ID"

COMMAND=$1

case $COMMAND in
    "logs")
        echo "📋 Exibindo logs (Ctrl+C para sair)..."
        docker logs -f $CONTAINER_ID
        ;;
    "shell"|"")
        echo "🚀 Abrindo terminal no backend..."
        echo "Use 'exit' para sair."
        # Tenta sh primeiro (Alpine), depois bash
        docker exec -it $CONTAINER_ID sh || docker exec -it $CONTAINER_ID bash
        ;;
    "migrate")
        echo "🔄 Rodando migrações do banco de dados..."
        docker exec -it $CONTAINER_ID npx prisma migrate deploy
        ;;
    "seed")
        echo "🌱 Rodando seed do banco de dados..."
        docker exec -it $CONTAINER_ID npx prisma db seed
        ;;
    *)
        echo "Uso: ./ops.sh [shell|logs|migrate|seed]"
        ;;
esac
