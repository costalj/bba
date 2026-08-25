#Requires -Version 5.1
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$jdkDir = Join-Path $projectRoot "tools\jdk-17"
$jdkZip = Join-Path $projectRoot "tools\jdk-17.zip"
$jdkUrl = "https://aka.ms/download-jdk/microsoft-jdk-17.0.13-windows-x64.zip"

function Get-JdkHome {
    if (Test-Path (Join-Path $jdkDir "bin\java.exe")) { return $jdkDir }
    $nested = Get-ChildItem $jdkDir -Directory -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($nested -and (Test-Path (Join-Path $nested.FullName "bin\java.exe"))) { return $nested.FullName }
    return $null
}

$javaHome = Get-JdkHome
if (-not $javaHome) {
    Write-Host "Baixando JDK 17..." -ForegroundColor Cyan
    New-Item -ItemType Directory -Force -Path (Join-Path $projectRoot "tools") | Out-Null
    curl.exe -L -o $jdkZip $jdkUrl
    Expand-Archive -Path $jdkZip -DestinationPath $jdkDir -Force
    Remove-Item $jdkZip -Force -ErrorAction SilentlyContinue
    $javaHome = Get-JdkHome
}

if (-not $javaHome) { throw "Falha ao instalar JDK 17" }

$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"
Write-Host "JAVA_HOME=$javaHome" -ForegroundColor Green
& "$javaHome\bin\java.exe" -version
