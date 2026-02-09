#!/bin/sh
set -e

echo "🚀 Starting Backend Container..."
echo "📂 Working directory: $(pwd)"

# Ensure database directory exists and is writable
if [ -d "prisma" ]; then
    echo "✅ Prisma directory found."
else
    echo "⚠️ Prisma directory not found, creating..."
    mkdir -p prisma
fi

echo "🔄 Running database migrations..."
if npx prisma migrate deploy; then
    echo "✅ Migrations applied successfully."
else
    echo "❌ Migration failed! Check your database configuration."
    # We don't exit here immediately to allow debugging if needed, 
    # but normally we should. For now, let's try to proceed or sleep?
    # Let's exit to signal failure to the orchestrator.
    exit 1
fi

echo "🌱 Seeding database (if needed)..."
# Optional: Run seed if specific env var is set or just always try safely?
# npx prisma db seed || echo "⚠️ Seed failed or not needed."

echo "🔥 Starting NestJS application..."
exec node dist/main
