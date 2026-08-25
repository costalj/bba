import os
from functools import lru_cache

import yaml

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONFIG_PATH = os.path.join(BASE_DIR, "config.yaml")
QUESTIONARIO_PATH = os.path.join(BASE_DIR, "questionario_arvores.yaml")


@lru_cache(maxsize=1)
def load_config() -> dict:
    with open(CONFIG_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)


@lru_cache(maxsize=1)
def load_questionario() -> dict:
    with open(QUESTIONARIO_PATH, encoding="utf-8") as f:
        return yaml.safe_load(f)


def reload_config():
    load_config.cache_clear()
    load_questionario.cache_clear()


def get_questionario_secoes() -> list:
    return load_questionario()["secoes"]


def get_limiares_risco() -> dict:
    return load_questionario()["limiares_risco"]


def iter_todas_perguntas():
    for secao in get_questionario_secoes():
        if secao.get("perguntas"):
            for p in secao["perguntas"]:
                yield secao, p
        for grupo in secao.get("grupos", []):
            for p in grupo["perguntas"]:
                yield secao, p


def get_perguntas_risco() -> list:
    out = []
    for secao in get_questionario_secoes():
        if not secao.get("conta_risco"):
            continue
        if secao.get("perguntas"):
            out.extend(secao["perguntas"])
        for grupo in secao.get("grupos", []):
            out.extend(grupo["perguntas"])
    return out


def total_perguntas_risco() -> int:
    return len(get_perguntas_risco())


def get_orientacoes() -> dict:
    return load_questionario().get("orientacoes", {})


def get_perguntas_secao(secao_id: str) -> list:
    for secao in get_questionario_secoes():
        if secao.get("id") != secao_id:
            continue
        out = list(secao.get("perguntas") or [])
        for grupo in secao.get("grupos", []):
            out.extend(grupo["perguntas"])
        return out
    return []


def get_criterios() -> list:
    return load_config()["criterios"]


def get_niveis() -> list:
    return load_config()["niveis"]


def get_nota_range() -> tuple[int, int]:
    cfg = load_config()
    return cfg["nota_min"], cfg["nota_max"]


def get_limiares() -> dict:
    return load_config()["limiares"]


def get_prefeitura() -> dict:
    return load_config()["prefeitura"]


def get_cabecalho_laudo() -> dict:
    return load_config().get(
        "cabecalho_laudo",
        {
            "linhas": [
                "SECRETARIA DE SEGURANÇA PÚBLICA",
                "CORPO DE BOMBEIROS MILITAR DO MARANHÃO",
                "BATALHÃO DE BOMBEIROS AMBIENTAL",
            ],
            "titulo": "RELATÓRIO DE VISTORIA DE ÁRVORE",
        },
    )


def get_fotos_config() -> dict:
    return load_config()["fotos"]


def pontuacao_maxima() -> int:
    nota_min, nota_max = get_nota_range()
    return len(get_criterios()) * nota_max
