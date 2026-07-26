@echo off
setlocal enabledelayedexpansion

echo ==============================================================================
echo                 PROMPTLESS AI - LAUNCHING VENTURE-GRADE STACK (run.bat)
echo ==============================================================================
echo.

:: 1. Build Chrome Extension Side Panel bundle
echo [1/3] Building Chrome Extension Manifest V3 production bundle...
cd chrome-extension
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Chrome Extension build failed!
    cd ..
    exit /b 1
)
cd ..
echo       Chrome Extension bundle generated in /chrome-extension/dist
echo.

:: 2. Display development environment URLs
echo [2/3] Application URLs:
echo       - Web Landing Page & SaaS Dashboard: http://localhost:3000
echo       - Chrome Extension Load Path:        %CD%\chrome-extension\dist
echo.

:: 3. Automatically open default browser and start Next.js dev server
echo [3/3] Opening browser and starting Next.js 15 App Router server...
start "" "http://localhost:3000"
echo.
echo Press Ctrl+C to stop the development server.
call npm run dev

endlocal
