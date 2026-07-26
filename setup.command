#!/usr/bin/env bash
set -e

# Change to the directory where the script is located
cd "$(dirname "$0")"

echo "=============================================================================="
echo "                 PROMPTLESS AI - MACOS/LINUX SETUP (setup.command)"
echo "=============================================================================="
echo ""

# 1. Verify Node.js
echo "[1/6] Verifying Node.js installation..."
if ! command -v node &> /dev/null; then
  echo "[ERROR] Node.js is not installed or not in PATH!"
  echo "Please install Node.js 20.x or higher from https://nodejs.org/"
  exit 1
fi
NODE_VERSION=$(node -v)
echo "      Node.js version detected: $NODE_VERSION"
echo ""

# 2. Verify npm
echo "[2/6] Verifying npm installation..."
if ! command -v npm &> /dev/null; then
  echo "[ERROR] npm is not installed or not in PATH!"
  exit 1
fi
NPM_VERSION=$(npm -v)
echo "      npm version detected: $NPM_VERSION"
echo ""

# 3. Install root Next.js dependencies
echo "[3/6] Installing root Next.js 15 application dependencies..."
npm install
echo "      Root dependencies installed successfully."
echo ""

# 4. Install Chrome Extension dependencies
echo "[4/6] Installing Chrome Extension Side Panel dependencies..."
cd chrome-extension && npm install && cd ..
echo "      Chrome Extension dependencies installed successfully."
echo ""

# 5. Create .env.local if missing
echo "[5/6] Checking local environment configuration (.env.local)..."
if [ ! -f .env.local ]; then
  echo "      .env.local not found. Creating from .env.example..."
  cp .env.example .env.local
  echo "      Created .env.local!"
else
  echo "      .env.local already exists. Preserving existing configuration."
fi
echo ""

# 6. Display manual configuration steps
echo "=============================================================================="
echo "[6/6] SETUP COMPLETE! NEXT STEPS:"
echo "=============================================================================="
echo "1. Open .env.local in your editor and enter your credentials:"
echo "   - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE_KEY"
echo "   - GEMINI_API_KEY (from https://aistudio.google.com/)"
echo ""
echo "2. For detailed help finding credentials, refer to:"
echo "   - MANUAL_SETUP.md"
echo "   - START_HERE.md"
echo ""
echo "3. When ready, launch the project with:"
echo "   - ./run.command"
echo "=============================================================================="
echo ""
