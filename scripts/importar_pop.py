"""Importa um PDF de POP para o banco SQLite e pasta instance/pops."""
import glob
import os
import shutil
import sqlite3
import uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(ROOT, "instance", "vistorias.db")
POP_FOLDER = os.path.join(ROOT, "instance", "pops")


def _origem_padrao() -> str | None:
    padroes = [
        os.path.join(os.path.expanduser("~"), "Downloads", "Apresentação POP do BBA.pdf"),
        os.path.join(os.path.expanduser("~"), "Downloads", "Apresentacao POP do BBA.pdf"),
        os.path.join(ROOT, "Apresentação POP do BBA.pdf"),
    ]
    for caminho in padroes:
        if os.path.isfile(caminho):
            return caminho
    downloads = glob.glob(
        os.path.join(os.path.expanduser("~"), "Downloads", "Apresent*POP*BBA*.pdf")
    )
    return downloads[0] if downloads else None


def importar_pop(
    origem: str | None = None,
    titulo: str = "POP DE CORTE DE ÁRVORE DO BBA/CBMMA",
    uploaded_by: str = "Administrador",
) -> dict:
    origem = origem or _origem_padrao()
    if not origem or not os.path.isfile(origem):
        raise FileNotFoundError("Arquivo POP não encontrado. Informe o caminho do PDF.")

    os.makedirs(POP_FOLDER, exist_ok=True)
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    ext = os.path.splitext(origem)[1].lower() or ".pdf"
    stored = f"{uuid.uuid4().hex}{ext}"
    destino = os.path.join(POP_FOLDER, stored)
    shutil.copy2(origem, destino)

    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS pops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            filename TEXT NOT NULL,
            original_name TEXT,
            mime_type TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            uploaded_by TEXT
        )
        """
    )

    existente = db.execute(
        "SELECT id, filename FROM pops WHERE titulo = ? ORDER BY id DESC LIMIT 1",
        (titulo,),
    ).fetchone()

    original_name = os.path.basename(origem)
    if existente:
        antigo = os.path.join(POP_FOLDER, existente["filename"])
        if os.path.isfile(antigo) and os.path.abspath(antigo) != os.path.abspath(destino):
            try:
                os.remove(antigo)
            except OSError:
                pass
        db.execute(
            """
            UPDATE pops
            SET filename = ?, original_name = ?, mime_type = ?, uploaded_by = ?,
                created_at = datetime('now', 'localtime')
            WHERE id = ?
            """,
            (stored, original_name, "application/pdf", uploaded_by, existente["id"]),
        )
        pop_id = existente["id"]
    else:
        cur = db.execute(
            """
            INSERT INTO pops (titulo, filename, original_name, mime_type, uploaded_by)
            VALUES (?, ?, ?, ?, ?)
            """,
            (titulo, stored, original_name, "application/pdf", uploaded_by),
        )
        pop_id = cur.lastrowid

    db.commit()
    row = db.execute("SELECT * FROM pops WHERE id = ?", (pop_id,)).fetchone()
    db.close()
    return {k: row[k] for k in row.keys()}


if __name__ == "__main__":
    import sys

    caminho = sys.argv[1] if len(sys.argv) > 1 else None
    pop = importar_pop(caminho)
    print(f"POP importado: id={pop['id']} titulo={pop['titulo']}")
    print(f"  arquivo: {pop['filename']}")
