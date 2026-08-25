"""Gera icones Android a partir do brasao BBA."""
from PIL import Image
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "app", "static", "img", "logo-bba.png")
RES = os.path.join(ROOT, "android", "app", "src", "main", "res")

# Tamanhos launcher legado por densidade
MIPMAP = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

# Foreground adaptativo (108dp * density)
ADAPTIVE_FG = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}


def make_icon(size: int, fill_ratio: float = 1.0) -> Image.Image:
    """Redimensiona o brasao preenchendo o quadrado."""
    logo = Image.open(SRC).convert("RGBA")
    canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))

    target = int(size * fill_ratio)
    logo.thumbnail((target, target), Image.Resampling.LANCZOS)

    x = (size - logo.width) // 2
    y = (size - logo.height) // 2
    canvas.paste(logo, (x, y), logo if logo.mode == "RGBA" else None)
    return canvas.convert("RGB")


def main():
    for folder, size in MIPMAP.items():
        path = os.path.join(RES, folder)
        os.makedirs(path, exist_ok=True)
        icon = make_icon(size, fill_ratio=0.95)
        icon.save(os.path.join(path, "ic_launcher.png"), "PNG", optimize=True)
        icon.save(os.path.join(path, "ic_launcher_round.png"), "PNG", optimize=True)
        print(f"  {folder}: {size}px")

    for folder, size in ADAPTIVE_FG.items():
        path = os.path.join(RES, folder)
        os.makedirs(path, exist_ok=True)
        fg = make_icon(size, fill_ratio=0.82)
        fg.save(os.path.join(path, "ic_launcher_foreground.png"), "PNG", optimize=True)

    print("Icones gerados com sucesso.")


if __name__ == "__main__":
    main()
