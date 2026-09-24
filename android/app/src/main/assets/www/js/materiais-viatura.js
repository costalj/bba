const DB_MATERIAIS_KEY = "bba_conferencias_materiais";
const DIAS_SEMANA = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

function escHtmlMaterial(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/"/g, "&quot;");
}

function listarConferenciasMateriais() {
  try {
    return JSON.parse(localStorage.getItem(DB_MATERIAIS_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarConferenciasMateriais(lista) {
  localStorage.setItem(DB_MATERIAIS_KEY, JSON.stringify(lista));
}

function obterConferenciaMateriais(id) {
  return listarConferenciasMateriais().find((item) => String(item.id) === String(id));
}

function dataExtensoMaterial(iso) {
  const [ano, mes, dia] = String(iso || "").split("-");
  if (!ano || !mes || !dia) return iso || "";
  return `${dia}/${mes}/${ano}`;
}

function diaSemanaMaterial(iso) {
  const data = new Date(`${iso}T12:00:00`);
  const idx = (data.getDay() + 6) % 7;
  return DIAS_SEMANA[idx] || "";
}

function qtdLabelMaterial(qtd) {
  const texto = String(qtd ?? "").trim();
  if (/^\d+$/.test(texto)) return String(Number(texto)).padStart(2, "0");
  return texto || "—";
}

function criarConferenciaMateriais(dados) {
  const lista = listarConferenciasMateriais();
  const id = lista.length ? Math.max(...lista.map((item) => Number(item.id) || 0)) + 1 : 1;
  const agora = new Date();
  const registro = {
    id,
    created_at: agora.toLocaleString("pt-BR"),
    ...dados,
    dia_semana: diaSemanaMaterial(dados.data_servico),
  };
  lista.unshift(registro);
  lista.sort((a, b) => String(b.data_servico).localeCompare(String(a.data_servico)) || b.id - a.id);
  salvarConferenciasMateriais(lista);
  return registro;
}

function htmlCardMaterial(item, destaque) {
  return `<li>
    <a href="materiais-detalhe.html?id=${item.id}" class="material-card${destaque ? " material-card-destaque" : ""}" id="conferencia-${item.id}">
      <span class="material-card-data">${escHtmlMaterial(dataExtensoMaterial(item.data_servico))}</span>
      <span class="material-card-semana">${escHtmlMaterial(item.dia_semana)}</span>
      <span class="material-card-rotulo">Chefe de socorro</span>
      <strong class="material-card-chefe">${escHtmlMaterial(item.chefe_socorro)}</strong>
    </a>
  </li>`;
}

function htmlDetalheMaterial(item) {
  const servico = [
    ["Contato funcional", item.contato],
    ["Condutor", item.condutor],
    ["Comandante de guarnição", item.comandante],
    ["Oficial de dia", item.oficial_dia],
  ]
    .filter(([, valor]) => valor)
    .map(([rotulo, valor]) => `<dt>${rotulo}</dt><dd>${escHtmlMaterial(valor)}</dd>`)
    .join("");
  const vtrs = (item.viaturas || [])
    .map(
      (v) =>
        `<li><strong>AR ${escHtmlMaterial(v.ar)}</strong><span>KM ${escHtmlMaterial(v.km || "—")}</span><span>K7 ${escHtmlMaterial(v.k7 || "—")}</span></li>`
    )
    .join("");
  const fotos = (item.fotos || [])
    .map((src) => `<img src="${src}" alt="Foto dos materiais">`)
    .join("");
  const secoes = (item.secoes || [])
    .map((secao) => {
      const itens = (secao.itens || [])
        .map((mat) => {
          const qtd = mat.status === "alterado" && mat.qtd_nova ? mat.qtd_nova : mat.qtd;
          const tag = mat.status
            ? `<small class="material-status-tag tag-${escHtmlMaterial(mat.status)}">${escHtmlMaterial(mat.status)}</small>`
            : "";
          const extra = mat.status === "alterado" && mat.obs_nova
            ? `<small class="material-obs">${escHtmlMaterial(mat.obs_nova)}</small>`
            : "";
          return `<li><span class="material-qtd">${escHtmlMaterial(qtdLabelMaterial(qtd))}</span><span>${escHtmlMaterial(mat.nome)}${tag}${mat.obs ? `<small class="material-obs">${escHtmlMaterial(mat.obs)}</small>` : ""}${extra}</span></li>`;
        })
        .join("");
      return `<section class="info-card"><h3>${escHtmlMaterial(secao.titulo)}</h3><ul class="material-itens">${itens}</ul></section>`;
    })
    .join("");
  const assinaturas = item.assinaturas || {};
  const blocoAssinatura = (rotulo, dados) => {
    if (!dados) return "";
    const img = dados.imagem ? `<img src="${dados.imagem}" alt="Assinatura" class="rubrica-imagem">` : "";
    return `<p><strong>${rotulo}:</strong> ${escHtmlMaterial(dados.nome)}</p>${img}`;
  };
  const passagem = assinaturas.saindo || assinaturas.entrando
    ? `<section class="info-card"><h3>Passagem de serviço</h3>${blocoAssinatura("Saindo", assinaturas.saindo)}${blocoAssinatura("Entrando", assinaturas.entrando)}</section>`
    : "";
  return `
    <section class="material-card material-card-estatico">
      <span class="material-card-data">${escHtmlMaterial(dataExtensoMaterial(item.data_servico))}</span>
      <span class="material-card-semana">${escHtmlMaterial(item.dia_semana)}</span>
      <span class="material-card-rotulo">Chefe de socorro</span>
      <strong class="material-card-chefe">${escHtmlMaterial(item.chefe_socorro)}</strong>
    </section>
    <section class="info-card"><h3>Serviço</h3><dl class="detail-list">${servico}</dl></section>
    ${fotos ? `<section class="info-card"><h3>Fotos da conferência</h3><div class="material-fotos">${fotos}</div></section>` : ""}
    ${vtrs ? `<section class="info-card"><h3>Viaturas</h3><ul class="material-vtrs">${vtrs}</ul></section>` : ""}
    ${secoes}
    ${passagem}`;
}
