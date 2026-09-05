if (!exigirAdmin()) throw new Error("unauthorized");

const modalEditar = document.getElementById("modal-editar-usuario");
const formEditar = document.getElementById("form-editar-usuario");
const editErro = document.getElementById("edit-erro");
const modalViatura = document.getElementById("modal-editar-viatura");
const formEditarViatura = document.getElementById("form-editar-viatura");
const adminHub = document.getElementById("admin-hub");

function abrirPainelAdmin(nome) {
  adminHub.classList.add("hidden");
  document.querySelectorAll(".admin-painel").forEach((painel) => painel.classList.add("hidden"));
  document.getElementById(`painel-${nome}`)?.classList.remove("hidden");
  history.replaceState(null, "", `#${nome}`);
}

function abrirHubAdmin() {
  document.querySelectorAll(".admin-painel").forEach((painel) => painel.classList.add("hidden"));
  adminHub.classList.remove("hidden");
  history.replaceState(null, "", "admin.html");
}

document.querySelectorAll(".admin-hub-card").forEach((btn) => {
  btn.onclick = () => abrirPainelAdmin(btn.dataset.painel);
});
document.querySelectorAll(".btn-voltar-admin").forEach((btn) => {
  btn.onclick = abrirHubAdmin;
});

document.getElementById("select-posto").innerHTML = POSTOS.map((p) => `<option>${p}</option>`).join("");
document.getElementById("select-perfil").innerHTML = PERFIS.filter((p) => p !== "Administrador")
  .map((p) => `<option>${p}</option>`).join("");
document.getElementById("edit-posto").innerHTML = POSTOS.map((p) => `<option>${p}</option>`).join("");
document.getElementById("edit-perfil").innerHTML = PERFIS.map((p) => `<option>${p}</option>`).join("");

function escAttr(s) {
  return String(s ?? "").replace(/"/g, "&quot;");
}

function abrirModalEditar(user) {
  editErro.classList.add("hidden");
  document.getElementById("edit-user-id").value = user.id;
  document.getElementById("edit-nome").value = user.nome || "";
  document.getElementById("edit-nome-guerra").value = user.nome_guerra || "";
  document.getElementById("edit-matricula").value = user.matricula || "";
  document.getElementById("edit-cpf").value = formatarCpf(user.cpf || "");
  document.getElementById("edit-posto").value = user.posto || POSTOS[0];
  document.getElementById("edit-perfil").value = user.perfil || PERFIS[1];
  modalEditar.classList.remove("hidden");
}

function fecharModalEditar() {
  modalEditar.classList.add("hidden");
}

function renderUsuarios() {
  const ul = document.getElementById("lista-usuarios");
  const users = listarUsuarios().filter((u) => u.ativo !== false);
  if (!users.length) {
    ul.innerHTML = "<li>Nenhum usuário cadastrado.</li>";
    return;
  }
  ul.innerHTML = users.map((u) => `
    <li class="usuario-item">
      <div>
        <strong>${u.posto} ${u.nome}</strong>
        <small>Mat. ${u.matricula} · CPF ${formatarCpf(u.cpf)}</small>
        <small class="usuario-perfil">${u.perfil}</small>
      </div>
      <div class="usuario-acoes">
        <button type="button" class="btn-editar" data-id="${u.id}" title="Editar usuário">✏️</button>
        <button type="button" class="btn-resetar" data-id="${u.id}" data-nome="${escAttr(u.nome)}" title="Resetar senha">🔑</button>
        ${u.perfil !== "Administrador" ? `<button type="button" class="btn-remover" data-id="${u.id}">✕</button>` : ""}
      </div>
    </li>`).join("");

  ul.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.onclick = () => {
      const user = getUsuarioPorId(parseInt(btn.dataset.id, 10));
      if (user) abrirModalEditar(user);
    };
  });

  ul.querySelectorAll(".btn-resetar").forEach((btn) => {
    btn.onclick = async () => {
      const nome = btn.dataset.nome || "usuário";
      const senha = prompt(`Nova senha para ${nome}:`);
      if (senha === null) return;
      const res = await resetarSenha(parseInt(btn.dataset.id, 10), senha);
      if (!res.ok) {
        alert(res.erro);
        return;
      }
      alert("Senha alterada com sucesso!");
    };
  });

  ul.querySelectorAll(".btn-remover").forEach((btn) => {
    btn.onclick = () => {
      if (!confirm("Desativar este usuário?")) return;
      if (!excluirUsuario(parseInt(btn.dataset.id, 10))) {
        alert("Não é possível remover o último administrador.");
        return;
      }
      renderUsuarios();
    };
  });
}

function renderViaturas() {
  const ul = document.getElementById("lista-viaturas-cadastradas");
  const lista = listarCadastroViaturas();
  if (!lista.length) {
    ul.innerHTML = "<li>Nenhuma viatura cadastrada.</li>";
    return;
  }
  ul.innerHTML = lista.map((v) => `
    <li class="usuario-item">
      <div>
        <strong>${v.ar} · ${v.placa}</strong>
        <small>${v.marca} ${v.modelo}</small>
      </div>
      <div class="usuario-acoes">
        <button type="button" class="btn-editar-viatura" data-id="${v.id}" title="Editar viatura">✏️</button>
        <button type="button" class="btn-remover btn-excluir-viatura" data-id="${v.id}" data-ar="${escAttr(v.ar)}" title="Excluir">✕</button>
      </div>
    </li>`).join("");

  ul.querySelectorAll(".btn-editar-viatura").forEach((btn) => {
    btn.onclick = () => {
      const v = lista.find((item) => item.id === parseInt(btn.dataset.id, 10));
      if (!v) return;
      document.getElementById("edit-viatura-id").value = v.id;
      document.getElementById("edit-ar").value = v.ar;
      document.getElementById("edit-placa").value = v.placa;
      document.getElementById("edit-marca").value = v.marca;
      document.getElementById("edit-modelo").value = v.modelo;
      document.getElementById("edit-viatura-erro").classList.add("hidden");
      modalViatura.classList.remove("hidden");
    };
  });

  ul.querySelectorAll(".btn-excluir-viatura").forEach((btn) => {
    btn.onclick = () => {
      if (!confirm(`Excluir a viatura ${btn.dataset.ar}?`)) return;
      excluirCadastroViatura(parseInt(btn.dataset.id, 10));
      renderViaturas();
    };
  });
}

document.getElementById("btn-cancelar-edicao").onclick = fecharModalEditar;
modalEditar.addEventListener("click", (e) => {
  if (e.target === modalEditar) fecharModalEditar();
});

document.getElementById("btn-cancelar-viatura").onclick = () => {
  modalViatura.classList.add("hidden");
};
modalViatura.addEventListener("click", (e) => {
  if (e.target === modalViatura) modalViatura.classList.add("hidden");
});

document.getElementById("edit-cpf").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  e.target.value = v;
});

document.getElementById("cpf").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  e.target.value = v;
});

document.getElementById("form-usuario").onsubmit = async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const erro = document.getElementById("form-erro");
  erro.classList.add("hidden");

  const res = await criarUsuario({
    nome: fd.get("nome"),
    nome_guerra: fd.get("nome_guerra"),
    matricula: fd.get("matricula"),
    cpf: fd.get("cpf"),
    posto: fd.get("posto"),
    perfil: fd.get("perfil"),
    senha: fd.get("senha"),
  });

  if (!res.ok) {
    erro.textContent = res.erro;
    erro.classList.remove("hidden");
    return;
  }

  e.target.reset();
  renderUsuarios();
  alert("Usuário cadastrado com sucesso!");
};

formEditar.onsubmit = async (e) => {
  e.preventDefault();
  editErro.classList.add("hidden");
  const fd = new FormData(formEditar);
  const id = parseInt(fd.get("user_id"), 10);
  const res = await atualizarUsuario(id, {
    nome: fd.get("nome"),
    nome_guerra: fd.get("nome_guerra"),
    matricula: fd.get("matricula"),
    cpf: fd.get("cpf"),
    posto: fd.get("posto"),
    perfil: fd.get("perfil"),
  });

  if (!res.ok) {
    editErro.textContent = res.erro;
    editErro.classList.remove("hidden");
    return;
  }

  fecharModalEditar();
  renderUsuarios();
  alert("Usuário atualizado com sucesso!");
};

document.getElementById("form-viatura-cadastro").onsubmit = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const erro = document.getElementById("viatura-erro");
  const res = cadastrarViatura({
    ar: fd.get("ar"),
    placa: fd.get("placa"),
    marca: fd.get("marca"),
    modelo: fd.get("modelo"),
  });
  if (!res.ok) {
    erro.textContent = res.erro;
    erro.classList.remove("hidden");
    return;
  }
  erro.classList.add("hidden");
  e.target.reset();
  renderViaturas();
};

formEditarViatura.onsubmit = (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const erro = document.getElementById("edit-viatura-erro");
  const res = atualizarCadastroViatura(parseInt(fd.get("viatura_id"), 10), {
    ar: fd.get("ar"),
    placa: fd.get("placa"),
    marca: fd.get("marca"),
    modelo: fd.get("modelo"),
  });
  if (!res.ok) {
    erro.textContent = res.erro;
    erro.classList.remove("hidden");
    return;
  }
  modalViatura.classList.add("hidden");
  renderViaturas();
};

renderUsuarios();
renderViaturas();
if (location.hash === "#usuarios") abrirPainelAdmin("usuarios");
if (location.hash === "#viaturas") abrirPainelAdmin("viaturas");
