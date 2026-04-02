@echo off
echo Starting Antigravity Dashboard...
echo Please leave this window open to keep the server running.
echo The dashboard will automatically open in your default browser.
echo.

:: Start the Node server in the background using start /b or just leave it in the foreground 
:: but open the browser first. We will use `start` to open the URL, which opens the default browser (Chrome if configured).
start "Antigravity Dashboard" http://localhost:3000

:: Start the server 
node server.js

pause
