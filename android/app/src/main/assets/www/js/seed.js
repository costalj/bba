(function () {
  const SEED_KEY = "bba_seed_version";

  function limparCpfSeed(cpf) {
    return String(cpf || "").replace(/\D/g, "");
  }

  function mergeUsuariosSeed(locais, seedUsuarios) {
    const lista = Array.isArray(locais) ? locais.map((u) => ({ ...u })) : [];
    for (const su of seedUsuarios) {
      const cpf = limparCpfSeed(su.cpf);
      const idx = lista.findIndex((u) => limparCpfSeed(u.cpf) === cpf);
      if (idx === -1) {
        lista.push({ ...su });
      } else {
        lista[idx] = { ...lista[idx], ...su, id: lista[idx].id || su.id };
      }
    }
    return lista;
  }

  function mergeVistoriasSeed(locais, seedVistorias) {
    const map = new Map();
    (Array.isArray(locais) ? locais : []).forEach((v) => {
      if (v && v.id != null) map.set(String(v.id), v);
    });
    (Array.isArray(seedVistorias) ? seedVistorias : []).forEach((v) => {
      if (!v || v.id == null) return;
      const id = String(v.id);
      if (!map.has(id)) {
        map.set(id, v);
      }
    });
    return Array.from(map.values()).sort((a, b) => Number(b.id) - Number(a.id));
  }

  function aplicarSeedInicial() {
    if (typeof SEED_DATA === "undefined") return;

    if (
      SEED_DATA.viaturas_cadastradas &&
      SEED_DATA.viaturas_cadastradas.length &&
      !localStorage.getItem("bba_cadastro_viaturas")
    ) {
      localStorage.setItem(
        "bba_cadastro_viaturas",
        JSON.stringify(SEED_DATA.viaturas_cadastradas)
      );
    }

    const versaoAtual = localStorage.getItem(SEED_KEY);
    const versaoMudou = versaoAtual !== SEED_DATA.version;

    let usuarios = [];
    try {
      usuarios = JSON.parse(localStorage.getItem("bba_usuarios") || "[]");
    } catch {
      usuarios = [];
    }

    if (SEED_DATA.usuarios && SEED_DATA.usuarios.length) {
      const merged = mergeUsuariosSeed(usuarios, SEED_DATA.usuarios);
      localStorage.setItem("bba_usuarios", JSON.stringify(merged));
      usuarios = merged;
    } else if (!usuarios.length && typeof initUsuariosPadrao === "function") {
      /* initUsuariosPadrao é async — login.html chama depois */
    }

    let vistorias = [];
    try {
      vistorias = JSON.parse(localStorage.getItem("bba_vistorias") || "[]");
    } catch {
      vistorias = [];
    }

    if (SEED_DATA.vistorias && SEED_DATA.vistorias.length) {
      const mergedV = mergeVistoriasSeed(vistorias, SEED_DATA.vistorias);
      if (mergedV.length !== vistorias.length || versaoMudou) {
        localStorage.setItem("bba_vistorias", JSON.stringify(mergedV));
      }
    }

    if (SEED_DATA.pops && SEED_DATA.pops.length && versaoMudou) {
      localStorage.setItem("bba_pops", JSON.stringify(SEED_DATA.pops));
    }

    if (versaoMudou) {
      localStorage.removeItem("bba_sessao");
      localStorage.setItem(SEED_KEY, SEED_DATA.version);
    } else if (!versaoAtual && SEED_DATA.version) {
      localStorage.setItem(SEED_KEY, SEED_DATA.version);
    }
  }

  window.aplicarSeedInicial = aplicarSeedInicial;
  window.mergeUsuariosSeed = mergeUsuariosSeed;
  window.mergeVistoriasSeed = mergeVistoriasSeed;

  aplicarSeedInicial();
})();
