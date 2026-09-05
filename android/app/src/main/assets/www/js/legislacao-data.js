const LEGISLACAO_CATEGORIAS = [
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
        "arquivo": null
      },
      {
        "id": "port_vistoria_arborea",
        "titulo": "Procedimentos de vistoria arbórea em ocorrências",
        "referencia": "Portaria CBMMA — Operações ambientais",
        "data": "—",
        "arquivo": null
      },
      {
        "id": "port_epi_ambiental",
        "titulo": "EPIs e uniformes para serviços ambientais",
        "referencia": "Portaria CBMMA — Material e equipamento",
        "data": "—",
        "arquivo": null
      }
    ]
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
        "arquivo": null
      },
      {
        "id": "bg_bba",
        "titulo": "Comunicados e escalas do BBA",
        "referencia": "Seção BBA — BG",
        "data": "—",
        "arquivo": null
      },
      {
        "id": "bg_arquivo",
        "titulo": "Arquivo de Boletins Gerais anteriores",
        "referencia": "Histórico BG",
        "data": "—",
        "arquivo": null
      }
    ]
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
        "arquivo": null
      },
      {
        "id": "manual_operacional_bba",
        "titulo": "Manual operacional do Batalhão de Bombeiros Ambiental",
        "referencia": "BBA",
        "data": "—",
        "arquivo": null
      },
      {
        "id": "manual_seguranca_copa",
        "titulo": "Manual de segurança em podas e trabalho em copa",
        "referencia": "CBMMA",
        "data": "—",
        "arquivo": null
      },
      {
        "id": "manual_cadeia_comando",
        "titulo": "Manual de conduta e cadeia de comando em GU",
        "referencia": "CBMMA",
        "data": "—",
        "arquivo": null
      }
    ]
  },
  {
    "id": "leis_decretos",
    "titulo": "Leis e Decretos",
    "icone": "⚖️",
    "cor": "#334155",
    "descricao": "Legislação federal, estadual (Maranhão) e municipal (São Luís, Paço do Lumiar, São José de Ribamar e Raposa)",
    "documentos": [
      {
        "id": "cf_art225",
        "titulo": "Constituição Federal — meio ambiente",
        "referencia": "CF/1988",
        "data": "1988",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 225",
            "texto": "Todos têm direito ao meio ambiente ecologicamente equilibrado; dever de defendê-lo."
          },
          {
            "numero": "Art. 225, § 1º, inc. IV",
            "texto": "Exigir, na forma da lei, prévia EIA para obras potencialmente causadoras de degradação."
          }
        ]
      },
      {
        "id": "lei_12651",
        "titulo": "Lei nº 12.651/2012 — Código Florestal",
        "referencia": "Lei federal",
        "data": "2012",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 3º",
            "texto": "Define vegetação nativa, supressão, APP e Reserva Legal."
          },
          {
            "numero": "Art. 4º",
            "texto": "Define Áreas de Preservação Permanente (APP)."
          },
          {
            "numero": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          }
        ]
      },
      {
        "id": "lei_5197",
        "titulo": "Lei nº 5.197/1967 — proteção da fauna e flora",
        "referencia": "Lei federal",
        "data": "1967",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "numero": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          }
        ]
      },
      {
        "id": "lei_9605",
        "titulo": "Lei nº 9.605/1998 — Crimes ambientais",
        "referencia": "Lei federal",
        "data": "1998",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 38",
            "texto": "Destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "numero": "Art. 49",
            "texto": "Destruir ou danificar vegetação em florestas ou demais formas de vegetação."
          }
        ]
      },
      {
        "id": "decreto_ma_11593",
        "titulo": "Decreto MA nº 11.593/1990 — tombamento de árvores raras (São Luís)",
        "referencia": "Estado do Maranhão",
        "data": "1990",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Capítulo único",
            "texto": "Tombamento de sumaúmas, ficus, palmeiras imperiais, oitis, juçarais e buritizais em São Luís."
          },
          {
            "numero": "Base legal",
            "texto": "Lei Estadual MA nº 3.999/1978 e Resolução Conselho Estadual de Cultura nº 018/1987."
          }
        ]
      },
      {
        "id": "lei_ma_3999",
        "titulo": "Lei MA nº 3.999/1978 — patrimônio paisagístico",
        "referencia": "Estado do Maranhão",
        "data": "1978",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 1º",
            "texto": "Proteção do patrimônio histórico, artístico e paisagístico do Maranhão."
          },
          {
            "numero": "Art. 3º",
            "texto": "Tombamento de bens de valor histórico, artístico ou paisagístico."
          }
        ]
      },
      {
        "id": "lei_babacu_ma",
        "titulo": "Lei MA nº 4.734/1986 e Lei MA nº 7.824/2003 — babaçu",
        "referencia": "Estado do Maranhão",
        "data": "1986/2003",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Lei 4.734/1986, Art. 1º",
            "texto": "Proíbe a derrubada de palmeiras de babaçu no Estado do Maranhão."
          },
          {
            "numero": "Lei 7.824/2003, Art. 1º",
            "texto": "Garante o extrativismo familiar do babaçu."
          },
          {
            "numero": "Lei 7.824/2003, Art. 2º",
            "texto": "Assegura acesso ao babaçu em áreas públicas e privadas."
          }
        ]
      },
      {
        "id": "lei_arborizacao_sao_luis",
        "titulo": "Lei Municipal São Luís nº 7.811/2026 — Política de Arborização",
        "referencia": "Município de São Luís/MA",
        "data": "2026",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "numero": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "numero": "Art. 7º",
            "texto": "Diretrizes de gestão integrada, poda, plantio e proteção do verde urbano."
          },
          {
            "numero": "Art. 30",
            "texto": "Altera a Lei Municipal nº 7.380/2023 (competências do Impur)."
          }
        ]
      },
      {
        "id": "lei_plano_diretor_paco_lumiar",
        "titulo": "Lei Municipal Paço do Lumiar nº 335/2006 — Plano Diretor",
        "referencia": "Município de Paço do Lumiar/MA",
        "data": "2006",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Cap. I — Política de Preservação Ambiental",
            "texto": "Estabelece diretrizes de preservação ambiental e das áreas verdes."
          },
          {
            "numero": "Art. 7º",
            "texto": "Ações prioritárias para garantir a preservação ambiental e revitalização das áreas verdes."
          }
        ]
      },
      {
        "id": "lei_codigo_posturas_paco_lumiar",
        "titulo": "Lei Complementar Paço do Lumiar nº 001/2013 — Código de Posturas",
        "referencia": "Município de Paço do Lumiar/MA",
        "data": "2013",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade visando ao ambiente urbano sustentável."
          }
        ]
      },
      {
        "id": "lei_zoneamento_sao_jose_ribamar",
        "titulo": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
        "referencia": "Município de São José de Ribamar/MA",
        "data": "2025",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 19",
            "texto": "Parcelamento deve incluir arborização de vias e áreas verdes na infraestrutura básica."
          },
          {
            "numero": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "numero": "Art. 37",
            "texto": "Obrigatoriedade de arborização de calçadas e projetos paisagísticos conforme diretrizes municipais."
          }
        ]
      },
      {
        "id": "lei_plano_diretor_raposa",
        "titulo": "Lei Municipal Raposa nº 113/2006 — Plano Diretor",
        "referencia": "Município de Raposa/MA",
        "data": "2006",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Política de desenvolvimento urbano",
            "texto": "Institui política e diretrizes de desenvolvimento urbano e ordenamento territorial."
          },
          {
            "numero": "Preservação ambiental",
            "texto": "Diretrizes de uso do solo e preservação ambiental no município de Raposa/MA."
          }
        ]
      }
    ]
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
        "arquivo": null
      },
      {
        "id": "instrucao_autorizacao_poda",
        "titulo": "Instruções para autorização de poda e corte privado",
        "referencia": "Orientação ao solicitante",
        "data": "—",
        "arquivo": null
      },
      {
        "id": "norma_registro_ocorrencia",
        "titulo": "Padrão de registro de ocorrência e laudo ambiental",
        "referencia": "CBMMA — SEI",
        "data": "2026",
        "arquivo": null
      }
    ]
  },
  {
    "id": "especies_protegidas",
    "titulo": "Espécies protegidas",
    "icone": "🌳",
    "cor": "#166534",
    "descricao": "Espécies ameaçadas, imunes, tombadas e protegidas (consulta na vistoria)",
    "documentos": [
      {
        "id": "port_mma_ameacadas",
        "titulo": "Lista oficial de espécies da flora ameaçadas de extinção",
        "referencia": "Portaria MMA nº 148/2022",
        "data": "2022",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 1º",
            "texto": "Aprova a Lista Nacional de Espécies da Flora Ameaçadas de Extinção."
          },
          {
            "numero": "Anexo I",
            "texto": "Relação das espécies ameaçadas, por categoria (CR, EN, VU)."
          }
        ]
      },
      {
        "id": "lei_codigo_florestal",
        "titulo": "Código Florestal — proteção da vegetação nativa",
        "referencia": "Lei nº 12.651/2012",
        "data": "2012",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 3º",
            "texto": "Define vegetação nativa, supressão, APP e Reserva Legal."
          },
          {
            "numero": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização."
          },
          {
            "numero": "Art. 4º",
            "texto": "Define Áreas de Preservação Permanente (APP)."
          }
        ]
      },
      {
        "id": "lei_5197_fauna_flora",
        "titulo": "Proteção da fauna e flora — espécies ameaçadas",
        "referencia": "Lei nº 5.197/1967",
        "data": "1967",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "numero": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas."
          }
        ]
      },
      {
        "id": "lei_9605_crimes",
        "titulo": "Lei de Crimes Ambientais",
        "referencia": "Lei nº 9.605/1998",
        "data": "1998",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 38",
            "texto": "Destruir ou danificar floresta nativa ou plantada, sem autorização."
          },
          {
            "numero": "Art. 49",
            "texto": "Destruir ou danificar vegetação em florestas ou demais formas de vegetação."
          }
        ]
      },
      {
        "id": "decreto_ma_11593",
        "titulo": "Tombamento de árvores raras e reserva biológica — São Luís",
        "referencia": "Decreto Estadual MA nº 11.593/1990",
        "data": "1990",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Capítulo único",
            "texto": "Tombamento de sumaúmas, ficus, palmeiras imperiais, oitis, juçarais e buritizais."
          },
          {
            "numero": "Base legal",
            "texto": "Lei Estadual MA nº 3.999/1978 e Resolução Conselho Estadual de Cultura nº 018/1987."
          }
        ]
      },
      {
        "id": "lei_babacu_ma",
        "titulo": "Proteção do babaçu e extrativismo das quebradeiras",
        "referencia": "Lei Estadual MA nº 4.734/1986 · Lei MA nº 7.824/2003",
        "data": "1986/2003",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Lei 4.734/1986, Art. 1º",
            "texto": "Proíbe a derrubada de palmeiras de babaçu no Estado do Maranhão."
          },
          {
            "numero": "Lei 7.824/2003, Art. 1º",
            "texto": "Garante o extrativismo familiar do babaçu."
          },
          {
            "numero": "Lei 7.824/2003, Art. 2º",
            "texto": "Assegura acesso ao babaçu em áreas públicas e privadas."
          }
        ]
      },
      {
        "id": "lei_arborizacao_sao_luis",
        "titulo": "Política Municipal de Arborização de São Luís",
        "referencia": "Lei Municipal São Luís nº 7.811/2026",
        "data": "2026",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "numero": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "numero": "Art. 7º",
            "texto": "Diretrizes de gestão integrada, poda, plantio e proteção do verde urbano."
          },
          {
            "numero": "Art. 30",
            "texto": "Altera a Lei Municipal nº 7.380/2023 (competências do Impur)."
          }
        ]
      },
      {
        "id": "lei_ma_3999_patrimonio",
        "titulo": "Patrimônio histórico, artístico e paisagístico do Maranhão",
        "referencia": "Lei Estadual MA nº 3.999/1978",
        "data": "1978",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 1º",
            "texto": "Proteção e conservação do patrimônio histórico, artístico e paisagístico."
          },
          {
            "numero": "Art. 3º",
            "texto": "Tombamento de bens de valor histórico, artístico ou paisagístico."
          }
        ]
      },
      {
        "id": "lei_plano_diretor_paco_lumiar",
        "titulo": "Plano Diretor e preservação ambiental — Paço do Lumiar",
        "referencia": "Lei Municipal Paço do Lumiar nº 335/2006",
        "data": "2006",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes."
          }
        ]
      },
      {
        "id": "lei_codigo_posturas_paco_lumiar",
        "titulo": "Código de Posturas — Paço do Lumiar",
        "referencia": "Lei Complementar Paço do Lumiar nº 001/2013",
        "data": "2013",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 1º",
            "texto": "Zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          }
        ]
      },
      {
        "id": "lei_zoneamento_sao_jose_ribamar",
        "titulo": "Zoneamento e preservação de árvores — São José de Ribamar",
        "referencia": "Lei de Zoneamento e Uso do Solo — SJR/MA",
        "data": "2025",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte com compensação aprovada pela SEMMAM."
          },
          {
            "numero": "Art. 37",
            "texto": "Arborização de calçadas e projetos paisagísticos obrigatórios."
          }
        ]
      },
      {
        "id": "lei_plano_diretor_raposa",
        "titulo": "Plano Diretor — Raposa/MA",
        "referencia": "Lei Municipal Raposa nº 113/2006",
        "data": "2006",
        "arquivo": null,
        "artigos": [
          {
            "numero": "Desenvolvimento urbano",
            "texto": "Política e diretrizes de desenvolvimento urbano e ordenamento territorial."
          }
        ]
      }
    ],
    "especies": [
      {
        "id": "pau_brasil",
        "nome_popular": "Pau-brasil",
        "nome_cientifico": "Paubrasilia echinata",
        "aliases": [
          "pau brasil",
          "ibirapitanga"
        ],
        "status": "ameacada",
        "esfera": "federal",
        "referencia": "Portaria MMA 148/2022 · Lei 5.197/1967 · Lei 9.605/1998",
        "conduta": "Corte vedado. Poda somente com autorização do IBAMA/órgão ambiental competente.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Espécie da flora ameaçada de extinção — categoria Vulnerável (VU)."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "federal",
            "norma": "Constituição Federal/1988",
            "artigo": "Art. 225",
            "texto": "Dever de defender e preservar o meio ambiente ecologicamente equilibrado."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "mogno",
        "nome_popular": "Mogno",
        "nome_cientifico": "Swietenia macrophylla",
        "aliases": [
          "mogno brasileiro"
        ],
        "status": "ameacada",
        "esfera": "federal",
        "referencia": "CITES · Portaria MMA 148/2022 · Lei 5.197/1967",
        "conduta": "Corte vedado. Poda somente com autorização ambiental.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "CITES — Conv. Washington",
            "artigo": "Apêndice II",
            "texto": "Comércio internacional controlado; espécie ameaçada."
          },
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Listada como ameaçada de extinção."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "cedro",
        "nome_popular": "Cedro",
        "nome_cientifico": "Cedrela odorata",
        "aliases": [
          "cedro-rosa",
          "cedro rosa"
        ],
        "status": "ameacada",
        "esfera": "federal",
        "referencia": "Portaria MMA 148/2022 · Lei 5.197/1967",
        "conduta": "Corte vedado sem autorização. Preferir poda emergencial autorizada.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Espécie ameaçada de extinção."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012 (Código Florestal)",
            "artigo": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "castanha_para",
        "nome_popular": "Castanheira-do-pará",
        "nome_cientifico": "Bertholletia excelsa",
        "aliases": [
          "castanha do para",
          "castanheira",
          "castanha-do-brasil"
        ],
        "status": "ameacada",
        "esfera": "federal",
        "referencia": "Lei 5.197/1967 · Portaria MMA 148/2022",
        "conduta": "Corte vedado. Espécie de proteção especial.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Espécie ameaçada de extinção."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "jacaranda_bahia",
        "nome_popular": "Jacarandá-da-bahia",
        "nome_cientifico": "Dalbergia nigra",
        "aliases": [
          "jacaranda",
          "jacarandá"
        ],
        "status": "ameacada",
        "esfera": "federal",
        "referencia": "CITES Apêndice I · Portaria MMA 148/2022",
        "conduta": "Corte vedado. Poda somente com autorização.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "CITES — Conv. Washington",
            "artigo": "Apêndice I",
            "texto": "Proibição de comércio internacional da espécie."
          },
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Espécie ameaçada de extinção."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "aroeira",
        "nome_popular": "Aroeira",
        "nome_cientifico": "Astronium urundeuva",
        "aliases": [
          "aroeira-do-sertao",
          "aroeira do sertão",
          "urundeuva"
        ],
        "status": "imune",
        "esfera": "federal",
        "referencia": "Lei 5.197/1967 · Lei 12.651/2012",
        "conduta": "Imune de corte. Poda só com autorização do órgão ambiental.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012 (Código Florestal)",
            "artigo": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "ipe_amarelo",
        "nome_popular": "Ipê-amarelo",
        "nome_cientifico": "Handroanthus albus",
        "aliases": [
          "ipe amarelo",
          "ipê",
          "ipe",
          "tabebuia"
        ],
        "status": "protegida",
        "esfera": "municipal",
        "referencia": "Lei Municipal São Luís 7.811/2026 · Lei 5.197/1967",
        "conduta": "Corte/poda somente com autorização da Prefeitura/Impur e órgão ambiental.",
        "artigos": [
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Constituição Federal/1988",
            "artigo": "Art. 225",
            "texto": "Dever de defender e preservar o meio ambiente ecologicamente equilibrado."
          }
        ]
      },
      {
        "id": "ipe_roxo",
        "nome_popular": "Ipê-roxo",
        "nome_cientifico": "Handroanthus impetiginosus",
        "aliases": [
          "ipe roxo",
          "ipê-rosa",
          "ipe rosa"
        ],
        "status": "protegida",
        "esfera": "municipal",
        "referencia": "Lei Municipal São Luís 7.811/2026 · Lei 5.197/1967",
        "conduta": "Corte/poda somente com autorização do órgão ambiental municipal.",
        "artigos": [
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Constituição Federal/1988",
            "artigo": "Art. 225",
            "texto": "Dever de defender e preservar o meio ambiente ecologicamente equilibrado."
          }
        ]
      },
      {
        "id": "jatoba",
        "nome_popular": "Jatobá",
        "nome_cientifico": "Hymenaea courbaril",
        "aliases": [
          "jatoba",
          "jetaí"
        ],
        "status": "protegida",
        "esfera": "estadual",
        "referencia": "Lei 12.651/2012 · Lei Municipal São Luís 7.811/2026",
        "conduta": "Avaliar autorização ambiental antes de corte ou poda drástica.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012 (Código Florestal)",
            "artigo": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Constituição Federal/1988",
            "artigo": "Art. 225",
            "texto": "Dever de defender e preservar o meio ambiente ecologicamente equilibrado."
          }
        ]
      },
      {
        "id": "gameleira",
        "nome_popular": "Gameleira",
        "nome_cientifico": "Ficus microcarpa",
        "aliases": [
          "figueira",
          "gameleira-branca",
          "ficus"
        ],
        "status": "tombada",
        "esfera": "estadual",
        "referencia": "Decreto MA 11.593/1990 · Lei MA 3.999/1978",
        "conduta": "Exemplares tombados em São Luís: corte vedado. Confirmar no SPPHAP/Impur.",
        "artigos": [
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Capítulo único",
            "texto": "Tombamento de árvores raras e reserva biológica em São Luís — imunes ao corte."
          },
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Item FICUS",
            "texto": "Tombamento — Av. Beira-Mar, Praça Deodoro e Praça Odorico Mendes (São Luís)."
          },
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 3.999/1978",
            "artigo": "Art. 1º e Art. 3º",
            "texto": "Proteção do patrimônio histórico, artístico e paisagístico do Maranhão."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          }
        ]
      },
      {
        "id": "mangueira_tombada",
        "nome_popular": "Mangueira",
        "nome_cientifico": "Mangifera indica",
        "aliases": [
          "manga",
          "mangueira"
        ],
        "status": "protegida",
        "esfera": "municipal",
        "referencia": "Lei Municipal São Luís 7.811/2026",
        "conduta": "Verificar tombamento no cadastro municipal. Sem tombamento: poda/corte conforme risco.",
        "artigos": [
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          }
        ]
      },
      {
        "id": "oiti",
        "nome_popular": "Oiti",
        "nome_cientifico": "Licania tomentosa",
        "aliases": [
          "oitizeiro"
        ],
        "status": "tombada",
        "esfera": "estadual",
        "referencia": "Decreto MA 11.593/1990 · Lei Municipal São Luís 7.811/2026",
        "conduta": "Exemplares tombados (Praça Deodoro e Praça João Lisboa): corte vedado.",
        "artigos": [
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Capítulo único",
            "texto": "Tombamento de árvores raras e reserva biológica em São Luís — imunes ao corte."
          },
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Item OITI",
            "texto": "Tombamento — Praça Deodoro e Praça João Lisboa (São Luís)."
          },
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 3.999/1978",
            "artigo": "Art. 1º e Art. 3º",
            "texto": "Proteção do patrimônio histórico, artístico e paisagístico do Maranhão."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          }
        ]
      },
      {
        "id": "sibipiruna",
        "nome_popular": "Sibipiruna",
        "nome_cientifico": "Cenostigma pluviosum",
        "aliases": [
          "caesalpinia pluviosa"
        ],
        "status": "protegida",
        "esfera": "municipal",
        "referencia": "Lei Municipal São Luís 7.811/2026",
        "conduta": "Corte/poda com autorização municipal (Impur), salvo risco iminente documentado.",
        "artigos": [
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          }
        ]
      },
      {
        "id": "buriti",
        "nome_popular": "Buriti",
        "nome_cientifico": "Mauritia flexuosa",
        "aliases": [
          "miriti"
        ],
        "status": "tombada",
        "esfera": "estadual",
        "referencia": "Decreto MA 11.593/1990 · Lei 12.651/2012",
        "conduta": "Buritizal tombado (Maracanã/BR-135): corte vedado. Demais: autorização ambiental.",
        "artigos": [
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Capítulo único",
            "texto": "Tombamento de árvores raras e reserva biológica em São Luís — imunes ao corte."
          },
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Item BURITIS",
            "texto": "Reserva biológica — Maracanã, BR-135, ~180 ha (São Luís)."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012 (Código Florestal)",
            "artigo": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012",
            "artigo": "Art. 4º, inc. III",
            "texto": "APP em áreas de restinga, mangue, brejo ou vereda."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "babacu",
        "nome_popular": "Babaçu",
        "nome_cientifico": "Attalea speciosa",
        "aliases": [
          "babacu",
          "coco-babaçu"
        ],
        "status": "protegida",
        "esfera": "estadual",
        "referencia": "Lei MA 4.734/1986 · Lei MA 7.824/2003",
        "conduta": "Derrubada proibida no MA. Corte restrito — observar extrativismo das quebradeiras.",
        "artigos": [
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 4.734/1986",
            "artigo": "Art. 1º",
            "texto": "Proíbe a derrubada de palmeiras de babaçu no Estado do Maranhão."
          },
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 7.824/2003",
            "artigo": "Art. 1º",
            "texto": "Garante o extrativismo familiar do babaçu e reforça a proteção da palmeira."
          },
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 7.824/2003",
            "artigo": "Art. 2º",
            "texto": "Assegura acesso ao babaçu em áreas públicas e privadas para extrativismo familiar."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "carnauba",
        "nome_popular": "Carnaúba",
        "nome_cientifico": "Copernicia prunifera",
        "aliases": [
          "carnauba"
        ],
        "status": "protegida",
        "esfera": "estadual",
        "referencia": "Lei 12.651/2012 · Lei Municipal São Luís 7.811/2026",
        "conduta": "Corte somente com autorização ambiental estadual/municipal.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012 (Código Florestal)",
            "artigo": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Constituição Federal/1988",
            "artigo": "Art. 225",
            "texto": "Dever de defender e preservar o meio ambiente ecologicamente equilibrado."
          }
        ]
      },
      {
        "id": "palmeira_imperial",
        "nome_popular": "Palmeira-imperial",
        "nome_cientifico": "Roystonea oleracea",
        "aliases": [
          "palmeira imperial",
          "imperial"
        ],
        "status": "tombada",
        "esfera": "estadual",
        "referencia": "Decreto MA 11.593/1990 · Lei MA 3.999/1978",
        "conduta": "Exemplares tombados em praças históricas: corte vedado.",
        "artigos": [
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Capítulo único",
            "texto": "Tombamento de árvores raras e reserva biológica em São Luís — imunes ao corte."
          },
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Item PALMEIRA IMPERIAL",
            "texto": "Tombamento — Praça Gonçalves Dias, Praça Benedito Leite e Palácio dos Leões."
          },
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 3.999/1978",
            "artigo": "Art. 1º e Art. 3º",
            "texto": "Proteção do patrimônio histórico, artístico e paisagístico do Maranhão."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          }
        ]
      },
      {
        "id": "baoba",
        "nome_popular": "Baobá",
        "nome_cientifico": "Adansonia digitata",
        "aliases": [
          "baoba"
        ],
        "status": "tombada",
        "esfera": "municipal",
        "referencia": "Lei Municipal São Luís 7.811/2026 · Lei MA 3.999/1978",
        "conduta": "Árvore notável — verificar tombamento municipal/estadual. Corte vedado se tombada.",
        "artigos": [
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 3.999/1978",
            "artigo": "Art. 1º e Art. 3º",
            "texto": "Proteção do patrimônio histórico, artístico e paisagístico do Maranhão."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          }
        ]
      },
      {
        "id": "peroba",
        "nome_popular": "Peroba",
        "nome_cientifico": "Aspidosperma polyneuron",
        "aliases": [
          "peroba-rosa"
        ],
        "status": "ameacada",
        "esfera": "federal",
        "referencia": "Portaria MMA 148/2022 · Lei 5.197/1967",
        "conduta": "Corte vedado. Poda somente com autorização.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Espécie ameaçada de extinção."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "brauna",
        "nome_popular": "Braúna",
        "nome_cientifico": "Melanoxylon brauna",
        "aliases": [
          "brauna"
        ],
        "status": "ameacada",
        "esfera": "federal",
        "referencia": "Portaria MMA 148/2022 · Lei 5.197/1967",
        "conduta": "Corte vedado sem autorização ambiental.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Espécie ameaçada de extinção."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 3º",
            "texto": "Proíbe comercialização, posse e transporte de espécies protegidas sem autorização."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "samauma",
        "nome_popular": "Samaúma",
        "nome_cientifico": "Ceiba pentandra",
        "aliases": [
          "sumauma",
          "samauma",
          "sumaúma",
          "barrigudeira"
        ],
        "status": "tombada",
        "esfera": "estadual",
        "referencia": "Decreto MA 11.593/1990 · Lei MA 3.999/1978",
        "conduta": "Exemplares tombados (Centro, Bom Menino, Monte Castelo, Av. Newton Belo): corte vedado.",
        "artigos": [
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Capítulo único",
            "texto": "Tombamento de árvores raras e reserva biológica em São Luís — imunes ao corte."
          },
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Item SUMAÚMA",
            "texto": "Tombamento — Centro, Parque do Bom Menino, Monte Castelo e Av. Newton Belo."
          },
          {
            "esfera": "estadual",
            "norma": "Lei Estadual MA nº 3.999/1978",
            "artigo": "Art. 1º e Art. 3º",
            "texto": "Proteção do patrimônio histórico, artístico e paisagístico do Maranhão."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          }
        ]
      },
      {
        "id": "andiroba",
        "nome_popular": "Andiroba",
        "nome_cientifico": "Carapa guianensis",
        "aliases": [],
        "status": "protegida",
        "esfera": "estadual",
        "referencia": "Lei 12.651/2012 · Lei Municipal São Luís 7.811/2026",
        "conduta": "Corte somente com autorização ambiental.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012 (Código Florestal)",
            "artigo": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "cumaru",
        "nome_popular": "Cumaru",
        "nome_cientifico": "Dipteryx odorata",
        "aliases": [
          "cumaru-ferro"
        ],
        "status": "protegida",
        "esfera": "federal",
        "referencia": "Lei 5.197/1967 · Lei 12.651/2012",
        "conduta": "Corte somente com autorização ambiental.",
        "artigos": [
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 12.651/2012 (Código Florestal)",
            "artigo": "Art. 7º",
            "texto": "Veda corte ou supressão de vegetação nativa sem autorização do órgão competente."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 9.605/1998",
            "artigo": "Art. 49",
            "texto": "Crime destruir ou danificar floresta nativa ou plantada, sem autorização legal."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      },
      {
        "id": "embauba",
        "nome_popular": "Embaúba",
        "nome_cientifico": "Cecropia sp.",
        "aliases": [
          "embauba",
          "imbaúba"
        ],
        "status": "protegida",
        "esfera": "municipal",
        "referencia": "Lei Municipal São Luís 7.811/2026",
        "conduta": "Sem imunidade federal. Corte/poda conforme risco e autorização municipal.",
        "artigos": [
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 1º",
            "texto": "Institui a Política Municipal de Arborização de São Luís."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 6º",
            "texto": "Objetivos: proteção, conservação, manejo e expansão da arborização urbana."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          },
          {
            "esfera": "federal",
            "norma": "Constituição Federal/1988",
            "artigo": "Art. 225",
            "texto": "Dever de defender e preservar o meio ambiente ecologicamente equilibrado."
          }
        ]
      },
      {
        "id": "jucara",
        "nome_popular": "Juçara",
        "nome_cientifico": "Euterpe edulis",
        "aliases": [
          "jucara",
          "açaí-do-sul"
        ],
        "status": "tombada",
        "esfera": "estadual",
        "referencia": "Decreto MA 11.593/1990 · Portaria MMA 148/2022",
        "conduta": "Juçarais tombados (Maracanã/BR-135): corte vedado. Espécie também ameaçada federalmente.",
        "artigos": [
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Capítulo único",
            "texto": "Tombamento de árvores raras e reserva biológica em São Luís — imunes ao corte."
          },
          {
            "esfera": "estadual",
            "norma": "Decreto Estadual MA nº 11.593/1990",
            "artigo": "Item JUÇARAIS",
            "texto": "Reserva biológica — Maracanã, BR-135 (São Luís)."
          },
          {
            "esfera": "federal",
            "norma": "Portaria MMA nº 148/2022",
            "artigo": "Anexo I",
            "texto": "Espécie ameaçada de extinção."
          },
          {
            "esfera": "federal",
            "norma": "Lei nº 5.197/1967",
            "artigo": "Art. 2º",
            "texto": "Veda ações que coloquem em risco a conservação da fauna e da flora."
          },
          {
            "esfera": "municipal",
            "municipio": "São Luís",
            "norma": "Lei Municipal São Luís nº 7.811/2026",
            "artigo": "Art. 7º",
            "texto": "Diretrizes de proteção, poda, plantio e gestão integrada do verde urbano."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Municipal Paço do Lumiar nº 335/2006 (Plano Diretor)",
            "artigo": "Art. 7º",
            "texto": "Ações prioritárias de preservação ambiental e das áreas verdes no município."
          },
          {
            "esfera": "municipal",
            "municipio": "Paço do Lumiar",
            "norma": "Lei Complementar Paço do Lumiar nº 001/2013 (Código de Posturas)",
            "artigo": "Art. 1º",
            "texto": "Compete ao Município zelar pela manutenção da cidade e pelo ambiente urbano sustentável."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 28",
            "texto": "Preservar árvores de porte médio e grande; corte somente com justificativa e compensação aprovada pela SEMMAM."
          },
          {
            "esfera": "municipal",
            "municipio": "São José de Ribamar",
            "norma": "Lei de Zoneamento e Uso do Solo — São José de Ribamar/MA",
            "artigo": "Art. 37",
            "texto": "Arborização de calçadas e execução de projetos paisagísticos conforme diretrizes municipais."
          },
          {
            "esfera": "municipal",
            "municipio": "Raposa",
            "norma": "Lei Municipal Raposa nº 113/2006 (Plano Diretor)",
            "artigo": "Política de desenvolvimento urbano",
            "texto": "Diretrizes de ordenamento territorial e preservação ambiental no município de Raposa/MA."
          }
        ]
      }
    ]
  }
];
