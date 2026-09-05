#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
& (Join-Path $projectRoot "scripts\setup_jdk.ps1")

$androidDir = Join-Path $projectRoot "android"
$distDir = Join-Path $projectRoot "dist"
$localProps = Join-Path $androidDir "local.properties"
$sdkLocal = Join-Path $projectRoot "tools\android-sdk"

# Instala SDK local se necessario
if (-not (Test-Path $localProps)) {
    if (Test-Path (Join-Path $sdkLocal "platforms\android-34")) {
        $sdkEscaped = ($sdkLocal -replace '\\', '\\')
        "sdk.dir=$sdkEscaped" | Set-Content $localProps -Encoding ASCII
    } else {
        Write-Host "SDK nao encontrado. Instalando..." -ForegroundColor Yellow
        & (Join-Path $projectRoot "scripts\instalar_sdk.ps1")
    }
}

New-Item -ItemType Directory -Force -Path $distDir | Out-Null

Write-Host "Sincronizando versao do app..." -ForegroundColor Cyan
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\sync_version.py")
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\exportar_app_version.py")
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\exportar_sync_config.py")

$versionJson = Get-Content (Join-Path $projectRoot "VERSION.json") -Raw | ConvertFrom-Json
$apkName = "BBA-$($versionJson.name).apk"
$apkOut = Join-Path $distDir $apkName

Write-Host "Exportando usuarios e vistorias para o APK..." -ForegroundColor Cyan
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\exportar_seed_apk.py")

Write-Host "Exportando catalogo de legislacao para o APK..." -ForegroundColor Cyan
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\exportar_legislacao_apk.py")

Write-Host "Exportando especies protegidas para o APK..." -ForegroundColor Cyan
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\exportar_especies_apk.py")

Write-Host "Exportando brasao para PDF offline..." -ForegroundColor Cyan
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\exportar_logo_pdf.py")

Write-Host "Gerando icones do brasao BBA..." -ForegroundColor Cyan
& (Join-Path $projectRoot "venv\Scripts\python.exe") (Join-Path $projectRoot "scripts\gerar_icones.py")

Write-Host "Compilando APK standalone (offline)..." -ForegroundColor Cyan
Push-Location $androidDir
try {
    & .\gradlew.bat assembleRelease --no-daemon
    if ($LASTEXITCODE -ne 0) { throw "Build falhou (exit $LASTEXITCODE)" }
} finally {
    Pop-Location
}

$builtApk = Join-Path $androidDir "app\build\outputs\apk\release\app-release.apk"
if (-not (Test-Path $builtApk)) { throw "APK nao gerado" }

Copy-Item $builtApk $apkOut -Force
$size = [math]::Round((Get-Item $apkOut).Length / 1MB, 2)

Write-Host ""
Write-Host "APK pronto para instalar no celular!" -ForegroundColor Green
Write-Host "  $apkOut" -ForegroundColor White
Write-Host "  ${size} MB · funciona offline" -ForegroundColor White
