"""Sincroniza VERSION.json com Gradle, seed, módulos web e nome do APK."""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VERSION_PATH = os.path.join(ROOT, "VERSION.json")


def load_version():
    with open(VERSION_PATH, encoding="utf-8") as f:
        data = json.load(f)
    name = str(data["name"]).strip()
    code = int(data["code"])
    if not re.fullmatch(r"\d+\.\d+\.\d+", name):
        raise ValueError(f"Versão inválida: {name} (use MAJOR.MINOR.PATCH)")
    return name, code


def _write(path, content):
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def sync():
    name, code = load_version()

    gradle_path = os.path.join(ROOT, "android", "app", "build.gradle.kts")
    gradle = open(gradle_path, encoding="utf-8").read()
    gradle = re.sub(r"versionCode\s*=\s*\d+", f"versionCode = {code}", gradle)
    gradle = re.sub(r'versionName\s*=\s*"[^"]*"', f'versionName = "{name}"', gradle)
    _write(gradle_path, gradle)

    seed_path = os.path.join(ROOT, "scripts", "exportar_seed_apk.py")
    seed = open(seed_path, encoding="utf-8").read()
    seed = re.sub(
        r'SEED_VERSION\s*=\s*"[^"]*"',
        f'SEED_VERSION = "{name}"',
        seed,
    )
    _write(seed_path, seed)

    modules_path = os.path.join(ROOT, "app", "modules.py")
    modules = open(modules_path, encoding="utf-8").read()
    modules = re.sub(
        r'"versao":\s*"[^"]*"',
        f'"versao": "{name}"',
        modules,
        count=1,
    )
    _write(modules_path, modules)

    print(f"Versão sincronizada: {name} (code {code})")


if __name__ == "__main__":
    sync()
