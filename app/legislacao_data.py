"""Catálogo de documentos do módulo Legislação (web e APK)."""

from app.especies_protegidas_data import DOCUMENTOS_ESPECIES, ESPECIES_PROTEGIDAS

LEGISLACAO_CATEGORIAS = [
    {
        "id": "portarias",
        "titulo": "Portarias",
        "icone": "📜",
        "cor": "#b45309",
        "descricao": "Portarias do CBMMA, SSP e do Batalhão de Bombeiros Ambiental",
        "documentos": [
            {
                "id": "port_bba_estrutura",
                "titulo": "Estrutura e competências do BBA",
                "referencia": "Portaria CBMMA — BBA",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "port_vistoria_arborea",
                "titulo": "Procedimentos de vistoria arbórea em ocorrências",
                "referencia": "Portaria CBMMA — Operações ambientais",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "port_epi_ambiental",
                "titulo": "EPIs e uniformes para serviços ambientais",
                "referencia": "Portaria CBMMA — Material e equipamento",
                "data": "—",
                "arquivo": None,
            },
        ],
    },
    {
        "id": "boletim_geral",
        "titulo": "Boletim Geral (BG)",
        "icone": "📋",
        "cor": "#1d4ed8",
        "descricao": "Publicações oficiais, escalas, comunicados e orientações do comando",
        "documentos": [
            {
                "id": "bg_atual",
                "titulo": "Boletim Geral — edição vigente",
                "referencia": "BG CBMMA",
                "data": "Atualizar",
                "arquivo": None,
            },
            {
                "id": "bg_bba",
                "titulo": "Comunicados e escalas do BBA",
                "referencia": "Seção BBA — BG",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "bg_arquivo",
                "titulo": "Arquivo de Boletins Gerais anteriores",
                "referencia": "Histórico BG",
                "data": "—",
                "arquivo": None,
            },
        ],
    },
    {
        "id": "manuais",
        "titulo": "Manuais",
        "icone": "📘",
        "cor": "#0369a1",
        "descricao": "Manuais operacionais, técnicos e de conduta da guarnição",
        "documentos": [
            {
                "id": "manual_vistoria_arvore",
                "titulo": "Manual de vistoria de árvore — questionário SEI",
                "referencia": "CBMMA / BBA",
                "data": "2026",
                "arquivo": None,
            },
            {
                "id": "manual_operacional_bba",
                "titulo": "Manual operacional do Batalhão de Bombeiros Ambiental",
                "referencia": "BBA",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "manual_seguranca_copa",
                "titulo": "Manual de segurança em podas e trabalho em copa",
                "referencia": "CBMMA",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "manual_cadeia_comando",
                "titulo": "Manual de conduta e cadeia de comando em GU",
                "referencia": "CBMMA",
                "data": "—",
                "arquivo": None,
            },
        ],
    },
    {
        "id": "leis_decretos",
        "titulo": "Leis e Decretos",
        "icone": "⚖️",
        "cor": "#334155",
        "descricao": "Legislação federal, estadual e municipal aplicável",
        "documentos": [
            {
                "id": "cf_art225",
                "titulo": "Constituição Federal — meio ambiente (art. 225)",
                "referencia": "CF/1988",
                "data": "1988",
                "arquivo": None,
            },
            {
                "id": "lei_12651",
                "titulo": "Lei nº 12.651/2012 — Código Florestal",
                "referencia": "Lei federal",
                "data": "2012",
                "arquivo": None,
            },
            {
                "id": "decreto_ma_ambiental",
                "titulo": "Decretos e regulamentos ambientais do Maranhão",
                "referencia": "Estado do MA",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "lei_arborizacao_urbana",
                "titulo": "Leis municipais de arborização urbana e poda",
                "referencia": "Municípios atendidos",
                "data": "—",
                "arquivo": None,
            },
        ],
    },
    {
        "id": "normas",
        "titulo": "Normas e Instruções",
        "icone": "📑",
        "cor": "#0f766e",
        "descricao": "Normas CONAMA, instruções normativas e orientações técnicas",
        "documentos": [
            {
                "id": "norma_supressao_vegetal",
                "titulo": "Normas para supressão de vegetação e licenciamento",
                "referencia": "CONAMA / órgãos ambientais",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "instrucao_autorizacao_poda",
                "titulo": "Instruções para autorização de poda e corte privado",
                "referencia": "Orientação ao solicitante",
                "data": "—",
                "arquivo": None,
            },
            {
                "id": "norma_registro_ocorrencia",
                "titulo": "Padrão de registro de ocorrência e laudo ambiental",
                "referencia": "CBMMA — SEI",
                "data": "2026",
                "arquivo": None,
            },
        ],
    },
    {
        "id": "especies_protegidas",
        "titulo": "Espécies protegidas",
        "icone": "🌳",
        "cor": "#166534",
        "descricao": "Espécies ameaçadas, imunes, tombadas e protegidas (consulta na vistoria)",
        "documentos": DOCUMENTOS_ESPECIES,
        "especies": ESPECIES_PROTEGIDAS,
    },
]


def get_categoria(cat_id: str):
    return next((c for c in LEGISLACAO_CATEGORIAS if c["id"] == cat_id), None)
