const el = document.getElementById("conteudo");
const categorias = typeof LEGISLACAO_CATEGORIAS !== "undefined" ? LEGISLACAO_CATEGORIAS : [];
const params = new URLSearchParams(location.search);
const catId = params.get("cat");
const headerTitle = document.querySelector(".header-titles h1");
const headerBack = document.querySelector(".header-back");

function statusBadge(status) {
  const labels = {
    ameacada: "Ameaçada",
    imune: "Imune",
    tombada: "Tombada",
    protegida: "Protegida",
  };
  return labels[status] || status || "";
}

function renderDoc(doc) {
  const acao = doc.arquivo
    ? `<a href="../${doc.arquivo}" class="doc-item-acao" target="_blank" rel="noopener">Abrir PDF</a>`
    : `<span class="doc-badge">PDF em breve</span>`;
  const data = doc.data && doc.data !== "—" ? ` · ${doc.data}` : "";
  return `<li class="doc-item${doc.arquivo ? "" : " doc-item-indisponivel"}">
    <div class="doc-item-corpo">
      <strong class="doc-item-titulo">${doc.titulo}</strong>
      <small class="doc-item-meta">${doc.referencia}${data}</small>
    </div>
    ${acao}
  </li>`;
}

function renderEspecie(esp) {
  return `<li class="doc-item">
    <div class="doc-item-corpo">
      <strong class="doc-item-titulo">${esp.nome_popular}</strong>
      <small class="doc-item-meta"><em>${esp.nome_cientifico}</em> · ${statusBadge(esp.status)} (${(esp.esfera || "").toUpperCase()})</small>
      <p class="hint" style="margin:.35rem 0 0">${esp.conduta}</p>
      <small class="doc-item-meta">${esp.referencia}</small>
    </div>
    <span class="doc-badge">${statusBadge(esp.status)}</span>
  </li>`;
}

function renderHub() {
  if (headerTitle) headerTitle.textContent = "Legislação";
  if (headerBack) headerBack.href = "../index.html";

  if (!categorias.length) {
    el.innerHTML = `<div class="empty-state"><span class="empty-icon">📭</span><p>Nenhum documento cadastrado.</p></div>`;
    return;
  }

  el.innerHTML = `
    <section class="legislacao-hero" style="--modulo-cor:#334155">
      <span class="legislacao-hero-icone">⚖️</span>
      <h2>Documentos oficiais</h2>
      <p>Toque em uma categoria para abrir os documentos e o catálogo de espécies.</p>
    </section>
    <section class="modulos-grid legislacao-grid">
      ${categorias.map((cat) => {
        const qtdDocs = (cat.documentos || []).length;
        const qtdEsp = (cat.especies || []).length;
        const badge = qtdEsp
          ? `${qtdEsp} espécies`
          : `${qtdDocs} doc${qtdDocs !== 1 ? "s" : ""}`;
        return `<a href="index.html?cat=${encodeURIComponent(cat.id)}" class="modulo-card" style="--modulo-cor:${cat.cor || "#334155"}">
          <span class="modulo-icone">${cat.icone}</span>
          <strong class="modulo-nome">${cat.titulo}</strong>
          <small class="modulo-desc">${cat.descricao}</small>
          <span class="modulo-badge modulo-ativo">${badge}</span>
        </a>`;
      }).join("")}
    </section>
    <section class="info-card legislacao-rodape">
      <p class="hint">Na vistoria, use Verificar proteção / Foto e identificar para consultar este catálogo.</p>
    </section>`;
}

function renderCategoria(cat) {
  if (headerTitle) headerTitle.textContent = cat.titulo;
  if (headerBack) headerBack.href = "index.html";

  const especies = cat.especies || [];
  const docs = cat.documentos || [];

  el.innerHTML = `
    <section class="legislacao-hero" style="--modulo-cor:${cat.cor || "#334155"}">
      <span class="legislacao-hero-icone">${cat.icone}</span>
      <h2>${cat.titulo}</h2>
      <p>${cat.descricao}</p>
    </section>
    ${
      especies.length
        ? `<section class="legislacao-categoria">
            <h3 class="questionario-grupo">Catálogo de espécies</h3>
            <label class="field"><input type="search" id="filtro-especie-leg" placeholder="Buscar espécie…"></label>
            <ul class="doc-lista" id="lista-especies-leg">${especies.map(renderEspecie).join("")}</ul>
          </section>`
        : ""
    }
    ${
      docs.length
        ? `<section class="legislacao-categoria">
            <h3 class="questionario-grupo">Documentos de referência</h3>
            <ul class="doc-lista">${docs.map(renderDoc).join("")}</ul>
          </section>`
        : ""
    }`;

  const filtro = document.getElementById("filtro-especie-leg");
  const lista = document.getElementById("lista-especies-leg");
  if (filtro && lista) {
    filtro.addEventListener("input", () => {
      const q = filtro.value.trim().toLowerCase();
      const filtradas = !q
        ? especies
        : especies.filter(
            (e) =>
              e.nome_popular.toLowerCase().includes(q) ||
              (e.nome_cientifico || "").toLowerCase().includes(q) ||
              (e.aliases || []).some((a) => String(a).toLowerCase().includes(q))
          );
      lista.innerHTML = filtradas.map(renderEspecie).join("") || `<li class="hint">Nenhuma espécie encontrada.</li>`;
    });
  }
}

const categoria = catId ? categorias.find((c) => c.id === catId) : null;
if (categoria) {
  renderCategoria(categoria);
} else {
  renderHub();
}
