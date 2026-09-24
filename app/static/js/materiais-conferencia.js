(function () {
  const form = document.getElementById("form-materiais");
  const tipo = document.getElementById("tipo-checklist");
  const blocoFoto = document.getElementById("bloco-foto");
  const blocoChecklist = document.getElementById("bloco-checklist");
  const blocoAssinaturas = document.getElementById("bloco-assinaturas");
  const btnSalvar = document.getElementById("btn-salvar-conferencia");
  const fotosInputCamera = document.getElementById("fotos-input-camera");
  const fotosInputGaleria = document.getElementById("fotos-input-galeria");
  const btnFotosCamera = document.getElementById("btn-fotos-camera");
  const btnFotosGaleria = document.getElementById("btn-fotos-galeria");
  const fotosPreview = document.getElementById("fotos-preview");
  const fotosJson = document.getElementById("fotos-json");
  if (!form || !tipo) return;

  let fotos = [];
  let pads = null;

  function mostrar(el, visivel) {
    if (!el) return;
    el.classList.toggle("material-oculto", !visivel);
  }

  function garantirAssinaturas() {
    if (pads || typeof initRubricaCanvas !== "function") return;
    mostrar(blocoAssinaturas, true);
    pads = {
      saindo: initRubricaCanvas({
        canvasId: "canvas-saindo",
        hiddenId: "assinatura-saindo",
        clearBtnId: "limpar-saindo",
      }),
      entrando: initRubricaCanvas({
        canvasId: "canvas-entrando",
        hiddenId: "assinatura-entrando",
        clearBtnId: "limpar-entrando",
      }),
    };
  }

  function aplicarTipo() {
    const modo = tipo.value;
    mostrar(blocoFoto, modo === "foto");
    const listaVisivel = modo === "manual" || (modo === "foto" && fotos.length > 0);
    mostrar(blocoChecklist, listaVisivel);
    mostrar(blocoAssinaturas, listaVisivel);
    mostrar(btnSalvar, listaVisivel);
    if (listaVisivel) garantirAssinaturas();
  }

  function comprimirFoto(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const max = 1280;
        const escala = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("foto"));
      };
      img.src = url;
    });
  }

  function pintarFotos() {
    fotosJson.value = JSON.stringify(fotos);
    fotosPreview.innerHTML = fotos
      .map((src) => `<img src="${src}" alt="Foto dos materiais">`)
      .join("");
    aplicarTipo();
  }

  tipo.addEventListener("change", aplicarTipo);

  async function adicionarFotos(input) {
    if (!input) return;
    const arquivos = Array.from(input.files || []);
    input.value = "";
    for (const arquivo of arquivos) {
      try {
        fotos.push(await comprimirFoto(arquivo));
      } catch {
        /* ignora arquivo ilegível */
      }
    }
    pintarFotos();
  }

  if (btnFotosCamera && fotosInputCamera) {
    btnFotosCamera.addEventListener("click", () => fotosInputCamera.click());
    fotosInputCamera.addEventListener("change", () => adicionarFotos(fotosInputCamera));
  }
  if (btnFotosGaleria && fotosInputGaleria) {
    btnFotosGaleria.addEventListener("click", () => fotosInputGaleria.click());
    fotosInputGaleria.addEventListener("change", () => adicionarFotos(fotosInputGaleria));
  }

  form.addEventListener("change", (event) => {
    const radio = event.target;
    if (!radio.matches || !radio.matches('input[type="radio"][name^="status_"]')) return;
    const item = radio.closest(".material-check-item");
    if (!item) return;
    item.querySelector(".material-alterado").classList.toggle("material-oculto", radio.value !== "alterado");
  });

  form.addEventListener("submit", (event) => {
    if (pads) {
      pads.saindo && pads.saindo.exportRubrica();
      pads.entrando && pads.entrando.exportRubrica();
    }
    if (tipo.value === "foto" && !fotos.length) {
      event.preventDefault();
      alert("Envie a foto dos materiais para comparar com a lista do sistema.");
      return;
    }
    const nomeSaindo = document.getElementById("nome-saindo");
    const nomeEntrando = document.getElementById("nome-entrando");
    const assSaindo = document.getElementById("assinatura-saindo");
    const assEntrando = document.getElementById("assinatura-entrando");
    if (!nomeSaindo.value.trim() || !nomeEntrando.value.trim() || !assSaindo.value || !assEntrando.value) {
      event.preventDefault();
      alert("Informe o nome e a assinatura de quem está saindo e de quem está entrando.");
    }
  });
})();
