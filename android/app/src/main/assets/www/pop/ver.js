const el = document.getElementById("conteudo");
const tituloHeader = document.getElementById("titulo-header");
const id = new URLSearchParams(location.search).get("id");
const pop = obterPop(id);

if (!pop || !pop.data_url) {
  el.innerHTML = `<div class="empty-state"><span class="empty-icon">📭</span><p>POP não encontrado.</p><a href="index.html" class="btn btn-secondary btn-block">Voltar</a></div>`;
} else {
  if (tituloHeader) tituloHeader.textContent = pop.titulo || "POP";
  const mime = String(pop.mime_type || "").toLowerCase();

  if (mime.includes("pdf") && abrirPopNativo(pop)) {
    el.innerHTML = `
      <section class="info-card pop-aberto-card">
        <p>O PDF foi enviado ao leitor do celular.</p>
        <p class="hint">Se não abriu automaticamente, escolha um app de PDF na lista.</p>
        <button type="button" class="btn btn-primary btn-block" id="btn-reabrir">Abrir novamente</button>
        <a href="index.html" class="btn btn-secondary btn-block">Voltar à lista</a>
      </section>`;
    document.getElementById("btn-reabrir").addEventListener("click", () => abrirPopNativo(pop));
  } else if (mime.startsWith("image/")) {
    el.innerHTML = `
      <section class="pop-viewer">
        <img src="${pop.data_url}" alt="${pop.titulo || "POP"}" class="pop-viewer-img">
      </section>`;
  } else {
    el.innerHTML = `
      <section class="pop-viewer">
        <iframe src="${pop.data_url}" class="pop-viewer-frame" title="${pop.titulo || "POP"}"></iframe>
      </section>
      <a href="index.html" class="btn btn-secondary btn-block">Voltar à lista</a>`;
  }
}
