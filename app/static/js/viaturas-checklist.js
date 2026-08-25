(function () {
  const CHECKLIST_SECOES = [
    {
      id: "documentacao",
      titulo: "2. Documentação",
      perguntas: [
        { id: "v_crlv", numero: "2.1", texto: "CRLV na viatura e em dia" },
        { id: "v_licenciamento", numero: "2.2", texto: "Licenciamento vigente" },
        { id: "v_seguro", numero: "2.3", texto: "Seguro obrigatório vigente" },
      ],
    },
    {
      id: "externo",
      titulo: "3. Parte externa e sinalização",
      perguntas: [
        { id: "v_farois", numero: "3.1", texto: "Faróis, lanternas e setas funcionando", critico: true },
        { id: "v_giroflex", numero: "3.2", texto: "Giroflex / sinalização visual" },
        { id: "v_sirene", numero: "3.3", texto: "Sirene e buzina em funcionamento", critico: true },
        { id: "v_pneus", numero: "3.4", texto: "Pneus em bom estado e calibrados", critico: true },
        { id: "v_estepe", numero: "3.5", texto: "Estepe, macaco e triângulo" },
        { id: "v_parabrisa", numero: "3.6", texto: "Para-brisa e limpadores em ordem" },
      ],
    },
    {
      id: "mecanica",
      titulo: "4. Mecânica e fluídos",
      perguntas: [
        { id: "v_oleo", numero: "4.1", texto: "Nível de óleo do motor adequado" },
        { id: "v_agua", numero: "4.2", texto: "Nível de água do radiador adequado" },
        { id: "v_combustivel", numero: "4.3", texto: "Combustível suficiente para o serviço", critico: true },
        { id: "v_freios", numero: "4.4", texto: "Freios sem anomalia aparente", critico: true },
        { id: "v_bateria", numero: "4.5", texto: "Bateria e partida em ordem" },
      ],
    },
    {
      id: "cabine",
      titulo: "5. Cabine e equipamentos",
      perguntas: [
        { id: "v_cintos", numero: "5.1", texto: "Cintos de segurança em ordem" },
        { id: "v_painel", numero: "5.2", texto: "Painel sem luzes de alerta" },
        { id: "v_radio", numero: "5.3", texto: "Rádio de comunicação operacional" },
        { id: "v_extintor", numero: "5.4", texto: "Extintor da viatura em condições" },
        { id: "v_limpeza", numero: "5.5", texto: "Limpeza e organização da cabine" },
      ],
    },
  ];

  function iterPerguntas() {
    const lista = [];
    CHECKLIST_SECOES.forEach((secao) => {
      secao.perguntas.forEach((p) => lista.push({ secao, pergunta: p }));
    });
    return lista;
  }

  function totalItensChecklist() {
    return iterPerguntas().length;
  }

  function calcularResultadoViatura(respostas) {
    const naoIds = [];
    const criticos = [];
    iterPerguntas().forEach(({ pergunta }) => {
      if (respostas[pergunta.id] !== "sim") {
        naoIds.push(pergunta.id);
        if (pergunta.critico) criticos.push(pergunta.texto);
      }
    });

    const totalNao = naoIds.length;
    const maxItens = totalItensChecklist();
    let recomendacao;
    let justificativa;

    if (criticos.length) {
      recomendacao = "IMPEDIDA";
      justificativa =
        `A viatura está IMPEDIDA para o serviço: ${totalNao} item(ns) não conforme(s), ` +
        `incluindo item crítico (${criticos.join("; ")}).`;
    } else if (totalNao === 0) {
      recomendacao = "APROVADA";
      justificativa =
        `Todos os ${maxItens} itens do checklist estão conformes. A viatura está apta para o serviço.`;
    } else if (totalNao <= 3) {
      recomendacao = "APROVADA COM RESTRIÇÕES";
      justificativa =
        `${totalNao} item(ns) não conforme(s), sem falha crítica. ` +
        "A viatura pode operar com restrições até a correção.";
    } else {
      recomendacao = "IMPEDIDA";
      justificativa = `${totalNao} itens não conformes. A viatura fica impedida até a correção.`;
    }

    return {
      pontuacao_total: totalNao,
      pontuacao_maxima: maxItens,
      recomendacao,
      justificativa,
      itens_nao_conformes: totalNao,
      itens_criticos: criticos,
    };
  }

  function classeResultadoViatura(nivel) {
    if (nivel === "IMPEDIDA") return "preview-impedida";
    if (nivel === "APROVADA COM RESTRIÇÕES") return "preview-restricoes";
    return "preview-aprovada";
  }

  function renderChecklistHtml() {
    return CHECKLIST_SECOES.map((secao) => {
      const perguntas = secao.perguntas
        .map((p) => {
          const critico = p.critico
            ? ' <small class="pergunta-alerta">⚠️ Crítico</small>'
            : "";
          return `<div class="pergunta-card${p.critico ? " pergunta-critica" : ""}">
          <div class="pergunta-header">
            <span class="pergunta-numero">${p.numero}</span>
            <p class="pergunta-texto">${p.texto}${critico}</p>
          </div>
          <div class="sim-nao-buttons">
            <label class="sim-nao-btn"><input type="radio" name="${p.id}" value="sim" checked required><span>Sim</span></label>
            <label class="sim-nao-btn"><input type="radio" name="${p.id}" value="nao"><span>Não</span></label>
          </div>
        </div>`;
        })
        .join("");
      return `<section class="form-section questionario-secao"><h3>${secao.titulo}</h3>${perguntas}</section>`;
    }).join("");
  }

  function getRespostasChecklist(form) {
    const respostas = {};
    iterPerguntas().forEach(({ pergunta }) => {
      const el = form.querySelector(`input[name="${pergunta.id}"]:checked`);
      respostas[pergunta.id] = el ? el.value : "nao";
    });
    return respostas;
  }

  window.CHECKLIST_VIATURA_SECOES = CHECKLIST_SECOES;
  window.calcularResultadoViatura = calcularResultadoViatura;
  window.classeResultadoViatura = classeResultadoViatura;
  window.renderChecklistHtml = renderChecklistHtml;
  window.getRespostasChecklist = getRespostasChecklist;
  window.totalItensChecklistViatura = totalItensChecklist;
})();
