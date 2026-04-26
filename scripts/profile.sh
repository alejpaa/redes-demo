#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  printf 'Uso: %s <good|normal|bad>\n' "$0"
  exit 1
fi

profile="$1"
curl -sS -X POST "http://localhost:8000/profile/${profile}" | python -m json.tool
