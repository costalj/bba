"""Exporta catálogo de espécies protegidas para o APK offline."""
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

from app.especies_protegidas_data import (  # noqa: E402
    DOCUMENTOS_ESPECIES,
    ESPECIES_PROTEGIDAS,
    STATUS_LABEL,
)

OUT = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "especies-data.js"
)


def exportar():
    payload = {
        "especies": ESPECIES_PROTEGIDAS,
        "documentos": DOCUMENTOS_ESPECIES,
        "status_label": STATUS_LABEL,
    }
    texto = json.dumps(payload, ensure_ascii=False, indent=2)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(
            "/* Gerado por scripts/exportar_especies_apk.py — nao editar manualmente */\n"
            f"const ESPECIES_CATALOGO = {texto};\n"
        )
    print(f"Especies exportadas: {OUT}")
    print(f"  especies: {len(ESPECIES_PROTEGIDAS)}")
    print(f"  documentos: {len(DOCUMENTOS_ESPECIES)}")


if __name__ == "__main__":
    exportar()
