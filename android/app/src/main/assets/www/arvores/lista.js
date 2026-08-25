const params = new URLSearchParams(location.search);
const salvaId = params.get("salva");
const lista = listarVistorias();
const el = document.getElementById("conteudo");

function classeItem(v) {
  const rec = v.recomendacao;
  if (rec === "ALTO" || rec === "SUPRESSÃO" || rec === "INTERVENÇÃO URGENTE") return "item-alto";
  if (rec === "MÉDIO" || rec === "PODAS / ACOMPANHAMENTO") return "item-medio";
  return "item-baixo";
}

function maxPontos(v) {
  return v.pontuacao_maxima || (v.questionario ? 54 : 18);
}

function escHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function htmlResumoVistoria(v) {
  const linhas = [
    ["Solicitante:", v.solicitante || "—"],
    ["Endereço:", v.endereco || "—"],
    ["N° de vistoria:", numeroLaudoVistoria(v)],
  ];
  const itens = linhas
    .map(
      ([label, valor]) =>
        `<div class="vistoria-resumo-linha"><dt>${label}</dt><dd>${escHtml(valor)}</dd></div>`
    )
    .join("");
  return `<dl class="vistoria-resumo-lista">${itens}</dl>
    <small class="vistoria-data">${formatarDataHoraBr(v.created_at)}</small>`;
}

function suffix(v) {
  return v.questionario ? " SIM" : "";
}

let banner = "";
if (salvaId) {
  banner = `<div class="alerta-sucesso"><strong>✅ Vistoria #${salvaId} salva com sucesso!</strong>
    <p>Exporte o relatório em PDF abaixo.</p></div>`;
}

if (!lista.length) {
  el.innerHTML = banner + `
    <div class="empty-state">
      <span class="empty-icon">📭</span>
      <p>Nenhuma vistoria registrada.</p>
      <a href="nova.html" class="btn btn-primary">Criar primeira vistoria</a>
    </div>`;
} else {
  el.innerHTML = banner + `<ul class="vistoria-lista">${lista.map((v) => `
    <li class="vistoria-lista-item${String(salvaId) === String(v.id) ? " vistoria-destaque" : ""}" id="vistoria-${v.id}">
      <a href="resultado.html?id=${v.id}" class="vistoria-item ${classeItem(v)}">
        <div class="vistoria-info vistoria-info-compact">
          ${htmlResumoVistoria(v)}
        </div>
        <div class="vistoria-meta">
          <span class="score-badge">${v.pontuacao_total}/${maxPontos(v)}${suffix(v)}</span>
          <span class="rec-badge">${v.recomendacao}</span>
        </div>
      </a>
      <div class="vistoria-acoes">
        <a href="resultado.html?id=${v.id}" class="btn-acao">👁️ Abrir</a>
        <button type="button" class="btn-acao btn-acao-pdf" data-id="${v.id}">📄 PDF</button>
      </div>
    </li>`).join("")}</ul>`;

  document.querySelectorAll(".btn-acao-pdf").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
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

if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
}
