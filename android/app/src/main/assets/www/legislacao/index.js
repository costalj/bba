const el = document.getElementById("conteudo");
const categorias = typeof LEGISLACAO_CATEGORIAS !== "undefined" ? LEGISLACAO_CATEGORIAS : [];
const params = new URLSearchParams(location.search);
const catId = params.get("cat");
const headerTitle = document.querySelector(".header-titles h1");
const headerBack = document.querySelector(".header-back");

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
      <p>Toque em uma categoria para abrir os documentos.</p>
    </section>
    <section class="modulos-grid legislacao-grid">
      ${categorias.map((cat) => {
        const qtd = (cat.documentos || []).length;
        return `<a href="index.html?cat=${encodeURIComponent(cat.id)}" class="modulo-card" style="--modulo-cor:${cat.cor || "#334155"}">
          <span class="modulo-icone">${cat.icone}</span>
          <strong class="modulo-nome">${cat.titulo}</strong>
          <small class="modulo-desc">${cat.descricao}</small>
          <span class="modulo-badge modulo-ativo">${qtd} doc${qtd !== 1 ? "s" : ""}</span>
        </a>`;
      }).join("")}
    </section>
    <section class="info-card legislacao-rodape">
      <p class="hint">Documentos sem PDF serão disponibilizados conforme publicação oficial.</p>
    </section>`;
}

function renderCategoria(cat) {
  if (headerTitle) headerTitle.textContent = cat.titulo;
  if (headerBack) headerBack.href = "index.html";

  el.innerHTML = `
    <section class="legislacao-hero" style="--modulo-cor:${cat.cor || "#334155"}">
      <span class="legislacao-hero-icone">${cat.icone}</span>
      <h2>${cat.titulo}</h2>
      <p>${cat.descricao}</p>
    </section>
    <section class="legislacao-categoria">
      <ul class="doc-lista">${(cat.documentos || []).map(renderDoc).join("")}</ul>
    </section>`;
}

const categoria = catId ? categorias.find((c) => c.id === catId) : null;
if (categoria) {
  renderCategoria(categoria);
} else {
  renderHub();
}
