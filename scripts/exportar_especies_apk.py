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

OUT_APK = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "especies-data.js"
)
OUT_WEB = os.path.join(ROOT, "app", "static", "js", "especies-data.js")


def exportar():
    payload = {
        "especies": ESPECIES_PROTEGIDAS,
        "documentos": DOCUMENTOS_ESPECIES,
        "status_label": STATUS_LABEL,
    }
    texto = json.dumps(payload, ensure_ascii=False, indent=2)
    conteudo = (
        "/* Gerado por scripts/exportar_especies_apk.py — nao editar manualmente */\n"
        f"const ESPECIES_CATALOGO = {texto};\n"
    )
    for destino in (OUT_APK, OUT_WEB):
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        with open(destino, "w", encoding="utf-8", newline="\n") as f:
            f.write(conteudo)
        print(f"Especies exportadas: {destino}")
    print(f"  especies: {len(ESPECIES_PROTEGIDAS)}")
    print(f"  documentos: {len(DOCUMENTOS_ESPECIES)}")


if __name__ == "__main__":
    exportar()
