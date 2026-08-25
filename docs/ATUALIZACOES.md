# Atualizações do APK via GitHub Releases

## Visão geral

1. Você altera o código e sobe para o **GitHub**.
2. Cria uma **Release** com tag `v1.0.12` (workflow publica o APK automaticamente).
3. Celulares com o app instalado **verificam** a release mais recente e oferecem **Baixar atualização**.

O app **não se instala sozinho** — o usuário baixa o APK novo e instala por cima (dados locais permanecem).

## Versionamento

Edite `VERSION.json` na raiz do projeto:

```json
{
  "name": "1.0.12",
  "code": 12
}
```

- `name` — versão exibida (semver)
- `code` — número inteiro crescente (Android `versionCode`)

Depois rode:

```powershell
.\scripts\build_apk.ps1
```

Isso sincroniza Gradle, seed, módulos web e gera `app-version.js`.

## Publicar no GitHub Releases

Guia completo (Secrets do banco + comando único): [`docs/PUBLICACAO_GITHUB.md`](PUBLICACAO_GITHUB.md)

### Atalho após alterar o app

1. Atualize `VERSION.json`
2. Rode:

```powershell
.\scripts\publicar_github.ps1 -Mensagem "Resumo da mudanca"
```

A Action publica o APK na Release. Cadastre antes no GitHub:

- Secret `SUPABASE_URL`
- Secret `SUPABASE_ANON_KEY`

Assim o APK da nuvem já sai com as informações do banco (sync dados + fotos).

### 1. Subir o repositório

```powershell
git init
git add .
git commit -m "BBA: app vistoria arbórea"
git remote add origin https://github.com/SEU_USUARIO/bba.git
git push -u origin main
```

### 2. Criar release (automático via tag)

```powershell
# Atualize VERSION.json antes
git add VERSION.json
git commit -m "Bump version 1.0.14"
git tag v1.0.14
git push origin main
git push origin v1.0.14
```

O workflow `.github/workflows/release-apk.yml` compila o APK e anexa `BBA-1.0.14.apk` na Release.

Também é possível disparar manualmente em **Actions → Release APK → Run workflow**.

### 3. Nome do arquivo na Release

O verificador de atualização procura um asset que termine em **`.apk`** na release **latest** do GitHub.

## Configurar o celular

No app: **Perfil → Atualização do app → Repositório GitHub**

Informe: `seu-usuario/bba` (sem `https://`, sem `.git`).

Se o APK foi gerado pelo GitHub Actions com `GITHUB_REPOSITORY`, o repositório já pode vir embutido no build.

## Comportamento no app

- **Início**: banner se houver versão mais nova (com internet).
- **Perfil**: versão instalada, campo do repo, botão **Verificar atualização** e **Baixar**.
- **Download**: salva em **Downloads** do celular; abra o arquivo para instalar.

Verificação automática: no máximo a cada **6 horas** (economiza dados).

## Variável opcional no build local

No `.env` ou ambiente:

```
GITHUB_REPO=seu-usuario/bba
```

Usada por `scripts/exportar_app_version.py` ao gerar o APK local.

## Limitações

- Requer **internet** para verificar e baixar.
- Repositório **público** ou token não implementado no app (API pública do GitHub).
- Instalação manual do APK (não usa Google Play).
