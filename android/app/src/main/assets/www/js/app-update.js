const UPDATE_CHECK_KEY = "bba_update_last_check";
const UPDATE_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;

let _ultimaRelease = null;

function getVersaoInstalada() {
  return typeof APP_VERSION === "string" ? APP_VERSION : "0.0.0";
}

function getVersaoInstaladaCode() {
  return typeof APP_VERSION_CODE === "number" ? APP_VERSION_CODE : 0;
}

function normalizarVersao(texto) {
  const m = String(texto || "")
    .trim()
    .replace(/^v/i, "")
    .match(/(\d+)\.(\d+)\.(\d+)/);
  if (!m) return null;
  return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)];
}

function compararVersoes(a, b) {
  const va = normalizarVersao(a);
  const vb = normalizarVersao(b);
  if (!va || !vb) return 0;
  for (let i = 0; i < 3; i++) {
    if (va[i] > vb[i]) return 1;
    if (va[i] < vb[i]) return -1;
  }
  return 0;
}

function extrairVersaoRelease(release) {
  const tag = release?.tag_name || release?.name || "";
  const m = String(tag).match(/(\d+\.\d+\.\d+)/);
  return m ? m[1] : tag.replace(/^v/i, "");
}

function extrairApkRelease(release) {
  const assets = release?.assets || [];
  const apk = assets.find((a) => /\.apk$/i.test(a.name || ""));
  return apk?.browser_download_url || null;
}

async function buscarUltimaRelease(force = false) {
  const repo = getUpdateRepo();
  if (!repo) return null;

  if (!force && _ultimaRelease) return _ultimaRelease;

  const now = Date.now();
  const last = parseInt(localStorage.getItem(UPDATE_CHECK_KEY) || "0", 10);
  if (!force && now - last < UPDATE_CHECK_INTERVAL_MS && _ultimaRelease) {
    return _ultimaRelease;
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}`);
    const data = await res.json();
    _ultimaRelease = {
      versao: extrairVersaoRelease(data),
      nome: data.name || data.tag_name || "",
      notas: data.body || "",
      apkUrl: extrairApkRelease(data),
      publicadaEm: data.published_at || "",
      tag: data.tag_name || "",
    };
    localStorage.setItem(UPDATE_CHECK_KEY, String(now));
    return _ultimaRelease;
  } catch (err) {
    console.warn("Falha ao verificar atualização:", err);
    return null;
  }
}

async function verificarAtualizacao(opts = {}) {
  const silencioso = !!opts.silencioso;
  const force = !!opts.force;
  const instalada = getVersaoInstalada();

  if (!getUpdateRepo()) {
    return { disponivel: false, motivo: "repo_nao_configurado", versaoInstalada: instalada };
  }

  if (!navigator.onLine) {
    return { disponivel: false, motivo: "offline", versaoInstalada: instalada };
  }

  const release = await buscarUltimaRelease(force);
  if (!release || !release.versao) {
    return { disponivel: false, motivo: "sem_release", versaoInstalada: instalada };
  }

  const disponivel = compararVersoes(release.versao, instalada) > 0;
  if (!disponivel && !silencioso) {
    return {
      disponivel: false,
      motivo: "atualizado",
      versaoInstalada: instalada,
      versaoRemota: release.versao,
    };
  }

  return {
    disponivel,
    versaoInstalada: instalada,
    versaoRemota: release.versao,
    release,
  };
}

function abrirDownloadAtualizacao(url, versao) {
  if (!url) return;
  const nomeArquivo = versao ? `BBA-${versao}.apk` : "BBA-update.apk";
  if (typeof AndroidUpdate !== "undefined" && AndroidUpdate.downloadAndInstall) {
    AndroidUpdate.downloadAndInstall(url, nomeArquivo);
    return;
  }
  window.location.href = url;
}

function textoBotaoAtualizacao(versao) {
  const nativo =
    typeof AndroidUpdate !== "undefined" && AndroidUpdate.downloadAndInstall;
  return nativo ? `Baixar e instalar v${versao}` : `Baixar v${versao}`;
}

function renderBannerAtualizacao(container, info) {
  if (!container || !info?.disponivel || !info.release) return;
  const r = info.release;
  container.innerHTML = `
    <section class="update-banner" id="update-banner">
      <strong>Nova versão ${r.versao}</strong>
      <p class="hint">Instalada: ${info.versaoInstalada}. Toque para baixar e instalar por cima (dados preservados).</p>
      <button type="button" class="btn btn-primary btn-block" id="btn-update-banner">${textoBotaoAtualizacao(r.versao)}</button>
    </section>`;
  document.getElementById("btn-update-banner")?.addEventListener("click", () => {
    if (r.apkUrl) abrirDownloadAtualizacao(r.apkUrl, r.versao);
    else alert("APK não encontrado na release do GitHub.");
  });
}

function htmlSecaoAtualizacao(info) {
  const instalada = getVersaoInstalada();
  const repo = getUpdateRepo();
  let status = "Verificação automática ao abrir o app (com internet).";
  if (!repo) status = "Informe o repositório GitHub (owner/nome) abaixo.";
  else if (info?.disponivel && info.release) {
    status = `Nova versão <strong>${info.release.versao}</strong> disponível (instalada: ${instalada}).`;
  } else if (info?.motivo === "offline") status = "Offline — conecte-se à internet para verificar.";
  else if (info?.motivo === "atualizado") status = `App atualizado (${instalada}).`;
  else if (info?.motivo === "sem_release") status = "Nenhuma release encontrada no GitHub.";

  return `
    <section class="info-card update-card">
      <h3>Atualização do app</h3>
      <p class="hint">Versão instalada: <strong>${instalada}</strong></p>
      <p class="hint" id="update-status">${status}</p>
      <label class="field">
        <span>Repositório GitHub</span>
        <input type="text" id="update-repo" placeholder="usuario/bba" value="${repo}">
      </label>
      <button type="button" id="btn-check-update" class="btn btn-secondary btn-block">Verificar atualização</button>
      ${
        info?.disponivel && info.release?.apkUrl
          ? `<button type="button" id="btn-download-update" class="btn btn-primary btn-block">${textoBotaoAtualizacao(info.release.versao)}</button>`
          : ""
      }
    </section>`;
}

function initSecaoAtualizacaoPerfil(container, infoInicial) {
  if (!container) return;
  container.innerHTML = htmlSecaoAtualizacao(infoInicial);

  document.getElementById("btn-check-update")?.addEventListener("click", async () => {
    saveUpdateConfig(document.getElementById("update-repo")?.value || "");
    const statusEl = document.getElementById("update-status");
    const btn = document.getElementById("btn-check-update");
    if (btn) {
      btn.disabled = true;
      btn.textContent = "Verificando…";
    }
    if (statusEl) statusEl.textContent = "Consultando GitHub Releases…";
    const info = await verificarAtualizacao({ force: true });
    initSecaoAtualizacaoPerfil(container, info);
  });

  document.getElementById("btn-download-update")?.addEventListener("click", () => {
    const url = infoInicial?.release?.apkUrl;
    const versao = infoInicial?.release?.versao;
    if (url) abrirDownloadAtualizacao(url, versao);
  });
}
