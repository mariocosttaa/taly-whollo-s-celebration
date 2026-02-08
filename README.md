# Taly & Whollo's Celebration

Site de celebração do casamento de Wholly e Taly.

## Tecnologias

- Vite
- TypeScript
- React
- Tailwind CSS
- Shadcn UI
- Backend: NestJS (REST API)
- Database: SQLite (Prisma)
- Container: Docker

## Instalação e Execução

### Pré-requisitos

- Node.js
- Docker (opcional, para ambiente containerizado)

### Desenvolvimento Local

1.  Clone o repositório
2.  Instale as dependências:
    ```bash
    npm install
    cd backend && npm install
    ```
3.  Execute o frontend:
    ```bash
    npm run dev
    ```
4.  Execute o backend:
    ```bash
    cd backend
    npm run start:dev
    ```

### Criar Administrador

Para criar um utilizador administrador para o dashboard:

```bash
cd backend
npm run create-user
```

## Deploy

O projeto está configurado com Docker para facilitar o deploy.

```bash
docker-compose up -d --build
```

## Gestão em Produção (Docker)

Para facilitar o acesso ao terminal do backend em produção, use o script `ops.sh`:

```bash
# Acessar o terminal do backend (shell)
./ops.sh

# Ver logs
./ops.sh logs

# Rodar migrações
./ops.sh migrate
```
