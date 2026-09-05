"""Exporta questionario_arvores.yaml para questionario.js (web e APK)."""
import json
import os

import yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
YAML_PATH = os.path.join(ROOT, "questionario_arvores.yaml")
OUT_WEB = os.path.join(ROOT, "app", "static", "js", "questionario.js")
OUT_APK = os.path.join(
    ROOT, "android", "app", "src", "main", "assets", "www", "js", "questionario.js"
)

LOGICA_JS = r"""
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
"""


def exportar():
    with open(YAML_PATH, encoding="utf-8") as f:
        data = yaml.safe_load(f)
    payload = json.dumps(data, ensure_ascii=False, indent=2)
    conteudo = (
        "/* Gerado por scripts/exportar_questionario_js.py — nao editar manualmente */\n"
        f"const QUESTIONARIO = {payload};\n"
        f"{LOGICA_JS.strip()}\n"
    )
    for destino in (OUT_WEB, OUT_APK):
        os.makedirs(os.path.dirname(destino), exist_ok=True)
        with open(destino, "w", encoding="utf-8", newline="\n") as f:
            f.write(conteudo)
        print(f"Questionario exportado: {destino}")


if __name__ == "__main__":
    exportar()
