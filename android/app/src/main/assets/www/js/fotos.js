(function () {
  const MAX_FOTOS_PADRAO = 5;
  const FOTO_LAUDO_MAX_LADO = 1600;
  const FOTO_LAUDO_QUALIDADE = 0.85;

  function lerArquivoComoDataUrl(file) {
    return new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result || "");
      r.onerror = () => resolve("");
      r.readAsDataURL(file);
    });
  }

  function normalizarImagemParaLaudo(dataUrl) {
    return new Promise((resolve) => {
      if (!dataUrl || String(dataUrl).length < 20) {
        resolve("");
        return;
      }
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const ladoMax = Math.max(width, height);
        if (ladoMax <= FOTO_LAUDO_MAX_LADO) {
          resolve(dataUrl);
          return;
        }
        const escala = FOTO_LAUDO_MAX_LADO / ladoMax;
        width = Math.round(width * escala);
        height = Math.round(height * escala);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", FOTO_LAUDO_QUALIDADE));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function isImagemArquivo(file) {
    if (!file) return false;
    if (file.type && file.type.startsWith("image/")) return true;
    const name = (file.name || "").toLowerCase();
    if (/\.(jpe?g|png|gif|webp|heic|heif|bmp)$/i.test(name)) return true;
    return !file.type || file.type === "application/octet-stream";
  }

  async function fotosParaBase64(files, max = MAX_FOTOS_PADRAO) {
    const lista = Array.isArray(files) ? files : Array.from(files || []);
    const fotos = [];
    for (const file of lista.slice(0, max)) {
      if (!file) continue;
      const bruto = await lerArquivoComoDataUrl(file);
      const data = await normalizarImagemParaLaudo(bruto);
      if (data && String(data).length > 20) {
        fotos.push({
          nome: file.name || `foto_${fotos.length + 1}.jpg`,
          data,
        });
      }
    }
    return fotos;
  }

  function syncFileInput(inputSync, files) {
    if (!inputSync || typeof DataTransfer === "undefined") return;
    try {
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      inputSync.files = dt.files;
    } catch (e) {
      console.warn("Nao foi possivel sincronizar input de fotos:", e);
    }
  }

  function initFotosVistoria(opts) {
    const max = opts.maxFotos || MAX_FOTOS_PADRAO;
    const preview = document.getElementById(opts.previewId || "fotos-preview");
    const inputCamera = document.getElementById(opts.inputCameraId || "input-fotos-camera");
    const inputGaleria = document.getElementById(opts.inputGaleriaId || "input-fotos-galeria");
    const inputSync = document.getElementById(opts.inputSyncId || "input-fotos-sync");
    const contador = document.getElementById(opts.contadorId || "fotos-contador");
    let fotos = [];

    function getFiles() {
      return fotos.map((item) => item.file);
    }

    function atualizarContador() {
      if (!contador) return;
      contador.textContent =
        fotos.length === 0
          ? `Nenhuma foto anexada (máx. ${max})`
          : `${fotos.length} foto${fotos.length > 1 ? "s" : ""} anexada${fotos.length > 1 ? "s" : ""} · máx. ${max}`;
    }

    async function renderPreview() {
      if (!preview) return;
      preview.innerHTML = "";
      if (!fotos.length) {
        preview.innerHTML = `<p class="fotos-vazio hint">As miniaturas aparecerão aqui após anexar.</p>`;
        atualizarContador();
        return;
      }

      for (let idx = 0; idx < fotos.length; idx++) {
        const item = fotos[idx];
        if (!item.previewUrl) {
          item.previewUrl = await lerArquivoComoDataUrl(item.file);
        }

        const div = document.createElement("div");
        div.className = "foto-thumb";
        const img = document.createElement("img");
        img.src = item.previewUrl || "";
        img.alt = item.file.name || `Foto ${idx + 1}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "foto-remove";
        btn.setAttribute("aria-label", "Remover foto");
        btn.textContent = "✕";
        btn.addEventListener("click", () => {
          fotos.splice(idx, 1);
          renderPreview();
          syncFileInput(inputSync, getFiles());
        });
        div.appendChild(img);
        div.appendChild(btn);
        preview.appendChild(div);
      }
      atualizarContador();
    }

    async function adicionarArquivos(fileList) {
      const novas = Array.from(fileList || []).filter(isImagemArquivo);
      if (!novas.length) return;
      const espaco = max - fotos.length;
      if (espaco <= 0) {
        alert(`Limite de ${max} fotos atingido. Remova uma para adicionar outra.`);
        return;
      }

      const toAdd = novas.slice(0, espaco);
      for (const file of toAdd) {
        const previewUrl = await lerArquivoComoDataUrl(file);
        if (previewUrl && previewUrl.length > 20) {
          fotos.push({ file, previewUrl });
        }
      }

      if (novas.length > espaco) {
        alert(`Apenas ${espaco} foto(s) foram adicionadas (máx. ${max}).`);
      }
      await renderPreview();
      syncFileInput(inputSync, getFiles());
    }

    function bindInput(input) {
      if (!input) return;
      input.addEventListener("change", () => {
        adicionarArquivos(input.files);
        input.value = "";
      });
    }

    bindInput(inputCamera);
    bindInput(inputGaleria);

    const legado = document.getElementById("input-fotos");
    if (legado && legado !== inputCamera && legado !== inputGaleria) {
      bindInput(legado);
    }

    if (opts.btnCameraId) {
      const btn = document.getElementById(opts.btnCameraId);
      if (btn && inputCamera) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          if (window.AndroidCamera && typeof AndroidCamera.preferCamera === "function") {
            AndroidCamera.preferCamera();
          }
          inputCamera.click();
        });
      }
    }
    if (opts.btnGaleriaId) {
      const btn = document.getElementById(opts.btnGaleriaId);
      if (btn && inputGaleria) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          inputGaleria.click();
        });
      }
    }

    renderPreview();

    return {
      getFiles() {
        return getFiles();
      },
      async toBase64() {
        return fotosParaBase64(getFiles(), max);
      },
    };
  }

  window.fotosParaBase64 = fotosParaBase64;
  window.initFotosVistoria = initFotosVistoria;
})();
