const el = document.getElementById("conteudo");
const params = new URLSearchParams(location.search);
const erro = params.get("erro");

function renderLista(pops) {
  if (!pops.length) {
    return `<div class="empty-state"><span class="empty-icon">📭</span><p>Nenhum POP enviado ainda.</p></div>`;
  }
  return `<ul class="doc-lista">${pops
    .map(
      (pop) => `<li class="doc-item">
      <div class="doc-item-corpo">
        <strong class="doc-item-titulo">${pop.titulo}</strong>
        <small class="doc-item-meta">${pop.original_name || "Arquivo"}${pop.created_at ? ` · ${pop.created_at}` : ""}</small>
      </div>
      <a href="ver.html?id=${pop.id}" class="doc-item-acao">Abrir</a>
    </li>`
    )
    .join("")}</ul>`;
}

function render() {
  el.innerHTML = `
    <section class="legislacao-hero" style="--modulo-cor:#0f766e">
      <span class="legislacao-hero-icone">📋</span>
      <h2>Procedimentos operacionais</h2>
      <p>Envie e consulte os POPs da unidade.</p>
    </section>
    ${erro ? `<p class="form-erro">${decodeURIComponent(erro)}</p>` : ""}
    <section class="form-section pop-upload">
      <h3>Enviar POP</h3>
      <form id="form-pop">
        <label class="field">
          <span>Título</span>
          <input type="text" name="titulo" required placeholder="Título do procedimento">
        </label>
        <label class="field">
          <span>Arquivo</span>
          <input type="file" name="arquivo" required accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,application/pdf,image/*">
        </label>
        <button type="submit" class="btn btn-primary btn-block">Enviar POP</button>
      </form>
    </section>
    <section class="legislacao-categoria">
      <h3 class="pop-lista-titulo">POPs cadastrados</h3>
      <div id="lista-pops">${renderLista(listarPops())}</div>
    </section>`;

  document.getElementById("form-pop").addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const fd = new FormData(ev.target);
    const titulo = String(fd.get("titulo") || "").trim();
    const arquivo = fd.get("arquivo");
    if (!titulo) {
      location.href = "index.html?erro=" + encodeURIComponent("Informe o título do POP.");
      return;
    }
    if (!arquivo || !arquivo.name) {
      location.href = "index.html?erro=" + encodeURIComponent("Selecione um arquivo.");
      return;
    }
    if (arquivo.size > POP_MAX_BYTES) {
      location.href = "index.html?erro=" + encodeURIComponent("Arquivo muito grande (máx. 15 MB).");
      return;
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(arquivo);
    });

    adicionarPop({
      titulo,
      original_name: arquivo.name,
      mime_type: arquivo.type || "application/octet-stream",
      data_url: dataUrl,
    });

    location.href = "index.html";
  });
}

render();
