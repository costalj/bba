"""Checklist básico de vistoria de viaturas (web e APK)."""

CHECKLIST_SECOES = [
    {
        "id": "documentacao",
        "titulo": "2. Documentação",
        "perguntas": [
            {"id": "v_crlv", "numero": "2.1", "texto": "CRLV na viatura e em dia"},
            {"id": "v_licenciamento", "numero": "2.2", "texto": "Licenciamento vigente"},
            {"id": "v_seguro", "numero": "2.3", "texto": "Seguro obrigatório vigente"},
        ],
    },
    {
        "id": "externo",
        "titulo": "3. Parte externa e sinalização",
        "perguntas": [
            {
                "id": "v_farois",
                "numero": "3.1",
                "texto": "Faróis, lanternas e setas funcionando",
                "critico": True,
            },
            {"id": "v_giroflex", "numero": "3.2", "texto": "Giroflex / sinalização visual"},
            {
                "id": "v_sirene",
                "numero": "3.3",
                "texto": "Sirene e buzina em funcionamento",
                "critico": True,
            },
            {
                "id": "v_pneus",
                "numero": "3.4",
                "texto": "Pneus em bom estado e calibrados",
                "critico": True,
            },
            {"id": "v_estepe", "numero": "3.5", "texto": "Estepe, macaco e triângulo"},
            {"id": "v_parabrisa", "numero": "3.6", "texto": "Para-brisa e limpadores em ordem"},
        ],
    },
    {
        "id": "mecanica",
        "titulo": "4. Mecânica e fluídos",
        "perguntas": [
            {"id": "v_oleo", "numero": "4.1", "texto": "Nível de óleo do motor adequado"},
            {"id": "v_agua", "numero": "4.2", "texto": "Nível de água do radiador adequado"},
            {
                "id": "v_combustivel",
                "numero": "4.3",
                "texto": "Combustível suficiente para o serviço",
                "critico": True,
            },
            {
                "id": "v_freios",
                "numero": "4.4",
                "texto": "Freios sem anomalia aparente",
                "critico": True,
            },
            {"id": "v_bateria", "numero": "4.5", "texto": "Bateria e partida em ordem"},
        ],
    },
    {
        "id": "cabine",
        "titulo": "5. Cabine e equipamentos",
        "perguntas": [
            {"id": "v_cintos", "numero": "5.1", "texto": "Cintos de segurança em ordem"},
            {"id": "v_painel", "numero": "5.2", "texto": "Painel sem luzes de alerta"},
            {"id": "v_radio", "numero": "5.3", "texto": "Rádio de comunicação operacional"},
            {"id": "v_extintor", "numero": "5.4", "texto": "Extintor da viatura em condições"},
            {"id": "v_limpeza", "numero": "5.5", "texto": "Limpeza e organização da cabine"},
        ],
    },
]

TIPOS_VIATURA = [
    "Auto Bomba",
    "Auto Tanque",
    "Pick-up / Camionete",
    "Van",
    "Motocicleta",
    "Outro",
]


def iter_checklist_perguntas():
    for secao in CHECKLIST_SECOES:
        for pergunta in secao["perguntas"]:
            yield secao, pergunta


def total_itens_checklist() -> int:
    return sum(len(s["perguntas"]) for s in CHECKLIST_SECOES)


def calcular_resultado_viatura(respostas: dict) -> dict:
    nao_ids = []
    criticos = []
    for _secao, pergunta in iter_checklist_perguntas():
        if respostas.get(pergunta["id"]) != "sim":
            nao_ids.append(pergunta["id"])
            if pergunta.get("critico"):
                criticos.append(pergunta["texto"])

    total_nao = len(nao_ids)
    max_itens = total_itens_checklist()

    if criticos:
        recomendacao = "IMPEDIDA"
        justificativa = (
            f"A viatura está IMPEDIDA para o serviço: {total_nao} item(ns) não conforme(s), "
            f"incluindo item crítico ({'; '.join(criticos)})."
        )
    elif total_nao == 0:
        recomendacao = "APROVADA"
        justificativa = (
            f"Todos os {max_itens} itens do checklist estão conformes. "
            "A viatura está apta para o serviço."
        )
    elif total_nao <= 3:
        recomendacao = "APROVADA COM RESTRIÇÕES"
        justificativa = (
            f"{total_nao} item(ns) não conforme(s), sem falha crítica. "
            "A viatura pode operar com restrições até a correção."
        )
    else:
        recomendacao = "IMPEDIDA"
        justificativa = (
            f"{total_nao} itens não conformes. A viatura fica impedida até a correção."
        )

    return {
        "pontuacao_total": total_nao,
        "pontuacao_maxima": max_itens,
        "recomendacao": recomendacao,
        "justificativa": justificativa,
        "itens_nao_conformes": total_nao,
        "itens_criticos": criticos,
    }
