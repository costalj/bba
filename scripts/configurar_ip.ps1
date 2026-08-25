#Requires -Version 5.1
<#
.SYNOPSIS
    Detecta o IP local do PC e configura a URL do servidor no APK.
#>
$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$stringsFile = Join-Path $projectRoot "android\app\src\main\res\values\strings.xml"

# Detecta IP Wi-Fi/Ethernet (ignora loopback e virtual)
$ip = Get-NetIPAddress -AddressFamily IPv4 |
    Where-Object {
        $_.IPAddress -notlike "127.*" -and
        $_.IPAddress -notlike "169.254.*" -and
        $_.PrefixOrigin -ne "WellKnown"
    } |
    Sort-Object InterfaceMetric |
    Select-Object -First 1 -ExpandProperty IPAddress

if (-not $ip) {
    Write-Host "Nao foi possivel detectar o IP. Informe manualmente:" -ForegroundColor Yellow
    $ip = Read-Host "IP do PC"
}

$url = "http://${ip}:5000"
Write-Host "URL configurada: $url" -ForegroundColor Green

$content = Get-Content $stringsFile -Raw -Encoding UTF8
$content = $content -replace '<string name="server_url">.*?</string>', "<string name=""server_url"">$url</string>"
Set-Content $stringsFile $content -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "Proximo passo: .\scripts\build_apk.ps1" -ForegroundColor Cyan
Write-Host "Teste no celular: $url" -ForegroundColor Cyan
