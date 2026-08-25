@echo off
echo Gerando APK BBA (offline)...
powershell -ExecutionPolicy Bypass -File "%~dp0scripts\build_apk.ps1"
pause
