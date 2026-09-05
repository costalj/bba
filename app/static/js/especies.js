(function () {
  function catalogo() {
    return typeof ESPECIES_CATALOGO !== "undefined" ? ESPECIES_CATALOGO : { especies: [], status_label: {} };
  }

  function listaEspecies() {
    return catalogo().especies || [];
  }

  function statusLabel(status) {
    const map = catalogo().status_label || {};
    return map[status] || String(status || "").toUpperCase();
  }

  function normalizarTexto(valor) {
    return String(valor || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function tokens(valor) {
    return normalizarTexto(valor).split(" ").filter((t) => t.length > 2);
  }

  function scoreMatch(query, especie) {
    const q = normalizarTexto(query);
    if (!q) return 0;
    const nomes = [
      especie.nome_popular,
      especie.nome_cientifico,
      ...(especie.aliases || []),
    ].map(normalizarTexto);

    if (nomes.some((n) => n === q)) return 100;
    if (nomes.some((n) => n.includes(q) || q.includes(n))) return 80;

    const qt = tokens(q);
    let best = 0;
    for (const n of nomes) {
      const nt = tokens(n);
      const hits = qt.filter((t) => nt.some((x) => x.includes(t) || t.includes(x))).length;
      if (!qt.length) continue;
      best = Math.max(best, Math.round((hits / qt.length) * 70));
    }
    return best;
  }

  function buscarEspecies(query, limite) {
    const lim = limite || 8;
    return listaEspecies()
      .map((e) => ({ especie: e, score: scoreMatch(query, e) }))
      .filter((x) => x.score >= 40)
      .sort((a, b) => b.score - a.score)
      .slice(0, lim)
      .map((x) => x.especie);
  }

  function buscarMelhorEspecie(query) {
    const hits = buscarEspecies(query, 1);
    return hits[0] || null;
  }

  function exigeCitacaoLegal(status) {
    return ["ameacada", "tombada", "protegida", "imune"].includes(status);
  }

  function formatarCitacoesLegais(especie) {
    if (!especie || !exigeCitacaoLegal(especie.status)) return "";
    const artigos = especie.artigos || [];
    if (!artigos.length) {
      return especie.referencia ? `\nReferência: ${especie.referencia}.` : "";
    }
    const ordem = ["federal", "estadual", "municipal"];
    const rotulos = {
      federal: "Lei federal",
      estadual: "Lei/dec. estadual (MA)",
      municipal: "Lei municipal (São Luís)",
    };
    const grupos = {};
    artigos.forEach((a) => {
      const e = (a.esfera || "").toLowerCase();
      if (!grupos[e]) grupos[e] = [];
      grupos[e].push(a);
    });
    const linhas = [];
    ordem.forEach((esfera) => {
      const lista = grupos[esfera];
      if (!lista || !lista.length) return;
      const citacoes = lista
        .map((a) => {
          const base = `${a.norma}, ${a.artigo}`;
          return a.texto ? `${base} (${a.texto})` : base;
        })
        .join("; ");
      linhas.push(`${rotulos[esfera]}: ${citacoes}.`);
    });
    if (!linhas.length) return "";
    return `\n\n${linhas.join("\n")}`;
  }

  function textoResultado(especie) {
    if (!especie) {
      return {
        nivel: "livre",
        titulo: "Não consta no catálogo protegido",
        resumo:
          "Espécie não listada como ameaçada, imune, tombada ou protegida no catálogo BBA. Corte/poda conforme risco e autorização do órgão ambiental.",
      };
    }
    const label = statusLabel(especie.status);
    const esfera = (especie.esfera || "").toUpperCase();
    const citacoes = formatarCitacoesLegais(especie);
    const descricao = `${especie.nome_popular} (${especie.nome_cientifico}). ${especie.conduta}${citacoes}`;
    return {
      nivel: especie.status,
      titulo: `${label} (${esfera})`,
      resumo: descricao,
      especie,
    };
  }

  function formatarCampoResultado(info) {
    if (!info) return "";
    return `${info.titulo}\n${info.resumo}`;
  }

  function aplicarResultadoNoForm(info, opts) {
    const resultadoEl = document.getElementById(opts.resultadoId || "resultado-especie");
    const hiddenStatus = document.getElementById(opts.statusId || "especie_status");
    const hiddenId = document.getElementById(opts.especieIdField || "especie_catalogo_id");
    const inputEspecie = document.getElementById(opts.inputId || "campo-especie");

    if (resultadoEl) {
      resultadoEl.value = formatarCampoResultado(info);
      resultadoEl.classList.remove(
        "resultado-especie-livre",
        "resultado-especie-ameacada",
        "resultado-especie-imune",
        "resultado-especie-tombada",
        "resultado-especie-protegida"
      );
      resultadoEl.classList.add(`resultado-especie-${info.nivel || "livre"}`);
    }
    if (hiddenStatus) hiddenStatus.value = info.especie ? info.especie.status : "livre";
    if (hiddenId) hiddenId.value = info.especie ? info.especie.id : "";
    if (inputEspecie && info.especie) {
      inputEspecie.value = `${info.especie.nome_popular} (${info.especie.nome_cientifico})`;
    }

    const q26 = document.querySelector('input[name="q_2_6"][value="sim"]');
    const q26nao = document.querySelector('input[name="q_2_6"][value="nao"]');
    if (info.especie && ["ameacada", "imune", "tombada", "protegida"].includes(info.especie.status)) {
      if (q26) q26.checked = true;
    } else if (q26nao && !info.especie) {
      /* não força NÃO automaticamente */
    }
    if (typeof atualizarPreview === "function") {
      try {
        atualizarPreview();
      } catch (_) {}
    }
  }

  function verificarEspecieDigitada(opts) {
    const input = document.getElementById(opts.inputId || "campo-especie");
    const nome = (input && input.value) || "";
    if (!nome.trim()) {
      alert("Informe o nome da espécie para consultar o catálogo.");
      return null;
    }
    const match = buscarMelhorEspecie(nome);
    const info = textoResultado(match);
    if (!match) {
      info.resumo =
        `"${nome.trim()}" não encontrada como ameaçada/imune/tombada/protegida no catálogo. Corte/poda conforme risco e autorização ambiental.`;
    }
    aplicarResultadoNoForm(info, opts);
    return info;
  }

  function abrirModalIdentificacao(opts, fotoDataUrl) {
    const existente = document.getElementById("modal-id-especie");
    if (existente) existente.remove();

    const lista = listaEspecies();
    const modal = document.createElement("div");
    modal.id = "modal-id-especie";
    modal.className = "modal-especie-overlay";
    modal.innerHTML = `
      <div class="modal-especie-card">
        <h3>Identificar espécie</h3>
        <p class="hint">Selecione a espécie (consulta no catálogo de legislação). A foto fica anexada à identificação.</p>
        ${fotoDataUrl ? `<img src="${fotoDataUrl}" alt="Foto espécie" class="modal-especie-foto">` : ""}
        <label class="field">
          <span>Buscar no catálogo</span>
          <input type="search" id="busca-especie-modal" placeholder="Ex: ipê, babaçu, aroeira…">
        </label>
        <ul class="lista-especie-modal" id="lista-especie-modal"></ul>
        <button type="button" class="btn btn-secondary btn-block" id="btn-fechar-modal-especie">Cancelar</button>
      </div>`;
    document.body.appendChild(modal);

    const listaEl = modal.querySelector("#lista-especie-modal");
    const busca = modal.querySelector("#busca-especie-modal");

    function renderLista(filtro) {
      const base = filtro
        ? buscarEspecies(filtro, 20)
        : lista.slice().sort((a, b) => a.nome_popular.localeCompare(b.nome_popular, "pt"));
      if (!base.length) {
        listaEl.innerHTML = `<li class="hint">Nenhuma espécie encontrada.</li>`;
        return;
      }
      listaEl.innerHTML = base
        .map(
          (e) => `<li>
          <button type="button" class="btn-especie-item" data-id="${e.id}">
            <strong>${e.nome_popular}</strong>
            <small>${e.nome_cientifico} · ${statusLabel(e.status)} (${(e.esfera || "").toUpperCase()})</small>
          </button>
        </li>`
        )
        .join("");
      listaEl.querySelectorAll(".btn-especie-item").forEach((btn) => {
        btn.addEventListener("click", () => {
          const esp = lista.find((x) => x.id === btn.dataset.id);
          const info = textoResultado(esp);
          aplicarResultadoNoForm(info, opts);
          const hiddenFoto = document.getElementById(opts.fotoHiddenId || "foto_especie");
          if (hiddenFoto && fotoDataUrl) hiddenFoto.value = fotoDataUrl;
          const preview = document.getElementById(opts.fotoPreviewId || "preview-foto-especie");
          if (preview && fotoDataUrl) {
            preview.innerHTML = `<img src="${fotoDataUrl}" alt="Foto identificação"><span class="hint">Foto de identificação anexada</span>`;
          }
          modal.remove();
        });
      });
    }

    renderLista("");
    busca.addEventListener("input", () => renderLista(busca.value));
    modal.querySelector("#btn-fechar-modal-especie").onclick = () => modal.remove();
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
    setTimeout(() => busca.focus(), 100);
  }

  async function redimensionarFoto(file, maxSide, quality) {
    const side = maxSide || 1280;
    const q = quality || 0.75;
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > side || height > side) {
          const ratio = Math.min(side / width, side / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", q));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function initEspecieForm(opts) {
    const o = opts || {};
    const btnCheck = document.getElementById(o.checkBtnId || "btn-check-especie");
    const btnFoto = document.getElementById(o.fotoBtnId || "btn-foto-especie");
    const inputFile = document.getElementById(o.fotoInputId || "input-foto-especie");

    if (btnCheck) {
      btnCheck.addEventListener("click", () => verificarEspecieDigitada(o));
    }

    if (btnFoto && inputFile) {
      btnFoto.addEventListener("click", () => {
        if (typeof AndroidCamera !== "undefined" && AndroidCamera.preferCamera) {
          try {
            AndroidCamera.preferCamera();
          } catch (_) {}
        }
        inputFile.click();
      });
      inputFile.addEventListener("change", async () => {
        const file = inputFile.files && inputFile.files[0];
        inputFile.value = "";
        if (!file) return;
        btnFoto.disabled = true;
        const label = btnFoto.textContent;
        btnFoto.textContent = "Identificando…";
        try {
          const dataUrl = await redimensionarFoto(file);
          abrirModalIdentificacao(o, dataUrl);
        } catch (err) {
          alert("Não foi possível processar a foto: " + (err.message || err));
        } finally {
          btnFoto.disabled = false;
          btnFoto.textContent = label;
        }
      });
    }
  }

  window.listaEspeciesProtegidas = listaEspecies;
  window.buscarEspecies = buscarEspecies;
  window.buscarMelhorEspecie = buscarMelhorEspecie;
  window.textoResultadoEspecie = textoResultado;
  window.statusLabelEspecie = statusLabel;
  window.verificarEspecieDigitada = verificarEspecieDigitada;
  window.initEspecieForm = initEspecieForm;
  window.formatarCampoResultadoEspecie = formatarCampoResultado;
  window.formatarCitacoesLegaisEspecie = formatarCitacoesLegais;
})();
