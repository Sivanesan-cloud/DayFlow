#!/usr/bin/env bash
set -euo pipefail
[[ -f server/.env ]] || cp server/.env.example server/.env
[[ -f client/.env ]] || cp client/.env.example client/.env
echo "Starting PostgreSQL..."
if command -v docker >/dev/null 2>&1; then
  docker compose up -d postgres
else
  echo "Docker not found. Using the locally installed PostgreSQL service."
fi
echo "Installing server dependencies and seeding data..."
(cd server && npm install && npm run seed)
echo "Dayflow database is ready."
echo "Run the API with: cd server && npm start"
