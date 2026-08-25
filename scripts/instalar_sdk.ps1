#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
& (Join-Path $projectRoot "scripts\setup_jdk.ps1")

$sdkRoot = Join-Path $projectRoot "tools\android-sdk"
$cmdlineDir = Join-Path $sdkRoot "cmdline-tools\latest"
$sdkmanager = Join-Path $cmdlineDir "bin\sdkmanager.bat"
$zipUrl = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"
$zipPath = Join-Path $projectRoot "tools\cmdline-tools.zip"

New-Item -ItemType Directory -Force -Path (Join-Path $projectRoot "tools") | Out-Null

if (-not (Test-Path $sdkmanager)) {
    Write-Host "Baixando Android command-line tools..." -ForegroundColor Cyan
    curl.exe -L -o $zipPath $zipUrl
    Expand-Archive -Path $zipPath -DestinationPath (Join-Path $sdkRoot "cmdline-tmp") -Force
    New-Item -ItemType Directory -Force -Path (Join-Path $sdkRoot "cmdline-tools\latest") | Out-Null
    Move-Item (Join-Path $sdkRoot "cmdline-tmp\cmdline-tools\*") (Join-Path $sdkRoot "cmdline-tools\latest") -Force
    Remove-Item (Join-Path $sdkRoot "cmdline-tmp") -Recurse -Force
    Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
}

Write-Host "Aceitando licencas..." -ForegroundColor Cyan
cmd /c "echo y | `"$sdkmanager`" --sdk_root=`"$sdkRoot`" --licenses" | Out-Null

Write-Host "Instalando SDK packages..." -ForegroundColor Cyan
$env:ANDROID_HOME = $sdkRoot
& $sdkmanager --sdk_root=$sdkRoot "platform-tools" "platforms;android-34" "build-tools;34.0.0" | Out-Host

$localProps = Join-Path $projectRoot "android\local.properties"
$sdkEscaped = ($sdkRoot -replace '\\', '\\')
"sdk.dir=$sdkEscaped" | Set-Content $localProps -Encoding ASCII
Write-Host "SDK instalado em: $sdkRoot" -ForegroundColor Green
