#!/usr/bin/env bash
set -e

# Change to the directory where the script is located
cd "$(dirname "$0")"

echo "=============================================================================="
echo "                 PROMPTLESS AI - LAUNCHING VENTURE-GRADE STACK (run.command)"
echo "=============================================================================="
echo ""

# 1. Build Chrome Extension Side Panel bundle
echo "[1/3] Building Chrome Extension Manifest V3 production bundle..."
cd chrome-extension && npm run build && cd ..
echo "      Chrome Extension bundle generated in $(pwd)/chrome-extension/dist"
echo ""

# 2. Display development environment URLs
echo "[2/3] Application URLs:"
echo "      - Web Landing Page & SaaS Dashboard: http://localhost:3000"
echo "      - Chrome Extension Load Path:        $(pwd)/chrome-extension/dist"
echo ""

# 3. Automatically open default browser and start Next.js dev server
echo "[3/3] Opening browser and starting Next.js 15 App Router server..."
if command -v open &> /dev/null; then
  open "http://localhost:3000"
elif command -v xdg-open &> /dev/null; then
  xdg-open "http://localhost:3000" &> /dev/null &
fi

echo ""
echo "Press Ctrl+C to stop the development server."
npm run dev
