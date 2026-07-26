@echo off
setlocal enabledelayedexpansion

echo ==============================================================================
echo                 PROMPTLESS AI - WINDOWS DEVELOPER SETUP (setup.bat)
echo ==============================================================================
echo.

:: 1. Verify Node.js installation
echo [1/6] Verifying Node.js installation...
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js 20.x or higher from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo       Node.js version detected: %NODE_VERSION%
echo.

:: 2. Verify npm installation
echo [2/6] Verifying npm installation...
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed or not in PATH!
    exit /b 1
)
for /f "tokens=*" %%v in ('npm -v') do set NPM_VERSION=%%v
echo       npm version detected: %NPM_VERSION%
echo.

:: 3. Install root Next.js dependencies
echo [3/6] Installing root Next.js 15 application dependencies...
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install root dependencies!
    exit /b 1
)
echo       Root dependencies installed successfully.
echo.

:: 4. Install Chrome Extension Manifest V3 dependencies
echo [4/6] Installing Chrome Extension Side Panel dependencies...
cd chrome-extension
call npm install
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install Chrome Extension dependencies!
    cd ..
    exit /b 1
)
cd ..
echo       Chrome Extension dependencies installed successfully.
echo.

:: 5. Check and create .env.local from .env.example if missing
echo [5/6] Checking local environment configuration (.env.local)...
if not exist ".env.local" (
    echo       .env.local not found. Creating from .env.example...
    copy ".env.example" ".env.local" >nul
    echo       Created .env.local!
) else (
    echo       .env.local already exists. Preserving existing configuration.
)
echo.

:: 6. Display manual configuration requirements
echo ==============================================================================
echo [6/6] SETUP COMPLETE! NEXT STEPS:
echo ==============================================================================
echo 1. Open .env.local in your editor and enter your credentials:
echo    - NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
echo    - SUPABASE_SERVICE_ROLE_KEY
echo    - GEMINI_API_KEY (from https://aistudio.google.com/)
echo.
echo 2. For detailed help finding credentials, refer to:
echo    - MANUAL_SETUP.md
echo    - START_HERE.md
echo.
echo 3. When ready, launch the project with:
echo    - run.bat
echo ==============================================================================
echo.
endlocal
