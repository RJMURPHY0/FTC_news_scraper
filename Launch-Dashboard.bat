@echo off
title FTC Safety Solutions - AI Dashboard
echo.
echo  ==========================================
echo   FTC Safety Solutions :: AI Dashboard
echo  ==========================================
echo.
echo  Starting local server...

:: Check node is installed
where node >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js not found. Please install from https://nodejs.org
    pause
    exit /b 1
)

:: Start the node server in a new background window
start "Antigravity Server" /min cmd /c "node server.js"

:: Wait 2 seconds for the server to be ready before opening the browser
timeout /t 2 /nobreak >nul

:: Open dashboard in default browser
echo  Opening dashboard in your browser...
start "" http://localhost:3000

echo.
echo  Dashboard is running at: http://localhost:3000
echo  Close the "Antigravity Server" window to stop the server.
echo.
pause
