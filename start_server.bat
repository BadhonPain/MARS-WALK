@echo off
title MARSWALK Mission Control Server
echo ===================================================
echo   MARSWALK: Plan the Walk. Discover the Unknown.
echo   Starting local mission control server...
echo ===================================================
start http://localhost:8080
"%APPDATA%\uv\python\cpython-3.14.7-windows-x86_64-none\python.exe" -m http.server 8080 --bind 0.0.0.0
pause
