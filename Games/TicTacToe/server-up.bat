@echo off
setlocal

cd /d "%~dp0"

echo Starting Tic Tac Tactics dev server...
echo.

if not exist "node_modules" (
  echo node_modules not found. Installing dependencies first...
  call npm install
  if errorlevel 1 (
    echo.
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo.
echo Opening app at http://127.0.0.1:5173/
start "" "http://127.0.0.1:5173/"

echo.
echo Press Ctrl+C to stop the server.
echo.
call npm run dev -- --port 5173

echo.
echo Server stopped.
pause
