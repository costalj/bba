document.getElementById("questionario").innerHTML = renderSecoesQuestionario();

const form = document.getElementById("form-vistoria");
const preview = document.getElementById("preview-resultado");
const usuario = getUsuario();

function renderSecaoAssinaturaChefe() {
  const el = document.getElementById("secao-assinatura-chefe");
  if (!el) return;
  if (isChefeSocorro()) {
    el.innerHTML = `
      <p class="hint">Assinatura eletrônica com seu usuário logado, data e hora.</p>
      <p class="assinatura-militar-logado">Logado como: <strong>${nomeCompletoMilitar(usuario)}</strong></p>
      <div id="preview-assinatura-chefe" class="assinatura-preview"></div>
      <button type="button" id="btn-assinar-chefe" class="btn btn-primary btn-block">✍️ Assinar eletronicamente</button>`;
    initAssinaturaChefe({
      hiddenId: "assinatura_json",
      btnId: "btn-assinar-chefe",
      previewId: "preview-assinatura-chefe",
      usuario,
    });
  } else if (isLogado()) {
    el.innerHTML = `<p class="hint">Apenas o Chefe de Socorro pode assinar. Seu perfil: <strong>${usuario.perfil}</strong></p>
      <p class="hint">A assinatura poderá ser feita depois, ao abrir a vistoria no histórico.</p>`;
  } else {
    el.innerHTML = `<p class="hint">Faça login como Chefe de Socorro para assinar.</p>`;
  }
}

renderSecaoAssinaturaChefe();

const rubricaCanvas = initRubricaCanvas({
  canvasId: "canvas-rubrica",
  hiddenId: "rubrica_solicitante",
  clearBtnId: "btn-limpar-rubrica",
});

function getRespostas() {
  const respostas = {};
  form.querySelectorAll('input[type="radio"]:checked').forEach((el) => {
    if (el.name.startsWith("q_")) respostas[el.name] = el.value;
  });
  return respostas;
}

function classeRisco(nivel) {
  if (nivel === "ALTO") return "preview-alto";
  if (nivel === "MÉDIO") return "preview-medio";
  return "preview-baixo";
}

function atualizarPreview() {
  const r = calcularResultadoQuestionario(getRespostas());
  preview.classList.remove("hidden", "preview-alto", "preview-medio", "preview-baixo");
  preview.classList.add(classeRisco(r.recomendacao));
  document.getElementById("preview-total").textContent = r.pontuacao_total;
  document.getElementById("preview-recomendacao").textContent = r.recomendacao;
  document.getElementById("preview-recomendacao").className = `preview-label ${classeRisco(r.recomendacao)}`;
  document.getElementById("preview-texto").textContent = r.justificativa;
  document.getElementById("preview-somatorio").innerHTML = renderSomatorioHtml(r);
  preview.querySelector(".preview-score small").textContent = `/ ${r.pontuacao_maxima} respostas SIM`;
}

form.querySelectorAll('input[type="radio"]').forEach((i) => i.addEventListener("change", atualizarPreview));
atualizarPreview();

let fotosVistoria = initFotosVistoria({
  maxFotos: 5,
  btnCameraId: "btn-foto-camera",
  btnGaleriaId: "btn-foto-galeria",
});

const tipoSelect = document.getElementById("tipo-ocorrencia");
const blocoVistoria = document.getElementById("bloco-vistoria");
const blocoQueda = document.getElementById("bloco-queda");

function aplicarTipoOcorrencia() {
  if (!tipoSelect || !blocoVistoria || !blocoQueda) return;
  const queda = tipoSelect.value === "queda";
  blocoVistoria.classList.toggle("somente-fotos", queda);
  blocoQueda.classList.toggle("hidden", !queda);
  blocoQueda.querySelectorAll("input, textarea, select").forEach((el) => {
    el.disabled = !queda;
    if (el.name === "descricao_queda") el.required = queda;
  });
  blocoVistoria.querySelectorAll("input, textarea, select").forEach((el) => {
    if (el.closest("#secao-fotos")) return;
    el.disabled = queda;
  });
  if (queda && preview) preview.classList.add("hidden");
}

if (tipoSelect) {
  tipoSelect.addEventListener("change", () => {
    aplicarTipoOcorrencia();
    if (tipoSelect.value !== "queda") atualizarPreview();
  });
  aplicarTipoOcorrencia();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (rubricaCanvas) rubricaCanvas.exportRubrica();

  const fd = new FormData(form);
  const queda = fd.get("tipo_ocorrencia") === "queda";
  const respostas = queda ? {} : getRespostas();
  const resultado = queda
    ? {
        pontuacao_total: 0,
        recomendacao: "QUEDA",
        justificativa: "Ocorrência com queda de árvores.",
      }
    : calcularResultadoQuestionario(respostas);
  const fotos = await fotosVistoria.toBase64();

  let assinatura = null;
  const assinRaw = fd.get("assinatura_json");
  if (assinRaw) {
    try { assinatura = JSON.parse(assinRaw); } catch (_) {}
  }

  let rubrica = null;
  const rubImg = fd.get("rubrica_solicitante");
  if (rubImg) {
    rubrica = {
      imagem: rubImg,
      nome: fd.get("solicitante"),
      data_hora: new Date().toLocaleString("pt-BR"),
    };
  }

  let v;
  try {
    v = criarVistoria({
      solicitante: fd.get("solicitante"),
      cpf_solicitante: fd.get("cpf_solicitante"),
      endereco: fd.get("endereco"),
      contato_telefonico: formatarTelefone(fd.get("contato_telefonico")) || null,
      recursos_adicionais: String(fd.get("recursos_adicionais") || "").trim() || null,
      forma_acionamento: fd.get("forma_acionamento"),
      protocolo: fd.get("protocolo"),
      tipo_ocorrencia: fd.get("tipo_ocorrencia") || "vistoria",
      queda: queda
        ? {
            quantidade: fd.get("quantidade_arvores"),
            onde_caiu: fd.get("onde_caiu"),
            vitimas: fd.get("vitimas"),
            acao: fd.get("acao_guarnicao"),
          }
        : null,
      descricao_ocorrencia: queda
        ? String(fd.get("descricao_queda") || "").trim() || null
        : String(fd.get("descricao_ocorrencia") || "").trim() || null,
      natureza_ocorrencia: queda ? "Ocorrência com Queda de Árvores" : fd.get("natureza_ocorrencia"),
      observacoes: queda ? fd.get("acao_guarnicao") : fd.get("observacoes"),
      especie: fd.get("especie"),
      resultado_especie: fd.get("resultado_especie"),
      especie_status: fd.get("especie_status"),
      especie_catalogo_id: fd.get("especie_catalogo_id"),
      foto_especie: fd.get("foto_especie") || null,
      questionario: respostas,
      fotos,
      rubrica,
      assinatura,
      ...resultado,
    });
  } catch (err) {
    alert(err.message || "Erro ao salvar vistoria.");
    return;
  }
  location.href = `lista.html?salva=${v.id}#vistoria-${v.id}`;
});
