const POP_KEY = "bba_pops";
const POP_MAX_BYTES = 15 * 1024 * 1024;

function listarPops() {
  try {
    return JSON.parse(localStorage.getItem(POP_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarPops(lista) {
  localStorage.setItem(POP_KEY, JSON.stringify(lista));
}

function adicionarPop(dados) {
  const lista = listarPops();
  const id = lista.length ? Math.max(...lista.map((p) => p.id)) + 1 : 1;
  const item = {
    id,
    titulo: dados.titulo,
    original_name: dados.original_name,
    mime_type: dados.mime_type,
    data_url: dados.data_url,
    created_at: typeof formatarDataHoraBrAgora === "function" ? formatarDataHoraBrAgora() : new Date().toISOString(),
  };
  lista.unshift(item);
  salvarPops(lista);
  return item;
}

function obterPop(id) {
  return listarPops().find((p) => String(p.id) === String(id));
}

function abrirPopNativo(pop) {
  const bridge = window.AndroidPdf;
  if (!bridge || typeof bridge.pdfStart !== "function" || !pop?.data_url) return false;

  const base64 = pop.data_url.includes(",") ? pop.data_url.split(",", 2)[1] : pop.data_url;
  let nome = pop.original_name || `${pop.titulo || "pop"}.pdf`;
  if (!/\.pdf$/i.test(nome)) nome += ".pdf";
  nome = nome.replace(/[^\w.\-() ]+/g, "_");

  const chunkSize = 512 * 1024;
  bridge.pdfStart(nome);
  for (let i = 0; i < base64.length; i += chunkSize) {
    bridge.pdfAppend(base64.substring(i, i + chunkSize));
  }
  bridge.pdfFinish();
  return true;
}

function abrirPop(pop) {
  if (!pop?.data_url) return false;
  const mime = String(pop.mime_type || "").toLowerCase();
  if (mime.includes("pdf") && abrirPopNativo(pop)) return true;
  location.href = `ver.html?id=${pop.id}`;
  return true;
}
