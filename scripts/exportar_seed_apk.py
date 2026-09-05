"""Exporta usuarios e vistorias do SQLite para seeds leves do APK offline."""
import base64
import json
import os
import sqlite3
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, "instance", "vistorias.db")
POP_FOLDER = os.path.join(ROOT, "instance", "pops")
ASSETS_JS = os.path.join(ROOT, "android", "app", "src", "main", "assets", "www", "js")
SEED_VERSION = "1.0.30"


def _parse_json(raw):
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


def _write_js(filename, const_name, payload):
    path = os.path.join(ASSETS_JS, filename)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    data = json.dumps(payload, ensure_ascii=False, indent=2)
    content = (
        f"/* Gerado por scripts/exportar_seed_apk.py — nao editar manualmente */\n"
        f"const {const_name} = {data};\n"
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    return path


def _vistoria_apk(row) -> dict:
    questionario = _parse_json(row["questionario_json"])
    notas = _parse_json(row["notas_json"])
    rubrica = _parse_json(row["rubrica_solicitante_json"])
    assinatura = _parse_json(row["assinatura_json"])
    max_pts = 54 if questionario else 18

    item = {
        "id": row["id"],
        "created_at": row["created_at"],
        "codigo": row["codigo"],
        "solicitante": row["solicitante"],
        "cpf_solicitante": row["cpf_solicitante"] if "cpf_solicitante" in row.keys() else None,
        "endereco": row["endereco"],
        "contato_telefonico": row["contato_telefonico"],
        "forma_acionamento": row["forma_acionamento"] if "forma_acionamento" in row.keys() else None,
        "protocolo": row["protocolo"] if "protocolo" in row.keys() else None,
        "natureza_ocorrencia": row["natureza_ocorrencia"] if "natureza_ocorrencia" in row.keys() else None,
        "descricao_ocorrencia": row["descricao_ocorrencia"] if "descricao_ocorrencia" in row.keys() else None,
        "recursos_adicionais": row["recursos_adicionais"] if "recursos_adicionais" in row.keys() else None,
        "especie": row["especie"],
        "resultado_especie": row["resultado_especie"] if "resultado_especie" in row.keys() else None,
        "especie_status": row["especie_status"] if "especie_status" in row.keys() else None,
        "especie_catalogo_id": row["especie_catalogo_id"] if "especie_catalogo_id" in row.keys() else None,
        "foto_especie": row["foto_especie"] if "foto_especie" in row.keys() else None,
        "observacoes": row["observacoes"],
        "pontuacao_total": row["pontuacao_total"],
        "pontuacao_maxima": max_pts,
        "recomendacao": row["recomendacao"],
        "justificativa": row["justificativa"],
        "fotos": [],
    }
    if questionario:
        item["questionario"] = questionario
    elif notas:
        item["notas"] = notas
    if rubrica:
        item["rubrica"] = rubrica
    if assinatura:
        item["assinatura"] = assinatura
    return item


def _vistoria_viatura_apk(row) -> dict:
    checklist = _parse_json(row["checklist_json"])
    assinatura = _parse_json(row["assinatura_json"])
    item = {
        "id": row["id"],
        "created_at": row["created_at"],
        "codigo": row["codigo"],
        "placa": row["placa"],
        "tipo_viatura": row["tipo_viatura"],
        "km": row["km"],
        "condutor": row["condutor"],
        "observacoes": row["observacoes"],
        "pontuacao_total": row["pontuacao_total"],
        "recomendacao": row["recomendacao"],
        "justificativa": row["justificativa"],
    }
    if checklist:
        item["checklist"] = checklist
    if assinatura:
        item["assinatura"] = assinatura
    return item


def _pop_apk(row) -> dict:
    item = {
        "id": row["id"],
        "titulo": row["titulo"],
        "original_name": row["original_name"],
        "mime_type": row["mime_type"] or "application/pdf",
        "created_at": row["created_at"],
    }
    path = os.path.join(POP_FOLDER, row["filename"])
    if os.path.isfile(path):
        with open(path, "rb") as f:
            b64 = base64.b64encode(f.read()).decode("ascii")
        mime = item["mime_type"]
        item["data_url"] = f"data:{mime};base64,{b64}"
    return item


def exportar_seed():
    seed = {
        "version": SEED_VERSION,
        "exported_at": datetime.now().isoformat(timespec="seconds"),
        "usuarios": [],
        "vistorias": [],
        "vistorias_viaturas": [],
        "viaturas_cadastradas": [],
        "pops": [],
    }

    if os.path.exists(DB_PATH):
        db = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
        seed["usuarios"] = [
            {
                "id": r["id"],
                "nome": r["nome"],
                "nome_guerra": r["nome_guerra"] or "",
                "matricula": r["matricula"],
                "cpf": r["cpf"],
                "posto": r["posto"],
                "perfil": r["perfil"],
                "senha_hash": r["senha_hash"],
                "ativo": bool(r["ativo"]),
            }
            for r in db.execute(
                "SELECT id, nome, nome_guerra, matricula, cpf, posto, perfil, senha_hash, ativo "
                "FROM usuarios WHERE ativo = 1 ORDER BY id"
            )
        ]
        seed["vistorias"] = [
            _vistoria_apk(r)
            for r in db.execute(
                """
                SELECT id, created_at, codigo, endereco, especie, observacoes,
                       solicitante, cpf_solicitante, contato_telefonico,
                       forma_acionamento, protocolo, natureza_ocorrencia, descricao_ocorrencia,
                       recursos_adicionais, resultado_especie, especie_status, especie_catalogo_id, foto_especie,
                       pontuacao_total, recomendacao,
                       justificativa, questionario_json, notas_json,
                       rubrica_solicitante_json, assinatura_json
                FROM vistorias ORDER BY id DESC
                """
            )
        ]
        if db.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'vistorias_viaturas'"
        ).fetchone():
            seed["vistorias_viaturas"] = [
                _vistoria_viatura_apk(r)
                for r in db.execute(
                    """
                    SELECT id, created_at, codigo, placa, tipo_viatura, km, condutor, observacoes,
                           checklist_json, assinatura_json, pontuacao_total, recomendacao, justificativa
                    FROM vistorias_viaturas ORDER BY id DESC
                    """
                )
            ]
        if db.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'cadastro_viaturas'"
        ).fetchone():
            seed["viaturas_cadastradas"] = [
                {
                    "id": r["id"],
                    "ar": r["ar"],
                    "placa": r["placa"],
                    "marca": r["marca"],
                    "modelo": r["modelo"],
                }
                for r in db.execute(
                    "SELECT id, ar, placa, marca, modelo FROM cadastro_viaturas ORDER BY id"
                )
            ]
        if db.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'pops'"
        ).fetchone():
            seed["pops"] = [
                _pop_apk(r)
                for r in db.execute(
                    "SELECT id, titulo, filename, original_name, mime_type, created_at "
                    "FROM pops ORDER BY id DESC"
                )
            ]
        db.close()

    meta = {"version": seed["version"], "exported_at": seed["exported_at"]}
    paths = {
        "seed-meta.js": _write_js("seed-meta.js", "SEED_META", meta),
        "usuarios-seed.js": _write_js("usuarios-seed.js", "USUARIOS_SEED", seed["usuarios"]),
        "vistorias-seed.js": _write_js("vistorias-seed.js", "VISTORIAS_SEED", seed["vistorias"]),
        "vistorias-viaturas-seed.js": _write_js(
            "vistorias-viaturas-seed.js", "VISTORIAS_VIATURAS_SEED", seed["vistorias_viaturas"]
        ),
        "viaturas-cadastro-seed.js": _write_js(
            "viaturas-cadastro-seed.js", "VIATURAS_CADASTRO_SEED", seed["viaturas_cadastradas"]
        ),
        "pops-seed.js": _write_js("pops-seed.js", "POPS_SEED", seed["pops"]),
    }

    legacy_path = os.path.join(ASSETS_JS, "seed-data.js")
    if os.path.isfile(legacy_path):
        os.remove(legacy_path)

    print("Seeds exportados:")
    for name, path in paths.items():
        size_kb = os.path.getsize(path) // 1024
        print(f"  {name}: {size_kb} KB")
    print(f"  versao: {SEED_VERSION}")
    print(f"  usuarios: {len(seed['usuarios'])}")
    print(f"  vistorias arvores: {len(seed['vistorias'])}")
    print(f"  vistorias viaturas: {len(seed['vistorias_viaturas'])}")
    print(f"  viaturas cadastradas: {len(seed['viaturas_cadastradas'])}")
    print(f"  pops: {len(seed.get('pops', []))}")


if __name__ == "__main__":
    exportar_seed()
