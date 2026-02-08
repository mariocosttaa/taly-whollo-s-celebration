#!/bin/bash

# Script de Operações para o Backend
# Suporta execução no Host (via Docker) ou dentro do Container (Coolify Terminal)

# Verifica se está rodando dentro do container (verificando .dockerenv ou cgroups)
IS_INSIDE_CONTAINER=0
if [ -f /.dockerenv ] || grep -q "docker" /proc/1/cgroup 2>/dev/null; then
    IS_INSIDE_CONTAINER=1
fi

COMMAND=$1

# --- EXECUÇÃO DENTRO DO CONTAINER ---
if [ "$IS_INSIDE_CONTAINER" -eq 1 ]; then
    echo "🐳 Detectado ambiente Docker (Container)."
    
    case $COMMAND in
        "migrate")
            echo "🔄 Rodando migrações do banco de dados..."
            cd /app && npx prisma migrate deploy
            ;;
        "seed")
            echo "🌱 Rodando seed do banco de dados..."
            cd /app && npx prisma db seed
            ;;
        "create-user")
            echo "👤 Criando usuário administrador..."
            cd /app && npm run create-user
            ;;
        "shell")
            echo "⚠️  Você já está no terminal do container."
            ;;
        "logs")
            echo "⚠️  Para ver logs dentro do container, verifique a saída padrão da aplicação (stdout)."
            ;;
        *)
            echo "Uso (dentro do container): ./ops.sh [migrate|seed|create-user]"
            ;;
    esac
    exit 0
fi

# --- EXECUÇÃO NO HOST (FORA DO CONTAINER) ---

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

# Verifica se o docker está disponível no host
if ! command -v docker &> /dev/null; then
    echo "❌ Erro: Comando 'docker' não encontrado e não estamos dentro de um container."
    exit 1
fi

CONTAINER_ID=$(get_container_id)

if [ -z "$CONTAINER_ID" ]; then
    echo "❌ Erro: Container do backend não encontrado."
    echo "Certifique-se de que o deploy foi feito e o container está rodando."
    echo "Tente rodar: docker ps"
    exit 1
fi

echo "✅ Container encontrado (Host Mode): $CONTAINER_ID"

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
    "create-user")
        echo "👤 Criando usuário administrador..."
        docker exec -it $CONTAINER_ID npm run create-user
        ;;
    *)
        echo "Uso: ./ops.sh [shell|logs|migrate|seed|create-user]"
        ;;
esac
