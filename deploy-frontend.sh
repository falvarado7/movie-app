#!/usr/bin/env bash
set -euo pipefail

# REQUIREMENTS:
# - Netlify CLI installed:  npm i -g netlify-cli
# - NETLIFY_AUTH_TOKEN exported once in your shell
# - Replace SITE_ID with your actual site id (from `netlify sites:list`)

SITE_ID="facc602e-593a-4815-8839-763015eac0e6"  # welovemovies-frontend

# Build the frontend (workspace-aware)
npm run -w frontend build

# Deploy the already-built static files
netlify deploy \
  --dir=frontend/dist \
  --site="$SITE_ID" \
  --prod \
  --message "manual deploy $(date '+%Y-%m-%d %H:%M:%S')"