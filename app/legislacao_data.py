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
        "descricao": "Legislação federal, estadual (Maranhão) e municipal (São Luís)",
        "documentos": [
            {
                "id": "cf_art225",
                "titulo": "Constituição Federal — meio ambiente",
                "referencia": "CF/1988",
                "data": "1988",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Art. 225",
                        "texto": "Todos têm direito ao meio ambiente ecologicamente equilibrado; dever de defendê-lo.",
                    },
                    {
                        "numero": "Art. 225, § 1º, inc. IV",
                        "texto": "Exigir, na forma da lei, prévia EIA para obras potencialmente causadoras de degradação.",
                    },
                ],
            },
            {
                "id": "lei_12651",
                "titulo": "Lei nº 12.651/2012 — Código Florestal",
                "referencia": "Lei federal",
                "data": "2012",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Art. 3º",
                        "texto": "Define vegetação nativa, supressão, APP e Reserva Legal.",
                    },
                    {
                        "numero": "Art. 4º",
                        "texto": "Define Áreas de Preservação Permanente (APP).",
                    },
                    {
                        "numero": "Art. 7º",
                        "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente.",
                    },
                ],
            },
            {
                "id": "lei_5197",
                "titulo": "Lei nº 5.197/1967 — proteção da fauna e flora",
                "referencia": "Lei federal",
                "data": "1967",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Art. 2º",
                        "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora.",
                    },
                    {
                        "numero": "Art. 3º",
                        "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização.",
                    },
                ],
            },
            {
                "id": "lei_9605",
                "titulo": "Lei nº 9.605/1998 — Crimes ambientais",
                "referencia": "Lei federal",
                "data": "1998",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Art. 38",
                        "texto": "Destruir ou danificar floresta nativa ou plantada, sem autorização legal.",
                    },
                    {
                        "numero": "Art. 49",
                        "texto": "Destruir ou danificar vegetação em florestas ou demais formas de vegetação.",
                    },
                ],
            },
            {
                "id": "decreto_ma_11593",
                "titulo": "Decreto MA nº 11.593/1990 — tombamento de árvores raras (São Luís)",
                "referencia": "Estado do Maranhão",
                "data": "1990",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Capítulo único",
                        "texto": "Tombamento de sumaúmas, ficus, palmeiras imperiais, oitis, juçarais e buritizais em São Luís.",
                    },
                    {
                        "numero": "Base legal",
                        "texto": "Lei Estadual MA nº 3.999/1978 e Resolução Conselho Estadual de Cultura nº 018/1987.",
                    },
                ],
            },
            {
                "id": "lei_ma_3999",
                "titulo": "Lei MA nº 3.999/1978 — patrimônio paisagístico",
                "referencia": "Estado do Maranhão",
                "data": "1978",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Art. 1º",
                        "texto": "Proteção do patrimônio histórico, artístico e paisagístico do Maranhão.",
                    },
                    {
                        "numero": "Art. 3º",
                        "texto": "Tombamento de bens de valor histórico, artístico ou paisagístico.",
                    },
                ],
            },
            {
                "id": "lei_babacu_ma",
                "titulo": "Lei MA nº 4.734/1986 e Lei MA nº 7.824/2003 — babaçu",
                "referencia": "Estado do Maranhão",
                "data": "1986/2003",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Lei 4.734/1986, Art. 1º",
                        "texto": "Proíbe a derrubada de palmeiras de babaçu no Estado do Maranhão.",
                    },
                    {
                        "numero": "Lei 7.824/2003, Art. 1º",
                        "texto": "Garante o extrativismo familiar do babaçu.",
                    },
                    {
                        "numero": "Lei 7.824/2003, Art. 2º",
                        "texto": "Assegura acesso ao babaçu em áreas públicas e privadas.",
                    },
                ],
            },
            {
                "id": "lei_arborizacao_sao_luis",
                "titulo": "Lei Municipal São Luís nº 7.811/2026 — Política de Arborização",
                "referencia": "Município de São Luís/MA",
                "data": "2026",
                "arquivo": None,
                "artigos": [
                    {
                        "numero": "Art. 1º",
                        "texto": "Institui a Política Municipal de Arborização de São Luís.",
                    },
                    {
                        "numero": "Art. 6º",
                        "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana.",
                    },
                    {
                        "numero": "Art. 7º",
                        "texto": "Diretrizes de gestão integrada, poda, plantio e proteção do verde urbano.",
                    },
                    {
                        "numero": "Art. 30",
                        "texto": "Altera a Lei Municipal nº 7.380/2023 (competências do Impur).",
                    },
                ],
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
