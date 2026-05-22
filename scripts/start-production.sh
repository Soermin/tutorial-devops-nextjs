#!/bin/sh
set -eu

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is not configured. Starting app without database initialization."
  exec node server.js
fi

echo "Applying Prisma schema..."
attempt=1
max_attempts=30

until npx prisma db push; do
  if [ "$attempt" -ge "$max_attempts" ]; then
    echo "Failed to apply Prisma schema after ${max_attempts} attempts."
    exit 1
  fi

  echo "Database is not ready yet. Retrying in 2 seconds..."
  attempt=$((attempt + 1))
  sleep 2
done

echo "Seeding initial data..."
node prisma/seed.mjs

echo "Starting Next.js server..."
exec node server.js
