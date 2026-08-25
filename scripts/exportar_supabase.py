#!/usr/bin/env python3
"""Exporta dados do SQLite local para o Supabase (carga inicial, incl. fotos)."""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

try:
    from dotenv import load_dotenv
except ImportError:
    load_dotenv = None

if load_dotenv:
    load_dotenv(ROOT / ".env")

from app import create_app
from app.cloud_sync import enabled, push_all_from_sqlite
from app.database import get_db


def main():
    if not enabled():
        print("Configure SUPABASE_URL e SUPABASE_ANON_KEY no arquivo .env")
        print("Veja .env.example e docs/SINCRONIZACAO.md")
        sys.exit(1)

    app = create_app()
    with app.app_context():
        db = get_db()
        upload_folder = app.config.get("UPLOAD_FOLDER")
        counts = push_all_from_sqlite(db, upload_folder=upload_folder)
        fotos = counts.pop("fotos", 0)
        total = sum(counts.values())
        print(f"Exportação concluída: {total} registros")
        for tipo, n in counts.items():
            print(f"  - {tipo}: {n}")
        print(f"  - fotos enviadas ao Storage: {fotos}")
        print("Bucket: vistoria-fotos (paths {sync_id}/{n}.jpg)")


if __name__ == "__main__":
    main()
