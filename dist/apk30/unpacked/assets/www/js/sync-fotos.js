const FOTOS_BUCKET = "vistoria-fotos";
const FOTO_MAX_LADO = 1280;
const FOTO_JPEG_QUALITY = 0.7;

function storagePublicUrl(cfg, storagePath) {
  const base = String(cfg.url || "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${FOTOS_BUCKET}/${storagePath}`;
}

function dataUrlToBlob(dataUrl) {
  const parts = String(dataUrl || "").split(",");
  if (parts.length < 2) throw new Error("Data URL inválida");
  const mimeMatch = parts[0].match(/data:([^;]+)/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bin = atob(parts[1]);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = dataUrl;
  });
}

async function comprimirDataUrl(dataUrl, maxLado = FOTO_MAX_LADO, quality = FOTO_JPEG_QUALITY) {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  if (!dataUrl.startsWith("data:image")) return dataUrl;
  try {
    const img = await loadImageFromDataUrl(dataUrl);
    let { width, height } = img;
    if (!width || !height) return dataUrl;
    const maior = Math.max(width, height);
    if (maior > maxLado) {
      const scale = maxLado / maior;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return dataUrl;
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", quality);
  } catch {
    return dataUrl;
  }
}

async function uploadFotoStorage(cfg, syncId, index, dataUrl) {
  const compressed = await comprimirDataUrl(dataUrl);
  if (!compressed) throw new Error("Foto vazia");
  const blob = dataUrlToBlob(compressed);
  const storagePath = `${syncId}/${index}.jpg`;
  const base = String(cfg.url || "").replace(/\/$/, "");
  const url = `${base}/storage/v1/object/${FOTOS_BUCKET}/${storagePath}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${cfg.anonKey}`,
      "Content-Type": blob.type || "image/jpeg",
      "x-upsert": "true",
    },
    body: blob,
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Upload foto falhou (${resp.status}): ${txt.slice(0, 160)}`);
  }
  return {
    nome: `foto_${index + 1}.jpg`,
    storage_path: storagePath,
    content_type: "image/jpeg",
    data: compressed,
  };
}

async function downloadFotoStorage(cfg, storagePath) {
  if (!storagePath) return null;
  const url = storagePublicUrl(cfg, storagePath);
  const resp = await fetch(url, {
    headers: {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${cfg.anonKey}`,
    },
  });
  if (!resp.ok) {
    throw new Error(`Download foto falhou (${resp.status})`);
  }
  const blob = await resp.blob();
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function metadadosFoto(foto) {
  if (!foto || typeof foto !== "object") return null;
  const path = foto.storage_path || "";
  if (!path) return null;
  return {
    nome: foto.nome || path.split("/").pop() || "foto.jpg",
    storage_path: path,
    content_type: foto.content_type || "image/jpeg",
  };
}

/**
 * Garante upload das fotos locais com data: e devolve metadados + data local.
 * Fotos já com storage_path e sem data nova são reutilizadas.
 */
async function prepararFotosVistoriaParaPush(cfg, vistoria) {
  const syncId = vistoria?.sync_id;
  const fotos = Array.isArray(vistoria?.fotos) ? vistoria.fotos : [];
  if (!syncId || !fotos.length) {
    return { fotosLocais: fotos, fotosMeta: fotos.map(metadadosFoto).filter(Boolean), falhas: 0 };
  }

  const fotosLocais = [];
  const fotosMeta = [];
  let falhas = 0;

  for (let i = 0; i < fotos.length; i++) {
    const foto = fotos[i] || {};
    try {
      if (foto.storage_path && (!foto.data || foto._synced)) {
        const meta = metadadosFoto(foto);
        if (meta) {
          fotosMeta.push(meta);
          fotosLocais.push({ ...foto, ...meta });
        }
        continue;
      }
      if (foto.data && String(foto.data).startsWith("data:")) {
        const uploaded = await uploadFotoStorage(cfg, syncId, i, foto.data);
        fotosMeta.push({
          nome: uploaded.nome,
          storage_path: uploaded.storage_path,
          content_type: uploaded.content_type,
        });
        fotosLocais.push({
          nome: uploaded.nome,
          storage_path: uploaded.storage_path,
          content_type: uploaded.content_type,
          data: uploaded.data,
          _synced: true,
        });
        continue;
      }
      if (foto.storage_path) {
        const meta = metadadosFoto(foto);
        if (meta) {
          fotosMeta.push(meta);
          fotosLocais.push({ ...foto, ...meta });
        }
      }
    } catch (e) {
      falhas += 1;
      console.warn("Falha ao enviar foto:", e);
      // Mantém local; tenta de novo na próxima sync
      fotosLocais.push(foto);
      const meta = metadadosFoto(foto);
      if (meta) fotosMeta.push(meta);
    }
  }

  return { fotosLocais, fotosMeta, falhas };
}

/**
 * Após pull: preserva data local se storage_path igual; senão baixa do Storage.
 */
async function hidratarFotosVistoriaDoPull(cfg, vistoria, anterior) {
  const fotosRemotas = Array.isArray(vistoria?.fotos) ? vistoria.fotos : [];
  if (!fotosRemotas.length) {
    return { ...vistoria, fotos: [] };
  }
  const mapaLocal = {};
  for (const f of anterior?.fotos || []) {
    if (f?.storage_path && f?.data) mapaLocal[f.storage_path] = f.data;
  }

  const fotos = [];
  let falhas = 0;
  for (const foto of fotosRemotas) {
    const path = foto?.storage_path;
    if (!path) continue;
    let data = mapaLocal[path] || foto.data || null;
    if (!data) {
      try {
        data = await downloadFotoStorage(cfg, path);
      } catch (e) {
        falhas += 1;
        console.warn("Falha ao baixar foto:", e);
      }
    }
    fotos.push({
      nome: foto.nome || path.split("/").pop() || "foto.jpg",
      storage_path: path,
      content_type: foto.content_type || "image/jpeg",
      data: data || undefined,
      _synced: Boolean(data),
    });
  }
  return { vistoria: { ...vistoria, fotos }, falhas };
}

window.FOTOS_BUCKET = FOTOS_BUCKET;
window.storagePublicUrl = storagePublicUrl;
window.comprimirDataUrl = comprimirDataUrl;
window.prepararFotosVistoriaParaPush = prepararFotosVistoriaParaPush;
window.hidratarFotosVistoriaDoPull = hidratarFotosVistoriaDoPull;
window.metadadosFoto = metadadosFoto;
