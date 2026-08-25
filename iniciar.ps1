# Inicia o BBA (Flask) e abre a pagina de login no navegador
Set-Location $PSScriptRoot

$port = 5000
Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
  Select-Object -ExpandProperty OwningProcess -Unique |
  ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Write-Host "Iniciando BBA em http://127.0.0.1:$port/login ..."
& .\venv\Scripts\python.exe run.py
