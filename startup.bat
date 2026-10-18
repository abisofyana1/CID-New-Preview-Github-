@echo off
title Startup Aplikasi CID T&R

:: Load environment variables from .env
if exist .env (
    for /f "tokens=1,2 delims==" %%a in ('findstr /v "^#" .env') do (
        if "%%a"=="APP_HOST" set APP_HOST=%%b
        if "%%a"=="APP_PORT" set APP_PORT=%%b
    )
)

:: Fallback if not set
if "%APP_HOST%"=="" set APP_HOST=127.0.0.1
if "%APP_PORT%"=="" set APP_PORT=3100

set APP_URL=http://%APP_HOST%:%APP_PORT%

:: Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr IPv4') do (
    set LOCAL_IP=%%a
)
:: Trim leading space
set LOCAL_IP=%LOCAL_IP: =%

echo ==========================================
echo   STARTING CID T&R APPLICATION...
echo   Localhost URL : %APP_URL%
echo   Network URL   : http://%LOCAL_IP%:%APP_PORT%
echo ==========================================

echo[
echo [*] Starting Server (API + Frontend)...
cd /d "%~dp0server"
start /MIN "CID Server" cmd /k "npm start"

:: echo [*] Opening Browser...
:: timeout /t 5 /nobreak > NUL
:: start %APP_URL%

echo[
echo ==========================================
echo   APPLICATION STARTED
echo ==========================================
pause
