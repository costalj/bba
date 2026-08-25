# Sincronização celular + Supabase

O app BBA continua **offline-first** no celular. Com internet, dados e **fotos** sincronizam com um projeto **Supabase** (PostgreSQL + Storage).

## O que sincroniza

| Dado | Onde |
|------|------|
| Usuários | tabela `bba_sync` |
| Vistorias de árvores | `bba_sync` + fotos no Storage |
| Vistorias de viaturas | `bba_sync` |
| Cadastro de viaturas | `bba_sync` |
| Fotos das vistorias | bucket Storage `vistoria-fotos` |

**Não sincroniza neste ciclo:** POP (documentos), legislação estática do APK.

## Fluxo

1. Celular/web grava local (localStorage ou SQLite).
2. Sync faz **push** dos metadados para `bba_sync`.
3. Fotos sobem para Storage em `{sync_id}/0.jpg`, `{sync_id}/1.jpg`, …
4. Outro aparelho faz **pull** e baixa as fotos para uso offline (resultado/PDF).

Conflitos: *last-write-wins* pelo campo `updated_at`.

## 1. Criar projeto Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto.
2. No **SQL Editor**, execute todo o arquivo [`scripts/supabase_schema.sql`](../scripts/supabase_schema.sql).
3. Confirme:
   - **Table Editor** → tabela `bba_sync`
   - **Storage** → bucket `vistoria-fotos` (público, máx. 5 MB por arquivo)

## 2. Credenciais

**Settings → API:**

- Project URL → `SUPABASE_URL`
- anon public → `SUPABASE_ANON_KEY`

## 3. Configurar o APK

### No celular

**Perfil → Sincronização na nuvem** → cole URL e anon key → **Sincronizar agora**.

### No build local (opcional)

No `.env` da raiz:

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

O script `exportar_sync_config.py` (chamado no `build_apk.ps1`) embute esses defaults em `sync-config.js`.

### No GitHub (publicação automática)

Cadastre os **mesmos** valores como Secrets do repositório (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).  
Assim cada Release do Actions gera o APK **já com o banco configurado**, sem expor o `.env` no código.

Veja o passo a passo em [`docs/PUBLICACAO_GITHUB.md`](PUBLICACAO_GITHUB.md).

```powershell
.\scripts\build_apk.ps1
```

## 4. Testar no celular

1. Instale o APK e faça login.
2. Crie uma vistoria **com fotos** (pode ser offline).
3. Com internet: **Perfil → Sincronizar agora**.
4. No Supabase:
   - `bba_sync` com `entity_type = vistorias` e `payload.fotos[].storage_path`
   - Storage → `vistoria-fotos` → pasta do `sync_id`
5. Em um 2º aparelho: mesmas credenciais → Sincronizar → abrir a vistoria e conferir as fotos.

Status no Perfil pode indicar **fotos pendentes** se algum upload/download falhou (nova sync tenta de novo).

## 5. Flask (versão web)

1. Copie `.env.example` → `.env` e preencha URL/key.
2. Carga inicial (registros + fotos de `instance/uploads/`):

```powershell
.\venv\Scripts\python.exe scripts\exportar_supabase.py
```

3. Reinicie o Flask. Novas vistorias com fotos sobem automaticamente ao salvar.

## Limites técnicos

- Fotos são comprimidas (~1280px, JPEG ~70%) antes do upload.
- Payload JSON **não** carrega base64 — só metadados (`nome`, `storage_path`, `content_type`).
- RLS e Storage permissivos (`anon`) são para **uso interno**; em produção use Supabase Auth.
- POP e legislação não entram neste sync.

## Solução de problemas

| Problema | Verificação |
|----------|-------------|
| "Supabase não configurado" | URL + anon key no Perfil ou no `.env`/build |
| Erro 401/403 | Reexecute o SQL (tabela + policies do Storage) |
| Metadados sync, fotos não | Confira bucket `vistoria-fotos` e policies; veja `fotos_pendentes` no status |
| 2º celular sem fotos | Sync com internet; abra a vistoria de novo após sync |
| Carga inicial sem fotos | Confirme arquivos em `instance/uploads/` e rode `exportar_supabase.py` |
