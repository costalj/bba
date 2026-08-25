const VIATURAS_CADASTRO_KEY = "bba_cadastro_viaturas";

function listarCadastroViaturas() {
  try {
    return JSON.parse(localStorage.getItem(VIATURAS_CADASTRO_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarCadastroViaturas(lista) {
  localStorage.setItem(VIATURAS_CADASTRO_KEY, JSON.stringify(lista));
}

function cadastrarViatura(dados) {
  const lista = listarCadastroViaturas();
  const ar = String(dados.ar || "").trim().toUpperCase();
  const placa = String(dados.placa || "").replace(/[^a-z0-9]/gi, "").toUpperCase();
  const marca = String(dados.marca || "").trim();
  const modelo = String(dados.modelo || "").trim();
  if (!ar || !placa || !marca || !modelo) {
    return { ok: false, erro: "Preencha AR, placa, marca e modelo." };
  }
  if (lista.some((v) => v.ar === ar || v.placa === placa)) {
    return { ok: false, erro: "AR ou placa já cadastrada." };
  }
  const id = lista.length ? Math.max(...lista.map((v) => v.id)) + 1 : 1;
  lista.push(touchSyncMeta({ id, ar, placa, marca, modelo }));
  salvarCadastroViaturas(lista);
  return { ok: true };
}

function atualizarCadastroViatura(id, dados) {
  const lista = listarCadastroViaturas();
  const idx = lista.findIndex((v) => v.id === id);
  if (idx === -1) return { ok: false, erro: "Viatura não encontrada." };
  const ar = String(dados.ar || "").trim().toUpperCase();
  const placa = String(dados.placa || "").replace(/[^a-z0-9]/gi, "").toUpperCase();
  const marca = String(dados.marca || "").trim();
  const modelo = String(dados.modelo || "").trim();
  if (!ar || !placa || !marca || !modelo) {
    return { ok: false, erro: "Preencha AR, placa, marca e modelo." };
  }
  if (lista.some((v) => v.id !== id && (v.ar === ar || v.placa === placa))) {
    return { ok: false, erro: "AR ou placa já cadastrada em outra viatura." };
  }
  lista[idx] = touchSyncMeta({ id, ar, placa, marca, modelo });
  salvarCadastroViaturas(lista);
  return { ok: true };
}

function excluirCadastroViatura(id) {
  const lista = listarCadastroViaturas();
  const item = lista.find((v) => v.id === id);
  if (item && typeof marcarExclusaoSync === "function") {
    marcarExclusaoSync("cadastro_viaturas", item);
  }
  salvarCadastroViaturas(lista.filter((v) => v.id !== id));
}
