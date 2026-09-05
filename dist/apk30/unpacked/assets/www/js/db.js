const DB_KEY = "bba_vistorias";

function listarVistorias() {
  try {
    return JSON.parse(localStorage.getItem(DB_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarVistorias(lista) {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(lista));
    return true;
  } catch (e) {
    console.error("Falha ao salvar vistorias:", e);
    if (e && e.name === "QuotaExceededError") {
      alert("Armazenamento cheio. Exporte ou remova vistorias antigas com muitas fotos.");
    }
    return false;
  }
}

function urlFotoVistoria(foto) {
  if (!foto || typeof foto !== "object") return "";
  const data = foto.data || "";
  if (data && String(data).length > 20) return data;
  const path = foto.storage_path || "";
  if (path && typeof storagePublicUrl === "function" && typeof getSyncConfig === "function") {
    const cfg = getSyncConfig();
    if (cfg?.url) return storagePublicUrl(cfg, path);
  }
  return "";
}

async function hidratarVistoria(vistoria) {
  if (!vistoria || typeof hidratarFotosVistoriaDoPull !== "function") return vistoria;
  if (typeof isSyncConfigured !== "function" || !isSyncConfigured()) return vistoria;
  const cfg = getSyncConfig();
  const fotos = Array.isArray(vistoria.fotos) ? vistoria.fotos : [];
  const precisaFotos = fotos.some((f) => f?.storage_path && !f?.data);
  if (!precisaFotos) return vistoria;
  const result = await hidratarFotosVistoriaDoPull(cfg, vistoria, vistoria);
  return result.vistoria || vistoria;
}

async function hidratarTodasVistorias() {
  if (typeof isSyncConfigured !== "function" || !isSyncConfigured()) return false;
  const lista = listarVistorias();
  let alterou = false;
  const nova = [];
  for (const v of lista) {
    const hidratada = await hidratarVistoria(v);
    nova.push(hidratada);
    if (hidratada !== v) alterou = true;
  }
  if (alterou) salvarVistorias(nova);
  return alterou;
}

async function prepararHistoricoVistorias() {
  if (
    typeof sincronizar === "function" &&
    typeof isSyncConfigured === "function" &&
    isSyncConfigured() &&
    navigator.onLine
  ) {
    try {
      await sincronizar({ silencioso: true });
    } catch (e) {
      console.warn("Sync do histórico:", e);
    }
  }
  await hidratarTodasVistorias();
}

function obterVistoria(id) {
  return listarVistorias().find((v) => String(v.id) === String(id));
}

function gerarNumeroLaudo() {
  const ano = new Date().getFullYear();
  const seq =
    listarVistorias().filter((v) => String(v.created_at || "").includes(String(ano))).length + 1;
  return `${String(seq).padStart(4, "0")}/${ano}`;
}

function numeroLaudoVistoria(v) {
  if (v.codigo) return v.codigo;
  const ano = new Date().getFullYear();
  return `${String(v.id || 1).padStart(4, "0")}/${ano}`;
}

function formatarDataHoraBr(valor) {
  if (!valor) return "—";
  const texto = String(valor).trim();
  const iso = texto.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/);
  if (iso) {
    return `${iso[3]}/${iso[2]}/${iso[1]} ${iso[4]}:${iso[5]}`;
  }
  const br = texto.match(/^(\d{2})\/(\d{2})\/(\d{4}),?\s+(\d{2}):(\d{2})/);
  if (br) {
    return `${br[1]}/${br[2]}/${br[3]} ${br[4]}:${br[5]}`;
  }
  return texto.replace(",", "").trim();
}

function formatarDataHoraBrAgora() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function criarVistoria(dados) {
  const lista = listarVistorias();
  const id = lista.length ? Math.max(...lista.map((v) => v.id)) + 1 : 1;
  const codigo = gerarNumeroLaudo();
  const vistoria = touchSyncMeta({
    id,
    created_at: formatarDataHoraBrAgora(),
    codigo,
    assinatura: dados.assinatura || null,
    rubrica: dados.rubrica || null,
    ...dados,
  });
  lista.unshift(vistoria);
  if (!salvarVistorias(lista)) {
    lista.shift();
    throw new Error("Não foi possível salvar a vistoria no dispositivo.");
  }
  return vistoria;
}

function atualizarVistoria(id, dados) {
  const lista = listarVistorias();
  const idx = lista.findIndex((v) => String(v.id) === String(id));
  if (idx === -1) return null;
  lista[idx] = touchSyncMeta({ ...lista[idx], ...dados });
  if (!salvarVistorias(lista)) return null;
  return lista[idx];
}

function assinarVistoria(id, usuario) {
  const assinatura = {
    nome: usuario.nome,
    posto: usuario.posto || "",
    matricula: usuario.matricula || "",
    cargo: "Chefe de Socorro",
    perfil: usuario.perfil,
    data_hora: formatarDataHoraBrAgora(),
    assinado_por: nomeCompletoMilitar(usuario),
    tipo: "Assinatura eletrônica",
  };
  return atualizarVistoria(id, { assinatura });
}

async function fotosParaBase64(files, max = 5) {
  const fotos = [];
  const lista = Array.isArray(files) ? files : Array.from(files || []);
  for (const file of lista.slice(0, max)) {
    if (!file) continue;
    const data = await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result || "");
      r.onerror = () => resolve("");
      r.readAsDataURL(file);
    });
    if (data && String(data).length > 20) {
      fotos.push({ nome: file.name || `foto_${fotos.length + 1}.jpg`, data });
    }
  }
  return fotos;
}
