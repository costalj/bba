document.getElementById("checklist").innerHTML = renderChecklistHtml();

const form = document.getElementById("form-viatura");
const preview = document.getElementById("preview-resultado");
const usuario = getUsuario();
const totalItens = totalItensChecklistViatura();
const selectViatura = document.getElementById("select-viatura");
const placaViatura = document.getElementById("placa-viatura");
const tipoViatura = document.getElementById("tipo-viatura");
const dadosViatura = document.getElementById("dados-viatura");
const cadastroViaturas = listarCadastroViaturas();

selectViatura.innerHTML = '<option value="">Selecione…</option>' +
  cadastroViaturas.map((v) =>
    `<option value="${v.id}">${v.ar} — ${v.marca} ${v.modelo}</option>`
  ).join("");
dadosViatura.textContent = cadastroViaturas.length
  ? "Selecione uma viatura cadastrada."
  : "Cadastre uma viatura nas configurações do Admin.";

selectViatura.addEventListener("change", () => {
  const viatura = cadastroViaturas.find((v) => v.id === parseInt(selectViatura.value, 10));
  placaViatura.value = viatura?.placa || "";
  tipoViatura.value = viatura
    ? [viatura.ar, viatura.marca, viatura.modelo].filter(Boolean).join(" · ")
    : "";
  dadosViatura.textContent = viatura
    ? `${viatura.ar} · ${viatura.placa} · ${viatura.marca} ${viatura.modelo}`
    : "Selecione uma viatura cadastrada.";
});

const condutorEl = document.getElementById("condutor-logado");
if (condutorEl) {
  condutorEl.innerHTML = `<strong>${nomePostoGuerra(usuario)}</strong>`;
}

function renderSecaoAssinaturaCondutor() {
  const el = document.getElementById("secao-assinatura-condutor");
  if (!el) return;
  if (podeAssinarVistoriaViatura()) {
    el.innerHTML = `
      <p class="hint">Assinatura eletrônica com seu usuário logado, data e hora.</p>
      <p class="assinatura-militar-logado">Logado como: <strong>${nomePostoGuerra(usuario)}</strong> (${usuario.perfil})</p>
      <div id="preview-assinatura-condutor" class="assinatura-preview"></div>
      <button type="button" id="btn-assinar-condutor" class="btn btn-primary btn-block">✍️ Assinar eletronicamente</button>`;
    initAssinaturaCondutor({
      hiddenId: "assinatura_json",
      btnId: "btn-assinar-condutor",
      previewId: "preview-assinatura-condutor",
      usuario,
    });
  } else if (isLogado()) {
    el.innerHTML = `<p class="hint">Apenas Condutor de viatura, Chefe de Socorro ou Comandante de guarnição podem assinar. Seu perfil: <strong>${usuario.perfil}</strong></p>
      <p class="hint">A assinatura poderá ser feita depois, ao abrir a vistoria no histórico.</p>`;
  } else {
    el.innerHTML = `<p class="hint">Faça login com perfil autorizado para assinar.</p>`;
  }
}

renderSecaoAssinaturaCondutor();

function atualizarPreview() {
  const r = calcularResultadoViatura(getRespostasChecklist(form));
  const cls = classeResultadoViatura(r.recomendacao);
  preview.classList.remove("hidden", "preview-aprovada", "preview-restricoes", "preview-impedida");
  preview.classList.add(cls);
  document.getElementById("preview-total").textContent = r.pontuacao_total;
  document.getElementById("preview-recomendacao").textContent = r.recomendacao;
  document.getElementById("preview-recomendacao").className = `preview-label ${cls}`;
  document.getElementById("preview-texto").textContent = r.justificativa;
  preview.querySelector(".preview-score small").textContent = `/ ${totalItens} não conformes`;
}

form.querySelectorAll('input[type="radio"]').forEach((i) => i.addEventListener("change", atualizarPreview));
atualizarPreview();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const checklist = getRespostasChecklist(form);
  const resultado = calcularResultadoViatura(checklist);

  let assinatura = null;
  const assinRaw = fd.get("assinatura_json");
  if (assinRaw) {
    try {
      assinatura = JSON.parse(assinRaw);
    } catch (_) {}
  }

  const v = criarVistoriaViatura({
    placa: String(fd.get("placa") || "").trim().toUpperCase(),
    tipo_viatura: fd.get("tipo_viatura") || "",
    km: fd.get("km") || "",
    condutor: nomePostoGuerra(usuario),
    observacoes: fd.get("observacoes") || "",
    checklist,
    assinatura,
    ...resultado,
  });
  location.href = `lista.html?salva=${v.id}#vistoria-${v.id}`;
});
