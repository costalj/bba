#Requires -Version 5.1
<#
.SYNOPSIS
  Publica a versão atual no GitHub (tag vX.Y.Z → Action gera Release + APK).

.DESCRIPTION
  1. Sincroniza VERSION.json
  2. Commita alterações pendentes (se houver)
  3. Cria tag v{versão} e faz push (dispara release-apk.yml)
  Credenciais do banco (Supabase) NÃO vão no git — use Secrets no GitHub.

.EXAMPLE
  .\scripts\publicar_github.ps1
  .\scripts\publicar_github.ps1 -Mensagem "Nova vistoria e sync de fotos"
#>
param(
    [string]$Mensagem = "",
    [switch]$SemCommit,
    [switch]$SoTag
)

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $projectRoot

if (-not (Test-Path (Join-Path $projectRoot ".git"))) {
    Write-Host "Repositorio git nao encontrado. Inicialize e conecte o remote primeiro:" -ForegroundColor Yellow
    Write-Host "  git init"
    Write-Host "  git remote add origin https://github.com/SEU_USUARIO/bba.git"
    exit 1
}

$python = Join-Path $projectRoot "venv\Scripts\python.exe"
if (-not (Test-Path $python)) { $python = "python" }

Write-Host "Sincronizando versao..." -ForegroundColor Cyan
& $python (Join-Path $projectRoot "scripts\sync_version.py")
& $python (Join-Path $projectRoot "scripts\exportar_app_version.py")
& $python (Join-Path $projectRoot "scripts\exportar_sync_config.py")

$ver = (Get-Content (Join-Path $projectRoot "VERSION.json") -Raw | ConvertFrom-Json).name
$tag = "v$ver"

if (-not $Mensagem) {
    $Mensagem = "Release $tag"
}

$remote = git remote get-url origin 2>$null
if (-not $remote) {
    Write-Host "Remote 'origin' nao configurado. Ex.:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/SEU_USUARIO/bba.git"
    exit 1
}

Write-Host "Versao: $ver | Tag: $tag | Remote: $remote" -ForegroundColor Cyan

if (-not $SoTag -and -not $SemCommit) {
    git add -A
    $status = git status --porcelain
    if ($status) {
        # Nunca inclua .env (ja esta no .gitignore)
        git commit -m $Mensagem
        Write-Host "Commit criado." -ForegroundColor Green
    } else {
        Write-Host "Nada novo para commit." -ForegroundColor DarkGray
    }
}

$branch = git rev-parse --abbrev-ref HEAD
git push -u origin $branch

$existing = git tag -l $tag
if ($existing) {
    Write-Host "Tag $tag ja existe localmente. Atualizando e enviando..." -ForegroundColor Yellow
    git tag -d $tag | Out-Null
}
git tag -a $tag -m "BBA $tag"
git push origin $tag

Write-Host ""
Write-Host "Publicacao disparada!" -ForegroundColor Green
Write-Host "  Action: Release APK (tag $tag)" -ForegroundColor White
Write-Host "  Confira: $remote (aba Actions / Releases)" -ForegroundColor White
Write-Host ""
Write-Host "Lembrete banco de dados (Supabase):" -ForegroundColor Cyan
Write-Host "  No GitHub: Settings → Secrets and variables → Actions" -ForegroundColor White
Write-Host "  SUPABASE_URL e SUPABASE_ANON_KEY devem estar cadastrados." -ForegroundColor White
Write-Host "  Assim o APK da Release sai com sync de dados/fotos configurado." -ForegroundColor White
