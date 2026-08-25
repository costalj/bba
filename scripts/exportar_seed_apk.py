"""Exporta usuarios e vistorias do SQLite para o seed do APK offline."""
import base64
import json
import os
import sqlite3
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, "instance", "vistorias.db")
POP_FOLDER = os.path.join(ROOT, "instance", "pops")
OUT_PATH = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "seed-data.js"
)
SEED_VERSION = "1.0.14"


def _parse_json(raw):
    if not raw:
        return None
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        return None


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
        "especie": row["especie"],
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
    if not os.path.exists(DB_PATH):
        seed = {
            "version": SEED_VERSION,
            "exported_at": datetime.now().isoformat(timespec="seconds"),
            "usuarios": [],
            "vistorias": [],
            "viaturas_cadastradas": [],
            "pops": [],
        }
    else:
        db = sqlite3.connect(DB_PATH)
        db.row_factory = sqlite3.Row
        usuarios = [
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
        vistorias = [
            _vistoria_apk(r)
            for r in db.execute(
                """
                SELECT id, created_at, codigo, endereco, especie, observacoes,
                       solicitante, cpf_solicitante, contato_telefonico,
                       forma_acionamento, protocolo, natureza_ocorrencia, descricao_ocorrencia,
                       pontuacao_total, recomendacao,
                       justificativa, questionario_json, notas_json,
                       rubrica_solicitante_json, assinatura_json
                FROM vistorias ORDER BY id DESC
                """
            )
        ]
        tabela_viaturas = db.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'cadastro_viaturas'"
        ).fetchone()
        viaturas_cadastradas = []
        if tabela_viaturas:
            viaturas_cadastradas = [
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
        pops = []
        tabela_pops = db.execute(
            "SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'pops'"
        ).fetchone()
        if tabela_pops:
            pops = [
                _pop_apk(r)
                for r in db.execute(
                    "SELECT id, titulo, filename, original_name, mime_type, created_at "
                    "FROM pops ORDER BY id DESC"
                )
            ]
        db.close()
        seed = {
            "version": SEED_VERSION,
            "exported_at": datetime.now().isoformat(timespec="seconds"),
            "usuarios": usuarios,
            "vistorias": vistorias,
            "viaturas_cadastradas": viaturas_cadastradas,
            "pops": pops,
        }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    payload = json.dumps(seed, ensure_ascii=False, indent=2)
    content = f"/* Gerado por scripts/exportar_seed_apk.py — nao editar manualmente */\nconst SEED_DATA = {payload};\n"
    with open(OUT_PATH, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Seed exportado: {OUT_PATH}")
    print(f"  versao: {SEED_VERSION}")
    print(f"  usuarios: {len(seed['usuarios'])}")
    print(f"  vistorias: {len(seed['vistorias'])}")
    print(f"  viaturas cadastradas: {len(seed['viaturas_cadastradas'])}")
    print(f"  pops: {len(seed.get('pops', []))}")


if __name__ == "__main__":
    exportar_seed()
