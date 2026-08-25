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

async function hashSenha(senha) {
  const buf = new TextEncoder().encode(senha);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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
