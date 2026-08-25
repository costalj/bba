(function () {
  const form = document.getElementById("form-vistoria");
  if (!form) return;

  const preview = document.getElementById("preview-resultado");
  const previewTotal = document.getElementById("preview-total");
  const previewRecomendacao = document.getElementById("preview-recomendacao");
  const previewTexto = document.getElementById("preview-texto");
  const previewSomatorio = document.getElementById("preview-somatorio");
  const maxFotos = (window.VISTORIA_CONFIG && window.VISTORIA_CONFIG.maxFotos) || 5;
  let rubricaCanvas = null;

  if (typeof initRubricaCanvas === "function") {
    rubricaCanvas = initRubricaCanvas({
      canvasId: "canvas-rubrica",
      hiddenId: "rubrica_solicitante",
      clearBtnId: "btn-limpar-rubrica",
    });
  }

  if (typeof initAssinaturaChefe === "function" && window.USUARIO_LOGADO) {
    initAssinaturaChefe({
      hiddenId: "assinatura_json",
      btnId: "btn-assinar-chefe",
      previewId: "preview-assinatura-chefe",
      usuario: window.USUARIO_LOGADO,
    });
  }

  form.addEventListener("submit", () => {
    if (rubricaCanvas) rubricaCanvas.exportRubrica();
  });

  function classeRisco(nivel) {
    if (nivel === "ALTO") return "preview-alto";
    if (nivel === "MÉDIO") return "preview-medio";
    return "preview-baixo";
  }

  async function atualizarPreview() {
    const data = {};
    form.querySelectorAll('input[type="radio"]:checked').forEach((input) => {
      if (input.name.startsWith("q_")) data[input.name] = input.value;
    });

    try {
      const resp = await fetch("/api/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await resp.json();

      preview.classList.remove("hidden", "preview-alto", "preview-medio", "preview-baixo");
      preview.classList.add(classeRisco(result.recomendacao));
      previewTotal.textContent = result.pontuacao_total;
      previewRecomendacao.textContent = result.recomendacao;
      previewRecomendacao.className = `preview-label ${classeRisco(result.recomendacao)}`;
      previewTexto.textContent = result.justificativa;

      if (previewSomatorio && typeof renderSomatorioHtml === "function") {
        previewSomatorio.innerHTML = renderSomatorioHtml(result);
      }

      const maxEl = preview.querySelector(".preview-score small");
      if (maxEl) maxEl.textContent = `/ ${result.pontuacao_maxima} respostas SIM`;
    } catch (e) {
      console.error("Erro ao calcular preview:", e);
    }
  }

  form.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", atualizarPreview);
  });
  atualizarPreview();

  if (typeof initFotosVistoria === "function") {
    initFotosVistoria({
      maxFotos,
      inputSyncId: "input-fotos-sync",
      btnCameraId: "btn-foto-camera",
      btnGaleriaId: "btn-foto-galeria",
    });
  }
})();
