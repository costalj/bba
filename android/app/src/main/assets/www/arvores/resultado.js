function renderAssinatura(v, id) {
  if (v.assinatura) {
    const a = v.assinatura;
    return `
      <section class="info-card assinatura-card assinada">
        <h3>✅ Assinatura do Chefe de Socorro</h3>
        <div class="assinatura-digital">
          <p class="assinatura-nome">${a.assinado_por}</p>
          <p class="assinatura-cargo">${a.cargo}</p>
          <p class="assinatura-data">${a.data_hora}</p>
          <small class="assinatura-hint">${a.tipo || "Assinatura eletrônica"} registrada</small>
        </div>
      </section>`;
  }
  if (isChefeSocorro()) {
    return `
      <section class="info-card assinatura-card pendente">
        <h3>Assinatura do Chefe de Socorro</h3>
        <p class="hint">Assinatura eletrônica com seu usuário logado, data e hora.</p>
        <p class="assinatura-militar-logado">Logado como: <strong>${nomeCompletoMilitar(getUsuario())}</strong></p>
        <button type="button" id="btn-assinar" class="btn btn-primary btn-block">✍️ Assinar eletronicamente</button>
      </section>`;
  }
  if (isLogado()) {
    return `
      <section class="info-card assinatura-card pendente">
        <h3>Assinatura do Chefe de Socorro</h3>
        <p class="hint">Aguardando assinatura. Apenas o Chefe de Socorro pode assinar.</p>
        <p class="assinatura-militar-logado">Seu perfil: <strong>${getUsuario().perfil}</strong></p>
      </section>`;
  }
  return `<section class="info-card assinatura-card pendente"><h3>Assinatura do Chefe de Socorro</h3><p class="hint">Aguardando assinatura.</p></section>`;
}

function renderRubrica(v) {
  let body = `<p class="hint">Solicitante não rubricou este laudo.</p>`;
  if (v.rubrica && v.rubrica.imagem) {
    body = `<p class="hint">${v.rubrica.nome || ""}${v.rubrica.data_hora ? " · " + v.rubrica.data_hora : ""}</p>
      <img src="${v.rubrica.imagem}" alt="Rubrica" class="rubrica-imagem">`;
  }
  return `<section class="info-card assinatura-card">
    <h3>Rubrica do solicitante <small class="opcional-tag">(opcional)</small></h3>${body}</section>`;
}

function renderOrientacaoResumo(resultado) {
  if (!resultado?.orientacao_conduta?.length) return "";
  const items = resultado.orientacao_conduta.map((i) => `<li>${i}</li>`).join("");
  return `<div class="orientacao-conduta orientacao-resumo">
    <h4>O que deve ser feito com a árvore</h4><ul>${items}</ul></div>`;
}

function bindAssinar(id) {
  const btn = document.getElementById("btn-assinar");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!confirm("Confirmar assinatura eletrônica desta vistoria?")) return;
    assinarVistoria(id, getUsuario());
    location.reload();
  });
}

function classeResultado(rec) {
  if (rec === "ALTO") return "resultado-alto";
  if (rec === "MÉDIO") return "resultado-medio";
  if (rec === "BAIXO") return "resultado-baixo";
  if (rec === "SUPRESSÃO") return "resultado-supressao";
  if (rec === "INTERVENÇÃO URGENTE") return "resultado-urgente";
  if (rec === "PODAS / ACOMPANHAMENTO") return "resultado-podas";
  return "resultado-manutencao";
}

function renderRespostasSecao(secao, questionario) {
  let html = `<section class="info-card questionario-resumo"><h3>${secao.titulo}</h3>`;
  const renderLista = (perguntas) => {
    let list = '<ul class="respostas-lista">';
    perguntas.forEach((p) => {
      const val = questionario[p.id] || "nao";
      list += `<li class="resposta-item resposta-${val}">
        <span class="resposta-num">${p.numero}</span>
        <span class="resposta-texto">${p.texto}</span>
        <strong class="resposta-valor">${val === "sim" ? "SIM" : "NÃO"}</strong>
      </li>`;
    });
    return list + "</ul>";
  };
  if (secao.perguntas) html += renderLista(secao.perguntas);
  (secao.grupos || []).forEach((g) => {
    html += `<h4 class="questionario-grupo">${g.titulo}</h4>${renderLista(g.perguntas)}`;
  });
  return html + "</section>";
}

const id = new URLSearchParams(location.search).get("id");
const v = obterVistoria(id);
const el = document.getElementById("conteudo");

if (!v) {
  el.innerHTML = `<div class="empty-state"><p>Vistoria não encontrada.</p><a href="lista.html" class="btn btn-primary">Voltar</a></div>`;
} else {
  const cls = classeResultado(v.recomendacao);
  const maxPts = v.pontuacao_maxima || (v.questionario ? 54 : 18);
  const suffix = v.questionario ? " SIM" : "";
  const fotosHtml = (v.fotos || []).length
    ? `<section class="info-card"><h3>Fotos</h3><div class="fotos-galeria">${v.fotos.map((f) => `<img src="${f.data}" alt="">`).join("")}</div></section>`
    : "";

  let questionarioHtml = "";
  if (v.questionario) {
    questionarioHtml = QUESTIONARIO.secoes.map((s) => renderRespostasSecao(s, v.questionario)).join("");
  } else if (typeof CRITERIOS !== "undefined") {
    const notasHtml = CRITERIOS.map((c) =>
      `<li><span>${c.label}</span><span class="nota-valor">${(v.notas || {})[c.id] || 0}/3</span></li>`
    ).join("");
    questionarioHtml = `<section class="info-card"><h3>Notas (formato anterior)</h3><ul class="notas-lista">${notasHtml}</ul></section>`;
  }

  const resultado = v.questionario ? calcularResultadoQuestionario(v.questionario) : null;

  el.innerHTML = `
    <div class="resultado-card ${cls}">
      <div class="resultado-score"><span class="score-num">${v.pontuacao_total}</span><span class="score-max">/ ${maxPts}${suffix}</span></div>
      <h2 class="resultado-titulo">${v.recomendacao}</h2>
      ${v.recomendacao === "ALTO" ? '<p class="supressao-alerta">⚠️ Alto risco potencial de queda</p>' : ""}
      <p>${v.justificativa}</p>
      ${renderOrientacaoResumo(resultado)}
    </div>
    <div class="action-row">
      <button type="button" class="btn btn-secondary btn-block btn-acao-pdf" data-id="${v.id}">📄 Exportar PDF</button>
      <a href="lista.html" class="btn btn-secondary btn-block">📁 Ver histórico</a>
    </div>
    <section class="info-card"><h3>1. Dados da ocorrência</h3>
      <dl class="detail-list">
        <dt>Data</dt><dd>${v.created_at}</dd>
        <dt>Nº do Laudo</dt><dd>${numeroLaudoVistoria(v)}</dd>
        ${v.solicitante ? `<dt>Solicitante</dt><dd>${v.solicitante}</dd>` : ""}
        ${v.cpf_solicitante ? `<dt>CPF do Solicitante</dt><dd>${formatarCpf(v.cpf_solicitante)}</dd>` : ""}
        <dt>Endereço</dt><dd>${v.endereco}</dd>
        ${v.contato_telefonico ? `<dt>Contato</dt><dd>${formatarTelefone(v.contato_telefonico)}</dd>` : ""}
        ${v.forma_acionamento ? `<dt>Forma de Acionamento</dt><dd>${v.forma_acionamento}</dd>` : ""}
        ${v.protocolo ? `<dt>Protocolo CIOPS/Portaria/OS</dt><dd>${v.protocolo}</dd>` : ""}
        ${v.natureza_ocorrencia ? `<dt>Natureza da ocorrência</dt><dd>${v.natureza_ocorrencia}</dd>` : ""}
        ${v.descricao_ocorrencia ? `<dt>Descrição da ocorrência</dt><dd>${v.descricao_ocorrencia}</dd>` : ""}
        ${v.especie ? `<dt>Espécie</dt><dd>${v.especie}</dd>` : ""}
        ${v.resultado_especie ? `<dt>Resultado (proteção)</dt><dd>${String(v.resultado_especie).replace(/\n/g, "<br>")}</dd>` : ""}
      </dl>
    </section>
    ${v.foto_especie ? `<section class="info-card"><h3>Foto de identificação</h3><img src="${v.foto_especie}" alt="Foto espécie" class="rubrica-imagem"></section>` : ""}
    ${fotosHtml}
    ${questionarioHtml}
    ${v.observacoes ? `<section class="info-card"><h3>Observações adicionais</h3><p>${v.observacoes}</p></section>` : ""}
    ${resultado ? renderSomatorioHtml(resultado) : ""}
    ${v.recursos_adicionais ? `<section class="info-card"><h3>Recursos adicionais</h3><p>${v.recursos_adicionais}</p></section>` : ""}
    ${renderRubrica(v)}
    ${renderAssinatura(v, id)}
    <a href="nova.html" class="btn btn-secondary btn-block">Nova Vistoria</a>`;

  bindAssinar(id);
  document.querySelectorAll(".btn-acao-pdf").forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (btn.disabled) return;
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Gerando…";
      try {
        await abrirPdfVistoria(btn.dataset.id);
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  });
}
