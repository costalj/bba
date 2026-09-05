const id = new URLSearchParams(location.search).get("id");
const v = obterVistoriaViatura(id);
const el = document.getElementById("conteudo");
const totalItens = totalItensChecklistViatura();

if (!v) {
  el.innerHTML = `<div class="empty-state"><p>Vistoria não encontrada.</p><a href="lista.html" class="btn btn-primary">Voltar</a></div>`;
  throw new Error("not found");
}

function renderAssinatura() {
  if (v.assinatura) {
    const a = v.assinatura;
    return `
      <section class="info-card assinatura-card assinada">
        <h3>✅ Assinatura da vistoria</h3>
        <div class="assinatura-digital">
          <p class="assinatura-nome">${a.assinado_por}</p>
          <p class="assinatura-cargo">${a.cargo}</p>
          <p class="assinatura-data">${a.data_hora}</p>
          <small class="assinatura-hint">${a.tipo || "Assinatura eletrônica"} registrada</small>
        </div>
      </section>`;
  }
  if (podeAssinarVistoriaViatura()) {
    return `
      <section class="info-card assinatura-card pendente">
        <h3>Assinatura da vistoria</h3>
        <p class="hint">Assinatura eletrônica com seu usuário logado, data e hora.</p>
        <p class="assinatura-militar-logado">Logado como: <strong>${nomePostoGuerra(getUsuario())}</strong> (${getUsuario().perfil})</p>
        <button type="button" id="btn-assinar" class="btn btn-primary btn-block">✍️ Assinar eletronicamente</button>
      </section>`;
  }
  if (isLogado()) {
    return `
      <section class="info-card assinatura-card pendente">
        <h3>Assinatura da vistoria</h3>
        <p class="hint">Aguardando assinatura. Apenas Condutor de viatura, Chefe de Socorro ou Comandante de guarnição podem assinar.</p>
        <p class="assinatura-militar-logado">Seu perfil: <strong>${getUsuario().perfil}</strong></p>
      </section>`;
  }
  return `<section class="info-card assinatura-card pendente"><h3>Assinatura da vistoria</h3><p class="hint">Aguardando assinatura.</p></section>`;
}

function renderChecklistResumo() {
  const checklist = v.checklist || {};
  return CHECKLIST_VIATURA_SECOES.map((secao) => {
    const itens = secao.perguntas
      .map((p) => {
        const val = checklist[p.id] || "nao";
        return `<li class="resposta-item resposta-${val}">
          <span class="resposta-num">${p.numero}</span>
          <span class="resposta-texto">${p.texto}</span>
          <strong class="resposta-valor">${val === "sim" ? "SIM" : "NÃO"}</strong>
        </li>`;
      })
      .join("");
    return `<section class="info-card questionario-resumo"><h3>${secao.titulo}</h3><ul class="respostas-lista">${itens}</ul></section>`;
  }).join("");
}

const cls = classeResultadoViaturaCard(v.recomendacao);

el.innerHTML = `
  <div class="resultado-card ${cls}">
    <div class="resultado-score">
      <span class="score-num">${v.pontuacao_total}</span>
      <span class="score-max">/ ${totalItens} não conformes</span>
    </div>
    <h2 class="resultado-titulo">${v.recomendacao}</h2>
    <p>${v.justificativa || ""}</p>
  </div>
  <div class="action-row">
    <button type="button" id="btn-pdf-viatura" class="btn btn-secondary btn-block">📄 Exportar PDF</button>
    <a href="lista.html" class="btn btn-secondary btn-block">📁 Ver histórico</a>
  </div>
  <section class="info-card">
    <h3>Identificação</h3>
    <dl class="detail-list">
      <dt>Data</dt><dd>${formatarDataHoraBr(v.created_at)}</dd>
      <dt>Condutor</dt><dd>${v.condutor || "—"}</dd>
      <dt>Viatura</dt><dd>${textoViatura(v)}</dd>
      <dt>Status</dt><dd>${statusViatura(v)}</dd>
    </dl>
  </section>
  ${renderChecklistResumo()}
  ${v.observacoes ? `<section class="info-card"><h3>Observações</h3><p>${v.observacoes}</p></section>` : ""}
  ${renderAssinatura()}
  <a href="nova.html" class="btn btn-secondary btn-block">Nova Vistoria</a>`;

const btnAssinar = document.getElementById("btn-assinar");
if (btnAssinar) {
  btnAssinar.addEventListener("click", () => {
    if (!confirm("Confirmar assinatura eletrônica nesta vistoria?")) return;
    assinarVistoriaViatura(id, getUsuario());
    location.reload();
  });
}

const btnPdf = document.getElementById("btn-pdf-viatura");
if (btnPdf) {
  btnPdf.addEventListener("click", () => abrirPdfViatura(id));
}
