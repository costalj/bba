import json
import sqlite3
from flask import current_app, g


def get_db():
    if "db" not in g:
        g.db = sqlite3.connect(
            current_app.config["DATABASE"],
            detect_types=sqlite3.PARSE_DECLTYPES,
        )
        g.db.row_factory = sqlite3.Row
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def _column_exists(db, table, column):
    cols = db.execute(f"PRAGMA table_info({table})").fetchall()
    return any(c[1] == column for c in cols)


def _migrate(db):
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS vistorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            codigo TEXT,
            endereco TEXT NOT NULL,
            especie TEXT,
            diametro_cm REAL,
            altura_m REAL,
            responsavel TEXT,
            observacoes TEXT,
            nota_tronco INTEGER,
            nota_raizes INTEGER,
            nota_inclinacao INTEGER,
            nota_copa INTEGER,
            nota_pragas INTEGER,
            nota_proximidade INTEGER,
            pontuacao_total INTEGER NOT NULL,
            recomendacao TEXT NOT NULL,
            justificativa TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS fotos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vistoria_id INTEGER NOT NULL,
            filename TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            FOREIGN KEY (vistoria_id) REFERENCES vistorias(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            matricula TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            posto TEXT NOT NULL,
            perfil TEXT NOT NULL,
            senha_hash TEXT NOT NULL,
            ativo INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );
        """
    )

    migrations = [
        ("latitude", "REAL"),
        ("longitude", "REAL"),
        ("notas_json", "TEXT"),
        ("assinatura_json", "TEXT"),
        ("solicitante", "TEXT"),
        ("contato_telefonico", "TEXT"),
        ("cpf_solicitante", "TEXT"),
        ("forma_acionamento", "TEXT"),
        ("protocolo", "TEXT"),
        ("natureza_ocorrencia", "TEXT"),
        ("descricao_ocorrencia", "TEXT"),
        ("recursos_adicionais", "TEXT"),
        ("resultado_especie", "TEXT"),
        ("especie_status", "TEXT"),
        ("especie_catalogo_id", "TEXT"),
        ("foto_especie", "TEXT"),
        ("questionario_json", "TEXT"),
        ("rubrica_solicitante_json", "TEXT"),
    ]
    for col, col_type in migrations:
        if not _column_exists(db, "vistorias", col):
            db.execute(f"ALTER TABLE vistorias ADD COLUMN {col} {col_type}")

    if not _column_exists(db, "usuarios", "nome_guerra"):
        db.execute("ALTER TABLE usuarios ADD COLUMN nome_guerra TEXT")
        db.execute(
            "UPDATE usuarios SET nome_guerra = nome "
            "WHERE nome_guerra IS NULL OR TRIM(nome_guerra) = ''"
        )

    _seed_admin(db)
    _seed_usuarios_padrao(db)
    db.executescript(
        """
        CREATE TABLE IF NOT EXISTS vistorias_viaturas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            codigo TEXT,
            placa TEXT NOT NULL,
            tipo_viatura TEXT,
            km TEXT,
            condutor TEXT,
            observacoes TEXT,
            checklist_json TEXT NOT NULL,
            assinatura_json TEXT,
            pontuacao_total INTEGER NOT NULL,
            recomendacao TEXT NOT NULL,
            justificativa TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS cadastro_viaturas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ar TEXT NOT NULL UNIQUE,
            placa TEXT NOT NULL UNIQUE,
            marca TEXT NOT NULL,
            modelo TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
        );

        CREATE TABLE IF NOT EXISTS pops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            filename TEXT NOT NULL,
            original_name TEXT,
            mime_type TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            uploaded_by TEXT
        );
        """
    )
    db.commit()


def _seed_admin(db):
    from app.auth_utils import hash_senha, limpar_cpf

    row = db.execute("SELECT id FROM usuarios WHERE cpf = ?", ("00000000000",)).fetchone()
    if row:
        return
    db.execute(
        """
        INSERT INTO usuarios (nome, nome_guerra, matricula, cpf, posto, perfil, senha_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            "Administrador",
            "Admin",
            "0001",
            "00000000000",
            "Capitão",
            "Administrador",
            hash_senha("admin123"),
        ),
    )


def _seed_usuarios_padrao(db):
    """Usuários de operação incluídos no seed do APK (insert se CPF ainda não existir)."""
    padrao = [
        {
            "nome": "David Weyner",
            "nome_guerra": "Weyner",
            "matricula": "45454545",
            "cpf": "11111111111",
            "posto": "Subtenente",
            "perfil": "Chefe de Socorro",
            "senha_hash": "289160db0d9f39f9ae1754c4ec9c16f90b50e32e09c5fb5481ae642b3d3d1a36",
        },
        {
            "nome": "Tácito Lira",
            "nome_guerra": "Tácito",
            "matricula": "565656565",
            "cpf": "22222222222",
            "posto": "3° Sargento",
            "perfil": "Condutor de viatura",
            "senha_hash": "289160db0d9f39f9ae1754c4ec9c16f90b50e32e09c5fb5481ae642b3d3d1a36",
        },
    ]
    for u in padrao:
        if db.execute("SELECT id FROM usuarios WHERE cpf = ?", (u["cpf"],)).fetchone():
            continue
        db.execute(
            """
            INSERT INTO usuarios (nome, nome_guerra, matricula, cpf, posto, perfil, senha_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                u["nome"],
                u["nome_guerra"],
                u["matricula"],
                u["cpf"],
                u["posto"],
                u["perfil"],
                u["senha_hash"],
            ),
        )


def init_db(app):
    app.teardown_appcontext(close_db)

    with app.app_context():
        db = get_db()
        _migrate(db)


def get_questionario_vistoria(vistoria_row) -> dict:
    try:
        raw = vistoria_row["questionario_json"]
    except (KeyError, IndexError):
        return {}
    if raw:
        return json.loads(raw)
    return {}


def get_notas_vistoria(vistoria_row) -> dict:
    """Retorna notas de uma vistoria (JSON ou colunas legadas)."""
    if vistoria_row["notas_json"]:
        return json.loads(vistoria_row["notas_json"])

    from app.config_loader import get_criterios

    legacy_map = {c["id"]: c["id"] for c in get_criterios()}
    notas = {}
    for cid in legacy_map:
        if cid in vistoria_row.keys() and vistoria_row[cid] is not None:
            notas[cid] = vistoria_row[cid]
    return notas


def get_fotos_vistoria(vistoria_id: int) -> list:
    db = get_db()
    return db.execute(
        "SELECT id, filename, created_at FROM fotos WHERE vistoria_id = ? ORDER BY id",
        (vistoria_id,),
    ).fetchall()


def get_assinatura_vistoria(vistoria_row):
    if vistoria_row["assinatura_json"]:
        return json.loads(vistoria_row["assinatura_json"])
    return None


def get_rubrica_solicitante(vistoria_row):
    try:
        raw = vistoria_row["rubrica_solicitante_json"]
    except (KeyError, IndexError):
        return None
    if raw:
        return json.loads(raw)
    return None


def _ano_vistoria(vistoria_row) -> str:
    from datetime import datetime

    created = vistoria_row["created_at"]
    if created:
        texto = str(created)
        if len(texto) >= 4 and texto[:4].isdigit():
            return texto[:4]
        if "/" in texto:
            partes = texto.split("/")
            if len(partes) >= 3 and partes[-1].isdigit():
                return partes[-1][:4]
    return str(datetime.now().year)


def numero_laudo_vistoria(vistoria_row, db=None) -> str:
    """Número sequencial no formato 0001/2026 (código/ano vigente)."""
    try:
        codigo = vistoria_row["codigo"]
    except (KeyError, IndexError):
        codigo = None
    if codigo:
        return codigo

    vid = vistoria_row["id"]
    ano = _ano_vistoria(vistoria_row)
    if db is None:
        db = get_db()
    row = db.execute(
        "SELECT COUNT(*) as n FROM vistorias WHERE strftime('%Y', created_at) = ? AND id <= ?",
        (ano, vid),
    ).fetchone()
    return f"{row['n']:04d}/{ano}"


def atribuir_numero_laudo(vistoria_id: int) -> str:
    db = get_db()
    row = db.execute("SELECT * FROM vistorias WHERE id = ?", (vistoria_id,)).fetchone()
    if row is None:
        return ""
    if row["codigo"]:
        return row["codigo"]
    numero = numero_laudo_vistoria(row, db)
    db.execute("UPDATE vistorias SET codigo = ? WHERE id = ?", (numero, vistoria_id))
    db.commit()
    return numero


def numero_vistoria_viatura(row, db=None) -> str:
    try:
        codigo = row["codigo"]
    except (KeyError, IndexError):
        codigo = None
    if codigo:
        return codigo

    vid = row["id"]
    ano = _ano_vistoria(row)
    if db is None:
        db = get_db()
    count = db.execute(
        "SELECT COUNT(*) as n FROM vistorias_viaturas "
        "WHERE strftime('%Y', created_at) = ? AND id <= ?",
        (ano, vid),
    ).fetchone()
    return f"V{count['n']:04d}/{ano}"


def atribuir_numero_vistoria_viatura(vistoria_id: int) -> str:
    db = get_db()
    row = db.execute(
        "SELECT * FROM vistorias_viaturas WHERE id = ?", (vistoria_id,)
    ).fetchone()
    if row is None:
        return ""
    if row["codigo"]:
        return row["codigo"]
    numero = numero_vistoria_viatura(row, db)
    db.execute(
        "UPDATE vistorias_viaturas SET codigo = ? WHERE id = ?",
        (numero, vistoria_id),
    )
    db.commit()
    return numero


def get_checklist_viatura(row) -> dict:
    try:
        raw = row["checklist_json"]
    except (KeyError, IndexError):
        return {}
    if raw:
        return json.loads(raw)
    return {}


def get_assinatura_viatura(row):
    try:
        raw = row["assinatura_json"]
    except (KeyError, IndexError):
        return None
    if raw:
        return json.loads(raw)
    return None
