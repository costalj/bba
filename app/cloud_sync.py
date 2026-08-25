"""Espelhamento opcional SQLite (Flask) → Supabase (+ Storage de fotos)."""

from __future__ import annotations

import json
import mimetypes
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

import httpx

FOTOS_BUCKET = "vistoria-fotos"


def _config():
    url = (os.environ.get("SUPABASE_URL") or "").rstrip("/")
    key = os.environ.get("SUPABASE_ANON_KEY") or os.environ.get("SUPABASE_SERVICE_KEY") or ""
    return url, key


def enabled() -> bool:
    url, key = _config()
    return bool(url and key)


def sync_id_web(entity_type: str, row_id: int) -> str:
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, f"bba-web-{entity_type}-{row_id}"))


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _row_to_dict(row) -> dict:
    if row is None:
        return {}
    return dict(row)


def _payload_usuario(row: dict) -> dict:
    return {
        "id": row.get("id"),
        "nome": row.get("nome"),
        "nome_guerra": row.get("nome_guerra") or "",
        "matricula": row.get("matricula"),
        "cpf": row.get("cpf"),
        "posto": row.get("posto"),
        "perfil": row.get("perfil"),
        "senha_hash": row.get("senha_hash"),
        "ativo": bool(row.get("ativo", 1)),
        "sync_id": sync_id_web("usuarios", row["id"]),
        "updated_at": _now_iso(),
    }


def _payload_cadastro_viatura(row: dict) -> dict:
    return {
        "id": row.get("id"),
        "ar": row.get("ar"),
        "placa": row.get("placa"),
        "marca": row.get("marca"),
        "modelo": row.get("modelo"),
        "sync_id": sync_id_web("cadastro_viaturas", row["id"]),
        "updated_at": _now_iso(),
    }


def _payload_vistoria_viatura(row: dict) -> dict:
    checklist = {}
    assinatura = None
    if row.get("checklist_json"):
        try:
            checklist = json.loads(row["checklist_json"])
        except json.JSONDecodeError:
            checklist = {}
    if row.get("assinatura_json"):
        try:
            assinatura = json.loads(row["assinatura_json"])
        except json.JSONDecodeError:
            assinatura = None
    return {
        "id": row.get("id"),
        "created_at": row.get("created_at"),
        "codigo": row.get("codigo"),
        "placa": row.get("placa"),
        "tipo_viatura": row.get("tipo_viatura"),
        "km": row.get("km"),
        "condutor": row.get("condutor"),
        "observacoes": row.get("observacoes"),
        "checklist": checklist,
        "assinatura": assinatura,
        "pontuacao_total": row.get("pontuacao_total"),
        "recomendacao": row.get("recomendacao"),
        "justificativa": row.get("justificativa"),
        "sync_id": sync_id_web("vistorias_viaturas", row["id"]),
        "updated_at": _now_iso(),
    }


def upload_bytes_to_storage(
    data: bytes,
    storage_path: str,
    content_type: str = "image/jpeg",
) -> bool:
    if not enabled() or not data:
        return False
    url, key = _config()
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": content_type,
        "x-upsert": "true",
    }
    endpoint = f"{url}/storage/v1/object/{FOTOS_BUCKET}/{storage_path}"
    with httpx.Client(timeout=60.0) as client:
        resp = client.post(endpoint, headers=headers, content=data)
        if resp.status_code in (200, 201):
            return True
        # retry once as PUT for some Storage configurations
        resp = client.put(endpoint, headers=headers, content=data)
        resp.raise_for_status()
    return True


def upload_file_to_storage(file_path: str | Path, storage_path: str) -> dict | None:
    path = Path(file_path)
    if not path.is_file():
        return None
    content_type = mimetypes.guess_type(path.name)[0] or "image/jpeg"
    data = path.read_bytes()
    if not upload_bytes_to_storage(data, storage_path, content_type):
        return None
    return {
        "nome": path.name,
        "storage_path": storage_path,
        "content_type": content_type if content_type.startswith("image/") else "image/jpeg",
    }


def _fotos_meta_from_db(db, vistoria_id: int, sync_id: str, upload_folder: str | None = None) -> list:
    rows = db.execute(
        "SELECT id, filename FROM fotos WHERE vistoria_id = ? ORDER BY id",
        (vistoria_id,),
    ).fetchall()
    if not rows:
        return []

    folder = upload_folder
    if not folder:
        try:
            from flask import current_app

            folder = current_app.config.get("UPLOAD_FOLDER")
        except RuntimeError:
            folder = None
    if not folder:
        folder = str(Path(__file__).resolve().parents[1] / "instance" / "uploads")

    metas = []
    for idx, row in enumerate(rows):
        filename = row["filename"]
        local_path = Path(folder) / filename
        ext = Path(filename).suffix.lower() or ".jpg"
        # Normaliza para .jpg no storage quando possível
        storage_name = f"{idx}.jpg" if ext in (".jpg", ".jpeg", ".png", ".webp") else f"{idx}{ext}"
        storage_path = f"{sync_id}/{storage_name}"
        meta = upload_file_to_storage(local_path, storage_path)
        if meta:
            metas.append(meta)
        else:
            # Metadado sem upload (arquivo ausente) — ainda registra path esperado
            metas.append(
                {
                    "nome": filename,
                    "storage_path": storage_path,
                    "content_type": "image/jpeg",
                }
            )
    return metas


def _payload_vistoria(row: dict, fotos: list | None = None) -> dict:
    questionario = {}
    assinatura = None
    rubrica = None
    if row.get("questionario_json"):
        try:
            questionario = json.loads(row["questionario_json"])
        except json.JSONDecodeError:
            questionario = {}
    if row.get("assinatura_json"):
        try:
            assinatura = json.loads(row["assinatura_json"])
        except json.JSONDecodeError:
            assinatura = None
    if row.get("rubrica_solicitante_json"):
        try:
            rubrica = json.loads(row["rubrica_solicitante_json"])
        except json.JSONDecodeError:
            rubrica = None
    sync_id = sync_id_web("vistorias", row["id"])
    return {
        "id": row.get("id"),
        "created_at": row.get("created_at"),
        "codigo": row.get("codigo"),
        "endereco": row.get("endereco"),
        "especie": row.get("especie"),
        "observacoes": row.get("observacoes"),
        "solicitante": row.get("solicitante"),
        "cpf_solicitante": row.get("cpf_solicitante"),
        "contato_telefonico": row.get("contato_telefonico"),
        "forma_acionamento": row.get("forma_acionamento"),
        "protocolo": row.get("protocolo"),
        "natureza_ocorrencia": row.get("natureza_ocorrencia"),
        "descricao_ocorrencia": row.get("descricao_ocorrencia"),
        "latitude": row.get("latitude"),
        "longitude": row.get("longitude"),
        "questionario": questionario,
        "assinatura": assinatura,
        "rubrica": rubrica,
        "pontuacao_total": row.get("pontuacao_total"),
        "recomendacao": row.get("recomendacao"),
        "justificativa": row.get("justificativa"),
        "fotos": fotos if fotos is not None else [],
        "sync_id": sync_id,
        "updated_at": _now_iso(),
    }


PAYLOAD_BUILDERS = {
    "usuarios": _payload_usuario,
    "cadastro_viaturas": _payload_cadastro_viatura,
    "vistorias_viaturas": _payload_vistoria_viatura,
    "vistorias": _payload_vistoria,
}

TABLE_BY_ENTITY = {
    "usuarios": "usuarios",
    "cadastro_viaturas": "cadastro_viaturas",
    "vistorias_viaturas": "vistorias_viaturas",
    "vistorias": "vistorias",
}


def upsert_record(
    entity_type: str,
    payload: dict,
    *,
    deleted: bool = False,
    device_id: str = "flask-web",
) -> bool:
    if not enabled():
        return False
    url, key = _config()
    sync_id = payload.get("sync_id")
    if not sync_id:
        return False
    record = {
        "sync_id": sync_id,
        "entity_type": entity_type,
        "payload": payload,
        "updated_at": payload.get("updated_at") or _now_iso(),
        "device_id": device_id,
        "deleted": deleted,
    }
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=minimal",
    }
    with httpx.Client(timeout=30.0) as client:
        resp = client.post(f"{url}/rest/v1/bba_sync", headers=headers, json=[record])
        resp.raise_for_status()
    return True


def push_sqlite_row(db, entity_type: str, row_id: int, *, deleted: bool = False) -> bool:
    if not enabled():
        return False
    builder = PAYLOAD_BUILDERS.get(entity_type)
    table = TABLE_BY_ENTITY.get(entity_type)
    if not builder or not table:
        return False
    if deleted:
        payload = {
            "sync_id": sync_id_web(entity_type, row_id),
            "id": row_id,
            "updated_at": _now_iso(),
        }
        return upsert_record(entity_type, payload, deleted=True)
    row = db.execute(f"SELECT * FROM {table} WHERE id = ?", (row_id,)).fetchone()
    if row is None:
        return False
    row_dict = _row_to_dict(row)
    if entity_type == "vistorias":
        sync_id = sync_id_web("vistorias", row_id)
        fotos = _fotos_meta_from_db(db, row_id, sync_id)
        payload = _payload_vistoria(row_dict, fotos=fotos)
    else:
        payload = builder(row_dict)
    return upsert_record(entity_type, payload, deleted=deleted)


def push_all_from_sqlite(db, upload_folder: str | None = None) -> dict[str, int]:
    counts = {k: 0 for k in PAYLOAD_BUILDERS}
    fotos_enviadas = 0
    if not enabled():
        return counts
    for entity_type, table in TABLE_BY_ENTITY.items():
        rows = db.execute(f"SELECT * FROM {table}").fetchall()
        for row in rows:
            row_dict = dict(row)
            if entity_type == "vistorias":
                sync_id = sync_id_web("vistorias", row_dict["id"])
                fotos = _fotos_meta_from_db(
                    db, row_dict["id"], sync_id, upload_folder=upload_folder
                )
                fotos_enviadas += len(fotos)
                payload = _payload_vistoria(row_dict, fotos=fotos)
            else:
                payload = PAYLOAD_BUILDERS[entity_type](row_dict)
            if entity_type == "usuarios" and not payload.get("ativo", True):
                upsert_record(entity_type, payload, deleted=True)
            else:
                upsert_record(entity_type, payload)
            counts[entity_type] += 1
    counts["fotos"] = fotos_enviadas
    return counts
