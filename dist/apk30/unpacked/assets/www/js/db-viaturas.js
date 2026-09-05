const DB_VIATURAS_KEY = "bba_vistorias_viaturas";

function listarVistoriasViaturas() {
  try {
    return JSON.parse(localStorage.getItem(DB_VIATURAS_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarVistoriasViaturas(lista) {
  localStorage.setItem(DB_VIATURAS_KEY, JSON.stringify(lista));
}

function obterVistoriaViatura(id) {
  return listarVistoriasViaturas().find((v) => String(v.id) === String(id));
}

function gerarNumeroVistoriaViatura() {
  const ano = new Date().getFullYear();
  const seq =
    listarVistoriasViaturas().filter((v) => String(v.created_at || "").includes(String(ano)))
      .length + 1;
  return `V${String(seq).padStart(4, "0")}/${ano}`;
}

function numeroVistoriaViatura(v) {
  if (v.codigo) return v.codigo;
  const ano = new Date().getFullYear();
  return `V${String(v.id || 1).padStart(4, "0")}/${ano}`;
}

function criarVistoriaViatura(dados) {
  const lista = listarVistoriasViaturas();
  const id = lista.length ? Math.max(...lista.map((v) => v.id)) + 1 : 1;
  const codigo = gerarNumeroVistoriaViatura();
  const vistoria = touchSyncMeta({
    id,
    created_at: formatarDataHoraBrAgora(),
    codigo,
    assinatura: dados.assinatura || null,
    ...dados,
  });
  lista.unshift(vistoria);
  salvarVistoriasViaturas(lista);
  return vistoria;
}

function atualizarVistoriaViatura(id, dados) {
  const lista = listarVistoriasViaturas();
  const idx = lista.findIndex((v) => String(v.id) === String(id));
  if (idx === -1) return null;
  lista[idx] = touchSyncMeta({ ...lista[idx], ...dados });
  salvarVistoriasViaturas(lista);
  return lista[idx];
}

function assinarVistoriaViatura(id, usuario) {
  const assinatura = {
    nome: usuario.nome,
    posto: usuario.posto || "",
    matricula: usuario.matricula || "",
    cargo: usuario.perfil,
    perfil: usuario.perfil,
    data_hora: formatarDataHoraBrAgora(),
    assinado_por: nomePostoGuerra(usuario),
    tipo: "Assinatura eletrônica",
  };
  return atualizarVistoriaViatura(id, { assinatura });
}

function textoViatura(v) {
  const placa = String(v.placa || "").trim();
  const tipo = String(v.tipo_viatura || "").trim();
  if (placa && tipo) return `${placa} · ${tipo}`;
  return placa || tipo || "—";
}

function statusViatura(v) {
  if (v.status && String(v.status).trim()) return String(v.status).trim();
  return v.recomendacao || "—";
}

function classeItemViatura(rec) {
  if (rec === "IMPEDIDA") return "item-alto";
  if (rec === "APROVADA COM RESTRIÇÕES") return "item-medio";
  return "item-baixo";
}

function classeResultadoViaturaCard(rec) {
  if (rec === "IMPEDIDA") return "resultado-impedida";
  if (rec === "APROVADA COM RESTRIÇÕES") return "resultado-restricoes";
  return "resultado-aprovada";
}
