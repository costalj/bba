(function () {
  const SAIR_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>`;

  function initBemVindo() {
    if (sessionStorage.getItem("bba_bem_vindo") !== "1") return;
    sessionStorage.removeItem("bba_bem_vindo");
    if (typeof isLogado !== "function" || !isLogado()) return;

    const u = getUsuario();
    if (!u || typeof nomeGuerraExibicao !== "function") return;

    const main = document.querySelector("main.container");
    if (!main || main.querySelector(".bemvindo-banner")) return;

    const banner = document.createElement("div");
    banner.className = "bemvindo-banner";
    banner.setAttribute("role", "status");
    banner.innerHTML = `
      <span class="bemvindo-icon" aria-hidden="true">👋</span>
      <div class="bemvindo-texto">
        <strong>Bem-vindo, ${nomeGuerraExibicao(u)}!</strong>
        <span>Função: ${u.perfil}</span>
      </div>`;
    main.insertBefore(banner, main.firstChild);
  }

  function initHeaderSair() {
    if (document.body.classList.contains("login-page")) return;
    if (typeof isLogado === "function" && !isLogado()) return;

    const inner = document.querySelector(".app-header .header-inner");
    if (!inner || inner.querySelector(".header-sair")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "header-sair";
    btn.title = "Sair da conta";
    btn.setAttribute("aria-label", "Sair");
    btn.innerHTML = `<span class="header-sair-icon" aria-hidden="true">${SAIR_SVG}</span><span class="header-sair-label">Sair</span>`;
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm("Deseja sair da conta?")) logoutUsuario();
    });
    inner.appendChild(btn);
  }

  function initHeader() {
    initBemVindo();
    initHeaderSair();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader);
  } else {
    initHeader();
  }
})();
