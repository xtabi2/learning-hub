#!/bin/sh
set -e
NEED_SEED=0
if [ ! -f /data/dev.db ]; then
  NEED_SEED=1
fi
# Apply schema on every boot so additive fields (e.g. Child.isDemo) reach existing volumes.
echo "Applying Prisma schema (db push)..."
npx prisma db push
if [ "$NEED_SEED" = "1" ]; then
  echo "Seeding SQLite database..."
  npx tsx prisma/seed.ts
fi
exec "$@"
