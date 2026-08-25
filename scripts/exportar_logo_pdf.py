"""Gera logo embutido (base64) para PDF offline no APK."""
import base64
import io
import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "app", "static", "img", "logo-bba.png")
OUT = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "logo-bba-data.js"
)


def exportar_logo():
    img = Image.open(SRC).convert("RGBA")
    img.thumbnail((280, 280), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(f'const LOGO_BBA_DATA_URL = "data:image/png;base64,{b64}";\n')
    print(f"Logo PDF exportado: {OUT} ({len(buf.getvalue())} bytes)")


if __name__ == "__main__":
    exportar_logo()
