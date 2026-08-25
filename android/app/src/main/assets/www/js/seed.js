(function () {
  const SEED_KEY = "bba_seed_version";

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
    if (versaoAtual === SEED_DATA.version) return;

    if (SEED_DATA.usuarios && SEED_DATA.usuarios.length) {
      localStorage.setItem("bba_usuarios", JSON.stringify(SEED_DATA.usuarios));
    }
    if (SEED_DATA.vistorias && SEED_DATA.vistorias.length) {
      localStorage.setItem("bba_vistorias", JSON.stringify(SEED_DATA.vistorias));
    }
    if (SEED_DATA.pops && SEED_DATA.pops.length) {
      localStorage.setItem("bba_pops", JSON.stringify(SEED_DATA.pops));
    }

    localStorage.removeItem("bba_sessao");
    localStorage.setItem(SEED_KEY, SEED_DATA.version);
  }

  aplicarSeedInicial();
})();
