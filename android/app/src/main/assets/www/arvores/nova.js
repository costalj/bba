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

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (rubricaCanvas) rubricaCanvas.exportRubrica();

  const fd = new FormData(form);
  const respostas = getRespostas();
  const resultado = calcularResultadoQuestionario(respostas);
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

  const v = criarVistoria({
    solicitante: fd.get("solicitante"),
    cpf_solicitante: fd.get("cpf_solicitante"),
    endereco: fd.get("endereco"),
    contato_telefonico: formatarTelefone(fd.get("contato_telefonico")) || null,
    recursos_adicionais: String(fd.get("recursos_adicionais") || "").trim() || null,
    forma_acionamento: fd.get("forma_acionamento"),
    protocolo: fd.get("protocolo"),
    natureza_ocorrencia: fd.get("natureza_ocorrencia"),
    descricao_ocorrencia: String(fd.get("descricao_ocorrencia") || "").slice(0, 100),
    especie: fd.get("especie"),
    observacoes: fd.get("observacoes"),
    questionario: respostas,
    fotos,
    rubrica,
    assinatura,
    ...resultado,
  });
  location.href = `lista.html?salva=${v.id}#vistoria-${v.id}`;
});
