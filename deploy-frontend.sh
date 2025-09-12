#!/usr/bin/env bash
set -euo pipefail

# Netlify site ID for welovemovies-frontend (change if yours differs)
SITE_ID="facc602e-593a-4815-8839-763015eac0e6"

# 1) Build inside frontend so local vite is used
pushd frontend >/dev/null

# If deps aren’t installed (or you nuked node_modules), install them
if [ ! -d node_modules ]; then
  echo "Installing frontend deps..."
  npm ci --no-audit --no-fund
fi

# Build (uses frontend/package.json scripts and local vite)
npm run build
popd >/dev/null

# 2) Deploy the prebuilt dist to Netlify
echo "Deploying to Netlify…"
npx -y netlify-cli deploy \
  --site "$SITE_ID" \
  --dir "frontend/dist" \
  --prod \
  --message "manual deploy $(date '+%Y-%m-%d %H:%M:%S')"