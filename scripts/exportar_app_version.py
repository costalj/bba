"""Gera app-version.js para o APK (versão instalada + repo GitHub opcional)."""
import json
import os

try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION_PATH = os.path.join(ROOT, "VERSION.json")
OUT_PATH = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "app-version.js"
)


def _github_repo_default() -> str:
    env = os.environ.get("GITHUB_REPO", "").strip()
    if env:
        return env
    gh = os.environ.get("GITHUB_REPOSITORY", "").strip()
    return gh


def exportar():
    with open(VERSION_PATH, encoding="utf-8") as f:
        data = json.load(f)
    repo = _github_repo_default()
    content = (
        "/* Gerado por scripts/exportar_app_version.py — não editar manualmente */\n"
        f'const APP_VERSION = "{data["name"]}";\n'
        f"const APP_VERSION_CODE = {int(data['code'])};\n"
        f'const GITHUB_REPO_DEFAULT = "{repo}";\n'
    )
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    print(f"App version exportado: {OUT_PATH} (v{data['name']}, repo={repo or '—'})")


if __name__ == "__main__":
    exportar()
