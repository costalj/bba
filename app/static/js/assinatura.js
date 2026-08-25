(function () {
  function formatarDataHora() {
    return new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function posCanvas(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = evt.touches ? evt.touches[0] : evt;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top) * scaleY,
    };
  }

  function nomePostoGuerra(usuario) {
    if (!usuario) return "";
    const posto = (usuario.posto || "").trim();
    const guerra = String(usuario.nome_guerra || "").trim();
    const nome = guerra || String(usuario.nome || "").trim();
    if (posto && nome) return `${posto} ${nome}`;
    return posto || nome;
  }

  window.initRubricaCanvas = function initRubricaCanvas(opts) {
    const canvas = document.getElementById(opts.canvasId);
    const hidden = document.getElementById(opts.hiddenId);
    const btnClear = document.getElementById(opts.clearBtnId);
    if (!canvas || !hidden) return null;

    const ctx = canvas.getContext("2d");
    let drawing = false;
    let hasStroke = false;

    function resize() {
      const w = canvas.parentElement.clientWidth || 320;
      canvas.width = w;
      canvas.height = Math.round(w * 0.35);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#1b4332";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      hasStroke = false;
      hidden.value = "";
    }

    function start(evt) {
      evt.preventDefault();
      drawing = true;
      const p = posCanvas(canvas, evt);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
    }

    function move(evt) {
      if (!drawing) return;
      evt.preventDefault();
      const p = posCanvas(canvas, evt);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      hasStroke = true;
    }

    function end() {
      drawing = false;
    }

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", move);
    canvas.addEventListener("mouseup", end);
    canvas.addEventListener("mouseleave", end);
    canvas.addEventListener("touchstart", start, { passive: false });
    canvas.addEventListener("touchmove", move, { passive: false });
    canvas.addEventListener("touchend", end);

    if (btnClear) {
      btnClear.addEventListener("click", () => resize());
    }

    window.addEventListener("resize", resize);
    resize();

    return {
      exportRubrica() {
        hidden.value = hasStroke ? canvas.toDataURL("image/png") : "";
      },
      hasStroke: () => hasStroke,
    };
  };

  window.initAssinaturaChefe = function initAssinaturaChefe(opts) {
    const hidden = document.getElementById(opts.hiddenId);
    const btn = document.getElementById(opts.btnId);
    const preview = document.getElementById(opts.previewId);
    const usuario = opts.usuario;
    if (!hidden || !btn || !preview || !usuario) return;

    if (usuario.perfil !== "Chefe de Socorro") {
      btn.disabled = true;
      btn.textContent = "Apenas Chefe de Socorro pode assinar";
      return;
    }

    btn.addEventListener("click", () => {
      if (!confirm("Confirmar assinatura eletrônica desta vistoria?")) return;

      const assinatura = {
        nome: usuario.nome,
        posto: usuario.posto || "",
        matricula: usuario.matricula || "",
        cargo: "Chefe de Socorro",
        perfil: usuario.perfil,
        data_hora: formatarDataHora(),
        assinado_por: `${usuario.posto || ""} ${usuario.nome}`.trim(),
        tipo: "Assinatura eletrônica",
      };

      hidden.value = JSON.stringify(assinatura);
      preview.innerHTML = `
        <div class="assinatura-digital assinatura-preview-ok">
          <p class="assinatura-nome">${assinatura.assinado_por}</p>
          <p class="assinatura-cargo">${assinatura.cargo}</p>
          <p class="assinatura-data">${assinatura.data_hora}</p>
          <small class="assinatura-hint">Assinatura eletrônica registrada</small>
        </div>`;
      btn.disabled = true;
      btn.textContent = "✅ Assinado";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-secondary");
    });
  };

  function podeAssinarVistoriaViatura(usuario) {
    const perfis = [
      "Condutor de viatura",
      "Chefe de Socorro",
      "Comandante de guarnição",
    ];
    return usuario && perfis.includes(usuario.perfil);
  }

  window.initAssinaturaCondutor = function initAssinaturaCondutor(opts) {
    const hidden = document.getElementById(opts.hiddenId);
    const btn = document.getElementById(opts.btnId);
    const preview = document.getElementById(opts.previewId);
    const usuario = opts.usuario;
    if (!hidden || !btn || !preview || !usuario) return;

    if (!podeAssinarVistoriaViatura(usuario)) {
      btn.disabled = true;
      btn.textContent = "Sem permissão para assinar";
      return;
    }

    btn.addEventListener("click", () => {
      if (!confirm("Confirmar assinatura eletrônica nesta vistoria?")) return;

      const assinatura = {
        nome: usuario.nome,
        posto: usuario.posto || "",
        matricula: usuario.matricula || "",
        cargo: usuario.perfil,
        perfil: usuario.perfil,
        data_hora: formatarDataHora(),
        assinado_por: nomePostoGuerra(usuario),
        tipo: "Assinatura eletrônica",
      };

      hidden.value = JSON.stringify(assinatura);
      preview.innerHTML = `
        <div class="assinatura-digital assinatura-preview-ok">
          <p class="assinatura-nome">${assinatura.assinado_por}</p>
          <p class="assinatura-cargo">${assinatura.cargo}</p>
          <p class="assinatura-data">${assinatura.data_hora}</p>
          <small class="assinatura-hint">Assinatura eletrônica registrada</small>
        </div>`;
      btn.disabled = true;
      btn.textContent = "✅ Assinado";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-secondary");
    });
  };
})();
