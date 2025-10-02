#!/usr/bin/env bash
set -euo pipefail

URL="${1:-http://127.0.0.1:5000/health}"
TRIES="${2:-60}"

for i in $(seq 1 "$TRIES"); do
  if curl -fsS "$URL" >/dev/null; then
    echo "✅ Healthy at $URL"
    exit 0
  fi
  echo "⏳ Waiting for $URL ($i/$TRIES)..."
  sleep 2
done

echo "❌ API failed to become healthy at $URL"
exit 1
