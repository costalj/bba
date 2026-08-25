"""Gera sync-config.js com defaults do .env (SUPABASE_URL / SUPABASE_ANON_KEY)."""
import json
import os

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_PATH = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "sync-config.js"
)


def exportar():
    url = (os.environ.get("SUPABASE_URL") or "").strip().rstrip("/")
    key = (os.environ.get("SUPABASE_ANON_KEY") or "").strip()
    # Mantém arquivo editável: só sobrescreve defaults embutidos
    content = f"""/* Gerado por scripts/exportar_sync_config.py — defaults do .env no build */
const SYNC_CONFIG_DEFAULT = {{
  url: {json.dumps(url)},
  anonKey: {json.dumps(key)},
}};

const SYNC_CONFIG_STORAGE_KEY = "bba_sync_config";

function getSyncConfigDefaults() {{
  return {{ ...SYNC_CONFIG_DEFAULT }};
}}
"""
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print(
        f"Sync config exportado: {OUT_PATH} "
        f"(url={'sim' if url else 'vazio'}, key={'sim' if key else 'vazio'})"
    )


if __name__ == "__main__":
    exportar()
