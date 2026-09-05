/* Gerado por scripts/exportar_questionario_js.py — nao editar manualmente */
const QUESTIONARIO = {
  "limiares_risco": {
    "alto": {
      "min": 42,
      "max": 54
    },
    "medio": {
      "min": 23,
      "max": 41
    },
    "baixo": {
      "min": 0,
      "max": 22
    }
  },
  "secoes": [
    {
      "id": "impeditivos",
      "titulo": "2. Fatores impeditivos para supressão",
      "subtitulo": "Não entram na contagem de risco (seção 2).",
      "conta_risco": false,
      "perguntas": [
        {
          "id": "q_2_1",
          "numero": "2.1",
          "texto": "A árvore está presente dentro de APP, Reserva Legal, Unidade de Conservação ou outra área protegida?"
        },
        {
          "id": "q_2_2",
          "numero": "2.2",
          "texto": "A árvore está em área urbana pública?"
        },
        {
          "id": "q_2_3",
          "numero": "2.3",
          "texto": "A árvore está em via pública ou praças públicas?"
        },
        {
          "id": "q_2_4",
          "numero": "2.4",
          "texto": "A árvore está em propriedade particular?"
        },
        {
          "id": "q_2_5",
          "numero": "2.5",
          "texto": "A árvore está nas dependências de empresas?"
        },
        {
          "id": "q_2_6",
          "numero": "2.6",
          "texto": "A árvore pertence à espécie imune de corte ou ameaçada de extinção?"
        },
        {
          "id": "q_2_7",
          "numero": "2.7",
          "texto": "O solicitante tem autorização dos órgãos ambientais para supressão do indivíduo arbóreo?"
        },
        {
          "id": "q_2_8",
          "numero": "2.8",
          "texto": "Existe rede elétrica energizada em contato com a árvore e/ou em árvores adjacentes?"
        }
      ]
    },
    {
      "id": "avaliacao_geral",
      "titulo": "3. Avaliação geral — Nível I",
      "conta_risco": true,
      "perguntas": [
        {
          "id": "q_3_1",
          "numero": "3.1",
          "texto": "A árvore aparenta estar saudável? (observar a fenologia)",
          "contagem_invertida": true
        },
        {
          "id": "q_3_2",
          "numero": "3.2",
          "texto": "A árvore está morta ou em declínio?"
        },
        {
          "id": "q_3_3",
          "numero": "3.3",
          "texto": "A árvore apresenta anel de malpighi?",
          "alerta": "Denunciar à delegacia de crimes ambientais."
        },
        {
          "id": "q_3_4",
          "numero": "3.4",
          "texto": "Há evidências de crimes ambientais? (erosão e queima no caule)"
        },
        {
          "id": "q_3_5",
          "numero": "3.5",
          "texto": "Há galhos grandes e mortos na árvore?"
        },
        {
          "id": "q_3_6",
          "numero": "3.6",
          "texto": "Há galhos quebrados e dependurados na copa da árvore?"
        },
        {
          "id": "q_3_7",
          "numero": "3.7",
          "texto": "Há registro de queda de galhos?"
        },
        {
          "id": "q_3_8",
          "numero": "3.8",
          "texto": "As árvores ao redor caíram ou morreram?"
        },
        {
          "id": "q_3_9",
          "numero": "3.9",
          "texto": "O tronco desenvolveu inclinação acentuada?"
        },
        {
          "id": "q_3_10",
          "numero": "3.10",
          "texto": "A maioria dos galhos estruturais se originam a partir de um único ponto do tronco?"
        },
        {
          "id": "q_3_11",
          "numero": "3.11",
          "texto": "As árvores em regiões florestadas adjacentes foram removidas?"
        },
        {
          "id": "q_3_12",
          "numero": "3.12",
          "texto": "Há fungos (orelha de pau) na base da árvore?"
        }
      ]
    },
    {
      "id": "avaliacao_estrutura",
      "titulo": "4. Avaliação da estrutura — Níveis II e III",
      "conta_risco": true,
      "grupos": [
        {
          "titulo": "Avaliação do entorno (visual externa)",
          "perguntas": [
            {
              "id": "q_4_1",
              "numero": "4.1",
              "texto": "Há área permeável útil na base da árvore?",
              "contagem_invertida": true
            },
            {
              "id": "q_4_2",
              "numero": "4.2",
              "texto": "O solo está inclinado ou a árvore está em solo inclinado?"
            },
            {
              "id": "q_4_3",
              "numero": "4.3",
              "texto": "Há possibilidade de infiltração de água no solo?"
            },
            {
              "id": "q_4_4",
              "numero": "4.4",
              "texto": "O solo está pavimentado? (apresentando rachadura)"
            },
            {
              "id": "q_4_5",
              "numero": "4.5",
              "texto": "O solo está estável?",
              "contagem_invertida": true
            },
            {
              "id": "q_4_6",
              "numero": "4.6",
              "texto": "Há registros de ventos fortes no local da árvore?"
            },
            {
              "id": "q_4_7",
              "numero": "4.7",
              "texto": "Há registro de fortes chuvas no local da árvore?"
            },
            {
              "id": "q_4_8",
              "numero": "4.8",
              "texto": "Há registro histórico de outras árvores que caíram no entorno?"
            },
            {
              "id": "q_4_9",
              "numero": "4.9",
              "texto": "Há evidências de que a área foi reformada recentemente?"
            },
            {
              "id": "q_4_10",
              "numero": "4.10",
              "texto": "Há registros de movimentação de massa de terra no local?"
            },
            {
              "id": "q_4_11",
              "numero": "4.11",
              "texto": "A área é alagada?"
            },
            {
              "id": "q_4_12",
              "numero": "4.12",
              "texto": "Há alteração na ocupação do solo?"
            },
            {
              "id": "q_4_13",
              "numero": "4.13",
              "texto": "O local foi alterado por construções ou implantação de gramado, elevando o nível do solo?"
            }
          ]
        },
        {
          "titulo": "Sistema radicular visível",
          "perguntas": [
            {
              "id": "q_4_14",
              "numero": "4.14",
              "texto": "Raízes partidas, danificadas ou lesionadas por pavimentação, calçadas ou valas?"
            },
            {
              "id": "q_4_15",
              "numero": "4.15",
              "texto": "Há espaço disponível para o sistema radicular em relação ao porte da árvore?",
              "contagem_invertida": true
            },
            {
              "id": "q_4_16",
              "numero": "4.16",
              "texto": "Há raízes dobradas e/ou enoveladas?"
            },
            {
              "id": "q_4_17",
              "numero": "4.17",
              "texto": "Há podas ou apodrecimento de raízes significativas para a sustentação?"
            },
            {
              "id": "q_4_18",
              "numero": "4.18",
              "texto": "Há exposição de raízes por erosão ou compactação de solo?"
            }
          ]
        },
        {
          "titulo": "Colo da árvore",
          "perguntas": [
            {
              "id": "q_4_19",
              "numero": "4.19",
              "texto": "O colo da árvore está soterrado?"
            },
            {
              "id": "q_4_20",
              "numero": "4.20",
              "texto": "Há rachaduras longitudinais ou transversais no colo?"
            },
            {
              "id": "q_4_21",
              "numero": "4.21",
              "texto": "Há injúrias ou cancros com rachaduras ou biodeterioração no colo?"
            },
            {
              "id": "q_4_22",
              "numero": "4.22",
              "texto": "Há cavidades no colo da árvore?"
            }
          ]
        },
        {
          "titulo": "Tronco da árvore",
          "perguntas": [
            {
              "id": "q_4_23",
              "numero": "4.23",
              "texto": "Há rachaduras longitudinais ou transversais no tronco?"
            },
            {
              "id": "q_4_24",
              "numero": "4.24",
              "texto": "Há partes quebradas no tronco?"
            },
            {
              "id": "q_4_25",
              "numero": "4.25",
              "texto": "Há partes quebradas no ponto de inserção de galhos?"
            },
            {
              "id": "q_4_26",
              "numero": "4.26",
              "texto": "Há cavidades ou madeira apodrecida no tronco ou galhos maiores?"
            },
            {
              "id": "q_4_27",
              "numero": "4.27",
              "texto": "O tronco apresenta inclinação? (pouca inclinação)"
            },
            {
              "id": "q_4_28",
              "numero": "4.28",
              "texto": "O tronco apresenta injúrias ou cancros com biodeterioração?"
            }
          ]
        },
        {
          "titulo": "Copa da árvore",
          "perguntas": [
            {
              "id": "q_4_29",
              "numero": "4.29",
              "texto": "A árvore foi destopada ou ocorreu poda intensa?"
            },
            {
              "id": "q_4_30",
              "numero": "4.30",
              "texto": "A copa está visivelmente em desequilíbrio?"
            },
            {
              "id": "q_4_31",
              "numero": "4.31",
              "texto": "Folhas com coloração ou tamanho incomum prematuramente?"
            },
            {
              "id": "q_4_32",
              "numero": "4.32",
              "texto": "Há galhos morrendo ou mortos?"
            },
            {
              "id": "q_4_33",
              "numero": "4.33",
              "texto": "Existem galhos originados de um único ponto do tronco?"
            },
            {
              "id": "q_4_34",
              "numero": "4.34",
              "texto": "Há galhos quebrados, partidos ou parcialmente presos à copa?"
            },
            {
              "id": "q_4_35",
              "numero": "4.35",
              "texto": "Há rebrota de destopo, desobstrução de redes ou outra poda?"
            },
            {
              "id": "q_4_36",
              "numero": "4.36",
              "texto": "Há casca inclusa?"
            },
            {
              "id": "q_4_37",
              "numero": "4.37",
              "texto": "Há galhos com ferimentos, apodrecimento ou desrama natural?"
            },
            {
              "id": "q_4_38",
              "numero": "4.38",
              "texto": "Há galhos pendentes? (diâmetro x comprimento desfavorável)"
            },
            {
              "id": "q_4_39",
              "numero": "4.39",
              "texto": "Há primeira ramificação baixa em relação à altura total?"
            },
            {
              "id": "q_4_40",
              "numero": "4.40",
              "texto": "Há ramos epicórmicos?"
            },
            {
              "id": "q_4_41",
              "numero": "4.41",
              "texto": "Há forquilhas com biodeterioração?"
            },
            {
              "id": "q_4_42",
              "numero": "4.42",
              "texto": "Há podas de grandes galhos com biodeterioração?"
            }
          ]
        }
      ]
    },
    {
      "id": "acoes_guarnicao",
      "titulo": "5. Ações tomadas pela guarnição",
      "conta_risco": false,
      "perguntas": [
        {
          "id": "q_5_1",
          "numero": "5.1",
          "texto": "Realizou-se a supressão total ou poda emergencial da árvore?"
        },
        {
          "id": "q_5_2",
          "numero": "5.2",
          "texto": "Houve orientação ao solicitante sobre corte privado e autorização ambiental?"
        }
      ]
    }
  ],
  "orientacoes": {
    "titulo_somatorio": "6. Resultado da avaliação de risco",
    "tabela_niveis": [
      {
        "nivel": "ALTO",
        "faixa": "42 a 54",
        "descricao": "Alto risco potencial de queda"
      },
      {
        "nivel": "MÉDIO",
        "faixa": "23 a 41",
        "descricao": "Médio risco potencial de queda"
      },
      {
        "nivel": "BAIXO",
        "faixa": "0 a 22",
        "descricao": "Baixo risco potencial de queda"
      }
    ],
    "conduta_gu": {
      "alto": [
        "Identificado ALTO risco potencial de queda e risco iminente de queda.",
        "A Guarnição de Urgência (GU) deverá realizar a supressão total ou a poda emergencial da árvore.",
        "Não há necessidade de autorização prévia dos órgãos ambientais municipais ou estaduais (exceção extrema)."
      ],
      "medio": [
        "Identificado MÉDIO risco potencial de queda — não há risco iminente de queda.",
        "A GU NÃO realizará supressão total nem poda emergencial.",
        "Orientar o solicitante: caso deseje realizar o corte, deve solicitar autorização dos órgãos ambientais municipal ou estadual para corte privado."
      ],
      "baixo": [
        "Identificado BAIXO risco potencial de queda — não há risco iminente de queda.",
        "A GU NÃO realizará supressão total nem poda emergencial.",
        "Orientar o solicitante: caso deseje realizar o corte, deve solicitar autorização dos órgãos ambientais municipal ou estadual para corte privado."
      ]
    },
    "impeditivos": {
      "q_2_4": "Item 2.4 (propriedade particular): responsabilidade do proprietário; deve apresentar autorização para supressão total.",
      "q_2_5": "Item 2.5 (dependências de empresas): responsabilidade da empresa; deve apresentar autorização para supressão total."
    },
    "alertas": {
      "q_3_3": "Item 3.3 (anel de Malpighi): realizar denúncia à delegacia de crimes ambientais."
    },
    "poda_nao_iminente": "Sem risco iminente de queda, mas com galhos/frutos que possam cair naturalmente: podas emergenciais podem ser realizadas pelo solicitante, que deve providenciar os meios necessários e obter autorização do órgão ambiental municipal ou estadual."
  }
};
const NIVEL_KEY = { ALTO: "alto", "MÉDIO": "medio", BAIXO: "baixo" };

function getPerguntasSecao(secaoId) {
  const secao = QUESTIONARIO.secoes.find((s) => s.id === secaoId);
  if (!secao) return [];
  const out = [...(secao.perguntas || [])];
  (secao.grupos || []).forEach((g) => out.push(...g.perguntas));
  return out;
}

function contaRespostaRisco(pergunta, resposta) {
  if (pergunta.contagem_invertida) return resposta === "nao";
  return resposta === "sim";
}

function contarSimPerguntas(perguntas, respostas) {
  return perguntas.filter((p) => contaRespostaRisco(p, respostas[p.id])).length;
}

function getPerguntasRisco() {
  const out = [];
  QUESTIONARIO.secoes.forEach((secao) => {
    if (!secao.conta_risco) return;
    if (secao.perguntas) out.push(...secao.perguntas);
    (secao.grupos || []).forEach((g) => out.push(...g.perguntas));
  });
  return out;
}

function totalPerguntasRisco() {
  return getPerguntasRisco().length;
}

function faixaNivel(nivel) {
  const k = NIVEL_KEY[nivel];
  const lim = QUESTIONARIO.limiares_risco[k];
  return `${lim.min} a ${lim.max}`;
}

function alertasEImpeditivos(respostas) {
  const o = QUESTIONARIO.orientacoes || {};
  const msgs = [];
  Object.entries(o.impeditivos || {}).forEach(([qid, txt]) => {
    if (respostas[qid] === "sim") msgs.push(txt);
  });
  Object.entries(o.alertas || {}).forEach(([qid, txt]) => {
    if (respostas[qid] === "sim") msgs.push(txt);
  });
  return msgs;
}

function orientacaoConduta(nivel, respostas) {
  const o = QUESTIONARIO.orientacoes || {};
  const conduta = [...(o.conduta_gu?.[NIVEL_KEY[nivel]] || [])];
  if ((nivel === "BAIXO" || nivel === "MÉDIO") && o.poda_nao_iminente) {
    conduta.push(o.poda_nao_iminente);
  }
  return conduta.concat(alertasEImpeditivos(respostas));
}

function calcularResultadoQuestionario(respostas) {
  const maxSim = totalPerguntasRisco();
  const simCount = contarSimPerguntas(getPerguntasRisco(), respostas);
  const lim = QUESTIONARIO.limiares_risco;
  let nivel = "BAIXO";
  if (simCount >= lim.alto.min) nivel = "ALTO";
  else if (simCount >= lim.medio.min) nivel = "MÉDIO";

  const p3 = getPerguntasSecao("avaliacao_geral");
  const p4 = getPerguntasSecao("avaliacao_estrutura");
  const somatorio = {
    secao_3_sim: contarSimPerguntas(p3, respostas),
    secao_3_total: p3.length,
    secao_4_sim: contarSimPerguntas(p4, respostas),
    secao_4_total: p4.length,
    total_3_4_sim: simCount,
    total_3_4_max: maxSim,
    nivel,
    faixa: faixaNivel(nivel),
    tabela_niveis: QUESTIONARIO.orientacoes?.tabela_niveis || [],
  };

  return {
    pontuacao_total: simCount,
    pontuacao_maxima: maxSim,
    recomendacao: nivel,
    nivel_risco: nivel,
    justificativa: `Conforme parâmetros do relatório SEI, obtiveram-se ${simCount} indicador(es) de risco nos itens 3 e 4 (máximo ${maxSim}), classificando a árvore com ${nivel} risco potencial de queda (faixa ${faixaNivel(nivel)}).`,
    supressao_recomendada: nivel === "ALTO",
    somatorio,
    orientacao_conduta: orientacaoConduta(nivel, respostas),
  };
}

function renderSomatorioHtml(resultado) {
  if (!resultado?.somatorio) return "";
  const s = resultado.somatorio;
  const tabela = (s.tabela_niveis || [])
    .map(
      (l) => `<tr class="${l.nivel === s.nivel ? "somatorio-linha-ativa" : ""}">
        <td><strong>${l.nivel}</strong><br><small>${l.descricao}</small></td>
        <td>${l.faixa}</td></tr>`
    )
    .join("");
  const conduta = (resultado.orientacao_conduta || [])
    .map((i) => `<li>${i}</li>`)
    .join("");
  return `<div class="somatorio-card">
    <h3>6. Resultado da avaliação de risco</h3>
    <table class="somatorio-tabela"><thead><tr><th>Nível</th><th>Indicadores de risco (itens 3 e 4)</th></tr></thead><tbody>${tabela}</tbody></table>
    <dl class="somatorio-resumo detail-list">
      <dt>Item 3 (Nível I)</dt><dd>${s.secao_3_sim} / ${s.secao_3_total}</dd>
      <dt>Item 4 (Níveis II e III)</dt><dd>${s.secao_4_sim} / ${s.secao_4_total}</dd>
      <dt>Total itens 3 e 4</dt><dd><strong>${s.total_3_4_sim}</strong> / ${s.total_3_4_max}</dd>
      <dt>Classificação</dt><dd><strong>${s.nivel}</strong> (faixa ${s.faixa})</dd>
    </dl>
    ${conduta ? `<div class="orientacao-conduta"><h4>O que deve ser feito</h4><ul>${conduta}</ul></div>` : ""}
  </div>`;
}

function renderSimNao(pergunta) {
  const alerta = pergunta.alerta
    ? `<small class="pergunta-alerta">⚠️ ${pergunta.alerta}</small>`
    : "";
  const invertida = pergunta.contagem_invertida
    ? `<small class="hint pergunta-invertida">SIM = condição favorável (não soma risco). NÃO soma na contagem.</small>`
    : "";
  return `<div class="pergunta-card">
    <div class="pergunta-header">
      <span class="pergunta-numero">${pergunta.numero}</span>
      <p class="pergunta-texto">${pergunta.texto}</p>${alerta}${invertida}
    </div>
    <div class="sim-nao-buttons">
      <label class="sim-nao-btn"><input type="radio" name="${pergunta.id}" value="sim" required><span>Sim</span></label>
      <label class="sim-nao-btn"><input type="radio" name="${pergunta.id}" value="nao" checked><span>Não</span></label>
    </div>
  </div>`;
}

function renderSecoesQuestionario() {
  return QUESTIONARIO.secoes.map((secao) => {
    let html = `<section class="form-section questionario-secao"><h3>${secao.titulo}</h3>`;
    if (secao.subtitulo) html += `<p class="hint">${secao.subtitulo}</p>`;
    if (secao.conta_risco) {
      html += `<p class="hint">Contagem de risco: respostas <strong>SIM</strong> indicam fator de risco, exceto itens 3.1, 4.1, 4.5 e 4.15 (SIM favorável — conta <strong>NÃO</strong>).</p>`;
    }
    if (secao.perguntas) html += secao.perguntas.map(renderSimNao).join("");
    (secao.grupos || []).forEach((g) => {
      html += `<h4 class="questionario-grupo">${g.titulo}</h4>`;
      html += g.perguntas.map(renderSimNao).join("");
    });
    return html + "</section>";
  }).join("");
}
