(function () {
  const SEED_KEY = "bba_seed_version";

  function limparCpfSeed(cpf) {
    return String(cpf || "").replace(/\D/g, "");
  }

  function obterVersaoSeed() {
    if (typeof SEED_META !== "undefined" && SEED_META.version) {
      return SEED_META.version;
    }
    if (typeof SEED_DATA !== "undefined" && SEED_DATA.version) {
      return SEED_DATA.version;
    }
    return null;
  }

  function obterUsuariosSeed() {
    if (typeof USUARIOS_SEED !== "undefined" && USUARIOS_SEED.length) {
      return USUARIOS_SEED;
    }
    if (typeof SEED_DATA !== "undefined" && SEED_DATA.usuarios && SEED_DATA.usuarios.length) {
      return SEED_DATA.usuarios;
    }
    return [];
  }

  function obterVistoriasSeed() {
    if (typeof VISTORIAS_SEED !== "undefined" && VISTORIAS_SEED.length) {
      return VISTORIAS_SEED;
    }
    if (typeof SEED_DATA !== "undefined" && SEED_DATA.vistorias) {
      return SEED_DATA.vistorias;
    }
    return [];
  }

  function obterVistoriasViaturasSeed() {
    if (typeof VISTORIAS_VIATURAS_SEED !== "undefined" && VISTORIAS_VIATURAS_SEED.length) {
      return VISTORIAS_VIATURAS_SEED;
    }
    if (typeof SEED_DATA !== "undefined" && SEED_DATA.vistorias_viaturas) {
      return SEED_DATA.vistorias_viaturas;
    }
    return [];
  }

  function obterViaturasCadastroSeed() {
    if (typeof VIATURAS_CADASTRO_SEED !== "undefined" && VIATURAS_CADASTRO_SEED.length) {
      return VIATURAS_CADASTRO_SEED;
    }
    if (typeof SEED_DATA !== "undefined" && SEED_DATA.viaturas_cadastradas) {
      return SEED_DATA.viaturas_cadastradas;
    }
    return [];
  }

  function obterPopsSeed() {
    if (typeof POPS_SEED !== "undefined" && POPS_SEED.length) {
      return POPS_SEED;
    }
    if (typeof SEED_DATA !== "undefined" && SEED_DATA.pops) {
      return SEED_DATA.pops;
    }
    return [];
  }

  function mergeUsuariosSeed(locais, seedUsuarios) {
    const lista = Array.isArray(locais) ? locais.map((u) => ({ ...u })) : [];
    for (const su of seedUsuarios) {
      const cpf = limparCpfSeed(su.cpf);
      const idx = lista.findIndex((u) => limparCpfSeed(u.cpf) === cpf);
      if (idx === -1) {
        lista.push({ ...su, cpf, ativo: su.ativo !== false });
      } else {
        lista[idx] = {
          ...lista[idx],
          ...su,
          id: lista[idx].id || su.id,
          cpf,
          senha_hash: su.senha_hash,
          ativo: su.ativo !== false,
        };
      }
    }
    return lista;
  }

  function mergePorId(locais, seedItens) {
    const map = new Map();
    (Array.isArray(locais) ? locais : []).forEach((item) => {
      if (item && item.id != null) map.set(String(item.id), item);
    });
    (Array.isArray(seedItens) ? seedItens : []).forEach((item) => {
      if (!item || item.id == null) return;
      const id = String(item.id);
      if (!map.has(id)) map.set(id, item);
    });
    return Array.from(map.values()).sort((a, b) => Number(b.id) - Number(a.id));
  }

  function lerJsonStorage(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
    } catch {
      return fallback;
    }
  }

  function aplicarSeedInicial() {
    const versaoSeed = obterVersaoSeed();
    const versaoAtual = localStorage.getItem(SEED_KEY);
    const versaoMudou = versaoSeed && versaoAtual !== versaoSeed;

    const seedUsuarios = obterUsuariosSeed();
    if (seedUsuarios.length) {
      const merged = mergeUsuariosSeed(lerJsonStorage("bba_usuarios", []), seedUsuarios);
      localStorage.setItem("bba_usuarios", JSON.stringify(merged));
    }

    const seedVistorias = obterVistoriasSeed();
    if (seedVistorias.length) {
      const locais = lerJsonStorage("bba_vistorias", []);
      const merged = mergePorId(locais, seedVistorias);
      if (merged.length !== locais.length || versaoMudou) {
        localStorage.setItem("bba_vistorias", JSON.stringify(merged));
      }
    }

    const seedViaturas = obterVistoriasViaturasSeed();
    if (seedViaturas.length) {
      const locais = lerJsonStorage("bba_vistorias_viaturas", []);
      const merged = mergePorId(locais, seedViaturas);
      if (merged.length !== locais.length || versaoMudou) {
        localStorage.setItem("bba_vistorias_viaturas", JSON.stringify(merged));
      }
    }

    const seedCadastro = obterViaturasCadastroSeed();
    if (seedCadastro.length) {
      const locais = lerJsonStorage("bba_cadastro_viaturas", []);
      const merged = mergePorId(locais, seedCadastro);
      if (merged.length !== locais.length || versaoMudou || !locais.length) {
        localStorage.setItem("bba_cadastro_viaturas", JSON.stringify(merged));
      }
    }

    const seedPops = obterPopsSeed();
    if (seedPops.length && versaoMudou) {
      localStorage.setItem("bba_pops", JSON.stringify(seedPops));
    }

    if (versaoMudou) {
      localStorage.removeItem("bba_sessao");
      localStorage.setItem(SEED_KEY, versaoSeed);
    } else if (!versaoAtual && versaoSeed) {
      localStorage.setItem(SEED_KEY, versaoSeed);
    }
  }

  window.aplicarSeedInicial = aplicarSeedInicial;
  window.mergeUsuariosSeed = mergeUsuariosSeed;
  window.mergeVistoriasSeed = mergePorId;

  aplicarSeedInicial();
})();
