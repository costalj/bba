-- Schema BBA — sincronização celular + nuvem (Supabase Free)
-- Execute no SQL Editor do painel Supabase: https://supabase.com/dashboard

create table if not exists bba_sync (
  sync_id     uuid primary key,
  entity_type text not null check (
    entity_type in ('usuarios', 'vistorias', 'vistorias_viaturas', 'cadastro_viaturas')
  ),
  payload     jsonb not null,
  updated_at  timestamptz not null default now(),
  device_id   text,
  deleted     boolean not null default false
);

create index if not exists idx_bba_sync_pull
  on bba_sync (entity_type, updated_at);

-- RLS: políticas permissivas para fase de testes internos.
-- Em produção, substituir por Supabase Auth ou políticas por unidade.
alter table bba_sync enable row level security;

drop policy if exists "bba_sync_anon_select" on bba_sync;
drop policy if exists "bba_sync_anon_insert" on bba_sync;
drop policy if exists "bba_sync_anon_update" on bba_sync;

create policy "bba_sync_anon_select"
  on bba_sync for select
  to anon
  using (true);

create policy "bba_sync_anon_insert"
  on bba_sync for insert
  to anon
  with check (true);

create policy "bba_sync_anon_update"
  on bba_sync for update
  to anon
  using (true)
  with check (true);

-- ---------------------------------------------------------------------------
-- Storage: fotos das vistorias (bucket vistoria-fotos)
-- Caminho dos arquivos: {sync_id}/{0.jpg, {sync_id}/1.jpg, ...
-- Payload em bba_sync guarda só metadados (nome, storage_path), não base64.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vistoria-fotos',
  'vistoria-fotos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "bba_fotos_anon_select" on storage.objects;
drop policy if exists "bba_fotos_anon_insert" on storage.objects;
drop policy if exists "bba_fotos_anon_update" on storage.objects;
drop policy if exists "bba_fotos_anon_delete" on storage.objects;

create policy "bba_fotos_anon_select"
  on storage.objects for select
  to anon
  using (bucket_id = 'vistoria-fotos');

create policy "bba_fotos_anon_insert"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'vistoria-fotos');

create policy "bba_fotos_anon_update"
  on storage.objects for update
  to anon
  using (bucket_id = 'vistoria-fotos')
  with check (bucket_id = 'vistoria-fotos');

create policy "bba_fotos_anon_delete"
  on storage.objects for delete
  to anon
  using (bucket_id = 'vistoria-fotos');
