"""Exporta catálogo de legislação para o APK offline."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from app.legislacao_data import LEGISLACAO_CATEGORIAS  # noqa: E402

OUT = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "legislacao-data.js"
)


def exportar():
    payload = json.dumps(LEGISLACAO_CATEGORIAS, ensure_ascii=False, indent=2)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(f"const LEGISLACAO_CATEGORIAS = {payload};\n")
    total = sum(len(c["documentos"]) for c in LEGISLACAO_CATEGORIAS)
    print(f"Legislacao exportada: {OUT}")
    print(f"  categorias: {len(LEGISLACAO_CATEGORIAS)}")
    print(f"  documentos: {total}")


if __name__ == "__main__":
    exportar()
