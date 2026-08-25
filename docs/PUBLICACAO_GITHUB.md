# Publicação automática no GitHub + banco (Supabase)

## Ideia

1. Você altera o app localmente.
2. Atualiza `VERSION.json` (ex.: `1.0.14` / code `14`).
3. Roda **um comando** → push + tag → GitHub Actions gera o APK e cria a **Release**.
4. Celulares com o app detectam a nova versão (Perfil / banner).

As **informações do banco** (Supabase) **não ficam no código**. Elas vão em **GitHub Secrets** e o Action embute no APK na hora do build (`exportar_sync_config.py`).

## 1. Criar o repositório (uma vez)

```powershell
cd c:\Users\leonardo.costa\Documents\python\bba
git init
git add .
git commit -m "BBA inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/bba.git
git push -u origin main
```

Ou crie o repo vazio no GitHub e use o `origin` acima.

## 2. Cadastrar o banco no GitHub (uma vez)

No repositório: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor |
|--------|--------|
| `SUPABASE_URL` | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | chave **anon** (Settings → API) |

O `.env` local continua só na sua máquina (já está no `.gitignore`).  
O Action usa os Secrets para gerar `sync-config.js` dentro do APK da Release.

Confirme também que o SQL de [`scripts/supabase_schema.sql`](../scripts/supabase_schema.sql) já rodou no projeto Supabase (tabela + bucket de fotos).

## 3. Depois das suas alterações no app

1. Edite `VERSION.json`:

```json
{
  "name": "1.0.14",
  "code": 14
}
```

2. Publique:

```powershell
.\scripts\publicar_github.ps1 -Mensagem "Descreva a mudanca"
```

Isso:
- sincroniza versão
- commit (se houver mudanças)
- push da branch
- cria tag `v1.0.14` e faz push da tag
- dispara o workflow **Release APK**

3. Em **Actions**, aguarde o build verde. Em **Releases**, baixe `BBA-1.0.14.apk`.

### Alternativa manual

```powershell
git add .
git commit -m "..."
git push
git tag v1.0.14
git push origin v1.0.14
```

Ou **Actions → Release APK → Run workflow**.

## 4. App no celular

Em **Perfil → Atualização do app**, repositório: `SEU_USUARIO/bba`.  
(Builds do Actions já embutem `GITHUB_REPO` = nome do repositório.)

Sync de dados/fotos: URL e anon key vêm do build (Secrets) ou podem ser ajustadas no Perfil.

## O que NÃO sobe para o GitHub

- `.env` (senha/keys locais)
- `instance/` (SQLite e uploads)
- `venv/`, `tools/`, APKs em `dist/`

## Checklist rápido

- [ ] Secrets `SUPABASE_URL` e `SUPABASE_ANON_KEY` no GitHub
- [ ] SQL Supabase executado (inclui Storage `vistoria-fotos`)
- [ ] `VERSION.json` incrementado
- [ ] `.\scripts\publicar_github.ps1`
- [ ] Release com `.apk` publicada
