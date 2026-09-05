"""Lógica de pontuação — questionário CBMMA (itens 3 e 4, respostas SIM)."""

from app.config_loader import (
    get_limiares_risco,
    get_orientacoes,
    get_perguntas_risco,
    get_perguntas_secao,
    total_perguntas_risco,
)

_NIVEL_KEY = {"ALTO": "alto", "MÉDIO": "medio", "BAIXO": "baixo"}


def _conta_resposta_risco(pergunta: dict, respostas: dict) -> bool:
    valor = respostas.get(pergunta["id"])
    if pergunta.get("contagem_invertida"):
        return valor == "nao"
    return valor == "sim"


def _contar_sim_perguntas(perguntas: list, respostas: dict) -> int:
    return sum(1 for p in perguntas if _conta_resposta_risco(p, respostas))


def _contar_sim(respostas: dict) -> int:
    return _contar_sim_perguntas(get_perguntas_risco(), respostas)


def _classificar_risco(sim_count: int) -> str:
    lim = get_limiares_risco()
    if sim_count >= lim["alto"]["min"]:
        return "ALTO"
    if sim_count >= lim["medio"]["min"]:
        return "MÉDIO"
    return "BAIXO"


def _faixa_nivel(nivel: str) -> str:
    lim = get_limiares_risco()[_NIVEL_KEY[nivel]]
    return f"{lim['min']} a {lim['max']}"


def _somatorio(respostas: dict, sim_count: int, nivel: str) -> dict:
    max_sim = total_perguntas_risco()
    sim_3 = _contar_sim_perguntas(get_perguntas_secao("avaliacao_geral"), respostas)
    sim_4 = _contar_sim_perguntas(get_perguntas_secao("avaliacao_estrutura"), respostas)
    orient = get_orientacoes()
    return {
        "secao_3_sim": sim_3,
        "secao_3_total": len(get_perguntas_secao("avaliacao_geral")),
        "secao_4_sim": sim_4,
        "secao_4_total": len(get_perguntas_secao("avaliacao_estrutura")),
        "total_3_4_sim": sim_count,
        "total_3_4_max": max_sim,
        "nivel": nivel,
        "faixa": _faixa_nivel(nivel),
        "tabela_niveis": orient.get("tabela_niveis", []),
    }


def _alertas_e_impeditivos(respostas: dict) -> list:
    orient = get_orientacoes()
    msgs = []
    for qid, texto in (orient.get("impeditivos") or {}).items():
        if respostas.get(qid) == "sim":
            msgs.append(texto)
    for qid, texto in (orient.get("alertas") or {}).items():
        if respostas.get(qid) == "sim":
            msgs.append(texto)
    return msgs


def _orientacao_conduta(nivel: str, respostas: dict) -> list:
    orient = get_orientacoes()
    conduta = list(orient.get("conduta_gu", {}).get(_NIVEL_KEY[nivel], []))
    alertas = _alertas_e_impeditivos(respostas)
    if nivel in ("BAIXO", "MÉDIO") and orient.get("poda_nao_iminente"):
        conduta.append(orient["poda_nao_iminente"])
    return conduta + alertas


def _justificativa(nivel: str, sim_count: int, max_sim: int) -> str:
    return (
        f"Conforme parâmetros do relatório SEI, obtiveram-se {sim_count} indicador(es) "
        f"de risco nos itens 3 e 4 (máximo {max_sim}), classificando a árvore com "
        f"{nivel} risco potencial de queda ({_faixa_nivel(nivel)})."
    )


def calcular_resultado(respostas: dict) -> dict:
    """Calcula risco a partir do questionário SIM/NÃO (formato CBMMA)."""
    max_sim = total_perguntas_risco()
    sim_count = _contar_sim(respostas)
    nivel = _classificar_risco(sim_count)

    return {
        "pontuacao_total": sim_count,
        "pontuacao_maxima": max_sim,
        "recomendacao": nivel,
        "nivel_risco": nivel,
        "justificativa": _justificativa(nivel, sim_count, max_sim),
        "supressao_recomendada": nivel == "ALTO",
        "respostas_sim": sim_count,
        "somatorio": _somatorio(respostas, sim_count, nivel),
        "orientacao_conduta": _orientacao_conduta(nivel, respostas),
    }


def calcular_resultado_legado(notas: dict) -> dict:
    """Compatibilidade com vistorias antigas (notas 0–3)."""
    from app.config_loader import get_criterios, get_limiares, get_nota_range, pontuacao_maxima

    criterios = get_criterios()
    limiares = get_limiares()
    nota_min, nota_max = get_nota_range()
    max_total = pontuacao_maxima()

    total = 0
    for c in criterios:
        valor = notas.get(c["id"], nota_min)
        total += max(nota_min, min(nota_max, int(valor)))

    if total >= limiares["supressao"]:
        recomendacao = "SUPRESSÃO"
    elif total >= limiares["intervencao"]:
        recomendacao = "INTERVENÇÃO URGENTE"
    elif total >= limiares["acompanhamento"]:
        recomendacao = "PODAS / ACOMPANHAMENTO"
    else:
        recomendacao = "MANUTENÇÃO"

    return {
        "pontuacao_total": total,
        "pontuacao_maxima": max_total,
        "recomendacao": recomendacao,
        "nivel_risco": recomendacao,
        "justificativa": f"Pontuação legada: {total}/{max_total}.",
        "supressao_recomendada": total >= limiares["supressao"],
        "respostas_sim": total,
        "somatorio": None,
        "orientacao_conduta": [],
    }


def resultado_de_vistoria(vistoria_row, notas: dict | None = None) -> dict:
    """Retorna resultado conforme formato salvo na vistoria."""
    if vistoria_row["questionario_json"]:
        import json

        respostas = json.loads(vistoria_row["questionario_json"])
        return calcular_resultado(respostas)

    notas = notas or {}
    if notas:
        return calcular_resultado_legado(notas)
    return {
        "pontuacao_total": vistoria_row["pontuacao_total"],
        "pontuacao_maxima": total_perguntas_risco(),
        "recomendacao": vistoria_row["recomendacao"],
        "nivel_risco": vistoria_row["recomendacao"],
        "justificativa": vistoria_row["justificativa"],
        "supressao_recomendada": vistoria_row["recomendacao"] in ("ALTO", "SUPRESSÃO"),
        "respostas_sim": vistoria_row["pontuacao_total"],
        "somatorio": None,
        "orientacao_conduta": [],
    }
