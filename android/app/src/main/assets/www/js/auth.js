const USER_KEY = "bba_sessao";
const USERS_KEY = "bba_usuarios";

const POSTOS = [
  "Soldado",
  "Cabo",
  "3° Sargento",
  "2° Sargento",
  "1° Sargento",
  "Subtenente",
  "2° Tenente",
  "1° Tenente",
  "Capitão",
  "Major",
  "Tenente-coronel",
  "Coronel",
];

const PERFIS = [
  "Administrador",
  "Chefe de Socorro",
  "Condutor de viatura",
  "Comandante de guarnição",
];

function limparCpf(cpf) {
  return String(cpf || "").replace(/\D/g, "");
}

function formatarCpf(cpf) {
  const c = limparCpf(cpf);
  if (c.length !== 11) return cpf;
  return c.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/** SHA-256 hex — fallback para WebView file:// (sem crypto.subtle). */
function sha256Hex(message) {
  const K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ]);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const bytes = new TextEncoder().encode(String(message));
  const bitLen = bytes.length * 8;
  const padLen = ((bytes.length + 9 + 63) >> 6) << 6;
  const buf = new Uint8Array(padLen);
  buf.set(bytes);
  buf[bytes.length] = 0x80;
  const view = new DataView(buf.buffer);
  view.setUint32(padLen - 4, bitLen, false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;
  const w = new Uint32Array(64);

  for (let off = 0; off < padLen; off += 64) {
    for (let i = 0; i < 16; i++) w[i] = view.getUint32(off + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let hh = h7;
    for (let i = 0; i < 64; i++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g;
      g = f;
      f = e;
      e = (d + t1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) >>> 0;
    }
    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + hh) >>> 0;
  }

  return [h0, h1, h2, h3, h4, h5, h6, h7]
    .map((n) => n.toString(16).padStart(8, "0"))
    .join("");
}

async function hashSenha(senha) {
  const texto = String(senha ?? "");
  if (
    typeof crypto !== "undefined" &&
    crypto.subtle &&
    typeof crypto.subtle.digest === "function"
  ) {
    try {
      const buf = new TextEncoder().encode(texto);
      const hash = await crypto.subtle.digest("SHA-256", buf);
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    } catch (_) {
      /* WebView file:// — crypto.subtle indisponível */
    }
  }
  if (typeof sha256Hex === "function") {
    return sha256Hex(texto);
  }
  throw new Error("Não foi possível calcular o hash da senha.");
}

function listarUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function salvarUsuarios(lista) {
  localStorage.setItem(USERS_KEY, JSON.stringify(lista));
}

async function initUsuariosPadrao() {
  if (listarUsuarios().length) return;
  const admin = touchSyncMeta({
    id: 1,
    nome: "Administrador",
    nome_guerra: "Admin",
    matricula: "0001",
    cpf: "00000000000",
    posto: "Capitão",
    perfil: "Administrador",
    senha_hash: await hashSenha("admin123"),
    ativo: true,
  });
  salvarUsuarios([admin]);
}

function getUsuario() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

function setUsuario(user) {
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  const { senha_hash, ...safe } = user;
  localStorage.setItem(USER_KEY, JSON.stringify(safe));
}

function caminhoLogin() {
  const rel = (location.href.split("/www/")[1] || "index.html").split("?")[0];
  const depth = rel.includes("/") ? "../" : "";
  return `${depth}login.html`;
}

function logoutUsuario(redirecionar = true) {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem("bba_bem_vindo");
  if (redirecionar) {
    location.replace(caminhoLogin());
  }
}

function isLogado() {
  return getUsuario() !== null;
}

function isAdmin() {
  const u = getUsuario();
  return u && u.perfil === "Administrador";
}

function isChefeSocorro() {
  const u = getUsuario();
  return u && u.perfil === "Chefe de Socorro";
}

function isCondutorViatura() {
  const u = getUsuario();
  return u && u.perfil === "Condutor de viatura";
}

const PERFIS_ASSINATURA_VIATURA = [
  "Condutor de viatura",
  "Chefe de Socorro",
  "Comandante de guarnição",
];

function podeAssinarVistoriaViatura() {
  const u = getUsuario();
  return u && PERFIS_ASSINATURA_VIATURA.includes(u.perfil);
}

function nomeCompletoMilitar(u) {
  if (!u) return "";
  return u.posto ? `${u.posto} ${u.nome}` : u.nome;
}

function nomeGuerraExibicao(u) {
  if (!u) return "";
  const guerra = String(u.nome_guerra || "").trim();
  if (guerra) return guerra;
  return String(u.nome || "").trim();
}

function nomePostoGuerra(u) {
  if (!u) return "";
  const posto = (u.posto || "").trim();
  const nome = nomeGuerraExibicao(u);
  if (posto && nome) return `${posto} ${nome}`;
  return posto || nome;
}

async function login(cpf, senha) {
  if (typeof aplicarSeedInicial === "function") {
    aplicarSeedInicial();
  }
  await initUsuariosPadrao();
  const cpfLimpo = limparCpf(cpf);
  const user = listarUsuarios().find(
    (u) => limparCpf(u.cpf) === cpfLimpo && u.ativo !== false
  );
  if (!user) return { ok: false, erro: "CPF ou senha inválidos." };
  const hash = await hashSenha(senha);
  if (hash !== user.senha_hash) return { ok: false, erro: "CPF ou senha inválidos." };
  setUsuario(user);
  return { ok: true, user };
}

function exigirLogin() {
  if (typeof aplicarSeedInicial === "function") {
    aplicarSeedInicial();
  }
  if (!isLogado()) {
    const rel = (location.href.split("/www/")[1] || "index.html").split("?")[0];
    const depth = rel.includes("/") ? "../" : "";
    location.href = `${depth}login.html?next=${encodeURIComponent(rel)}`;
    return false;
  }
  return true;
}

function exigirAdmin() {
  if (!exigirLogin()) return false;
  if (!isAdmin()) {
    alert("Acesso restrito ao administrador.");
    location.href = "index.html";
    return false;
  }
  return true;
}

async function criarUsuario(dados) {
  const lista = listarUsuarios();
  const cpfLimpo = limparCpf(dados.cpf);
  if (lista.some((u) => limparCpf(u.cpf) === cpfLimpo)) {
    return { ok: false, erro: "CPF já cadastrado." };
  }
  const id = lista.length ? Math.max(...lista.map((u) => u.id)) + 1 : 1;
  const user = touchSyncMeta({
    id,
    nome: dados.nome.trim(),
    nome_guerra: String(dados.nome_guerra || "").trim(),
    matricula: dados.matricula.trim(),
    cpf: cpfLimpo,
    posto: dados.posto,
    perfil: dados.perfil,
    senha_hash: await hashSenha(dados.senha),
    ativo: true,
  });
  lista.push(user);
  salvarUsuarios(lista);
  return { ok: true, user };
}

function excluirUsuario(id) {
  const lista = listarUsuarios();
  const idx = lista.findIndex((u) => u.id === id);
  if (idx === -1) return false;
  if (lista[idx].perfil === "Administrador" && lista.filter((u) => u.perfil === "Administrador" && u.ativo !== false).length <= 1) {
    return false;
  }
  lista[idx].ativo = false;
  touchSyncMeta(lista[idx]);
  salvarUsuarios(lista);
  return true;
}

function getUsuarioPorId(id) {
  return listarUsuarios().find((u) => u.id === id);
}

async function atualizarUsuario(id, dados) {
  const lista = listarUsuarios();
  const idx = lista.findIndex((u) => u.id === id);
  if (idx === -1) {
    return { ok: false, erro: "Usuário não encontrado." };
  }

  const cpfLimpo = limparCpf(dados.cpf);
  if (
    lista.some(
      (u) => u.id !== id && limparCpf(u.cpf) === cpfLimpo && u.ativo !== false
    )
  ) {
    return { ok: false, erro: "CPF já cadastrado." };
  }

  const atual = lista[idx];
  const novoPerfil = String(dados.perfil || "").trim();
  if (!dados.nome?.trim() || !dados.nome_guerra?.trim() || !dados.matricula?.trim() || cpfLimpo.length !== 11 || !novoPerfil) {
    return { ok: false, erro: "Preencha todos os campos corretamente." };
  }

  if (atual.perfil === "Administrador" && novoPerfil !== "Administrador") {
    const admins = lista.filter((u) => u.perfil === "Administrador" && u.ativo !== false);
    if (admins.length <= 1) {
      return { ok: false, erro: "Não é possível alterar o perfil do último administrador." };
    }
  }

  lista[idx] = touchSyncMeta({
    ...atual,
    nome: dados.nome.trim(),
    nome_guerra: String(dados.nome_guerra || "").trim(),
    matricula: dados.matricula.trim(),
    cpf: cpfLimpo,
    posto: dados.posto,
    perfil: novoPerfil,
  });
  salvarUsuarios(lista);

  const sessao = getUsuario();
  if (sessao && sessao.id === id) {
    setUsuario(lista[idx]);
  }

  return { ok: true, user: lista[idx] };
}

async function resetarSenha(id, novaSenha) {
  const senha = String(novaSenha || "").trim();
  if (senha.length < 4) {
    return { ok: false, erro: "A senha deve ter no mínimo 4 caracteres." };
  }
  const lista = listarUsuarios();
  const idx = lista.findIndex((u) => u.id === id);
  if (idx === -1) {
    return { ok: false, erro: "Usuário não encontrado." };
  }
  lista[idx].senha_hash = await hashSenha(senha);
  touchSyncMeta(lista[idx]);
  salvarUsuarios(lista);
  return { ok: true };
}
