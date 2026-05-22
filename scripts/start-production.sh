#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not configured. Starting app without database initialization."
  exec node server.js
fi

echo "Applying Prisma schema..."
until npx prisma db push --skip-generate; do
  echo "Database is not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "Seeding initial data..."
node prisma/seed.mjs

echo "Starting Next.js server..."
exec node server.js
