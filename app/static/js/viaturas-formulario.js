(function () {
  const form = document.getElementById("form-viatura");
  if (!form) return;

  const preview = document.getElementById("preview-resultado");
  const previewTotal = document.getElementById("preview-total");
  const previewRecomendacao = document.getElementById("preview-recomendacao");
  const previewTexto = document.getElementById("preview-texto");
  const totalItens =
    (window.VIATURA_CONFIG && window.VIATURA_CONFIG.totalItens) ||
    (typeof totalItensChecklistViatura === "function" ? totalItensChecklistViatura() : 19);
  const selectViatura = document.getElementById("select-viatura");
  const placaViatura = document.getElementById("placa-viatura");
  const tipoViatura = document.getElementById("tipo-viatura");
  const dadosViatura = document.getElementById("dados-viatura");

  if (selectViatura) {
    selectViatura.addEventListener("change", () => {
      const option = selectViatura.options[selectViatura.selectedIndex];
      const placa = option?.dataset.placa || "";
      const ar = option?.dataset.ar || "";
      const marca = option?.dataset.marca || "";
      const modelo = option?.dataset.modelo || "";
      placaViatura.value = placa;
      tipoViatura.value = [ar, marca, modelo].filter(Boolean).join(" · ");
      dadosViatura.textContent = placa
        ? `${ar} · ${placa} · ${marca} ${modelo}`.trim()
        : "Selecione uma viatura cadastrada.";
    });
  }

  if (typeof initAssinaturaCondutor === "function" && window.USUARIO_LOGADO) {
    initAssinaturaCondutor({
      hiddenId: "assinatura_json",
      btnId: "btn-assinar-condutor",
      previewId: "preview-assinatura-condutor",
      usuario: window.USUARIO_LOGADO,
    });
  }

  async function atualizarPreview() {
    if (typeof calcularResultadoViatura !== "function") return;

    const respostas = getRespostasChecklist(form);
    let result;

    try {
      const resp = await fetch("/api/viaturas/calcular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(respostas),
      });
      result = await resp.json();
    } catch (e) {
      result = calcularResultadoViatura(respostas);
    }

    const cls = classeResultadoViatura(result.recomendacao);
    preview.classList.remove(
      "hidden",
      "preview-aprovada",
      "preview-restricoes",
      "preview-impedida"
    );
    preview.classList.add(cls);
    previewTotal.textContent = result.pontuacao_total;
    previewRecomendacao.textContent = result.recomendacao;
    previewRecomendacao.className = `preview-label ${cls}`;
    previewTexto.textContent = result.justificativa;

    const maxEl = preview.querySelector(".preview-score small");
    if (maxEl) maxEl.textContent = `/ ${totalItens} não conformes`;
  }

  form.querySelectorAll('input[type="radio"]').forEach((input) => {
    input.addEventListener("change", atualizarPreview);
  });
  atualizarPreview();
})();
