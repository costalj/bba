const PDF_MARGEM = 20;
const PDF_LARGURA = 170;
const FOTO_CAIXA_LARGURA = 120;
const FOTO_CAIXA_ALTURA = 90;
const FOTO_BLOCO_ALTURA = FOTO_CAIXA_ALTURA + 14;

function safeText(value) {
  if (value == null) return "";
  return String(value);
}

function formatarTelefonePdf(valor) {
  if (typeof formatarTelefone === "function") {
    return formatarTelefone(valor);
  }
  const d = String(valor || "").replace(/\D/g, "").slice(0, 11);
  if (!d.length) return safeText(valor) || "—";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function normalizarVistoriaPdf(vistoria) {
  return {
    ...vistoria,
    solicitante: safeText(vistoria.solicitante),
    cpf_solicitante: safeText(vistoria.cpf_solicitante),
    endereco: safeText(vistoria.endereco),
    contato_telefonico: safeText(vistoria.contato_telefonico),
    forma_acionamento: safeText(vistoria.forma_acionamento),
    protocolo: safeText(vistoria.protocolo),
    natureza_ocorrencia: safeText(vistoria.natureza_ocorrencia),
    descricao_ocorrencia: safeText(vistoria.descricao_ocorrencia),
    especie: safeText(vistoria.especie),
    resultado_especie: safeText(vistoria.resultado_especie),
    especie_status: safeText(vistoria.especie_status),
    observacoes: safeText(vistoria.observacoes),
    recursos_adicionais: safeText(vistoria.recursos_adicionais),
    justificativa: safeText(vistoria.justificativa),
    recomendacao: safeText(vistoria.recomendacao),
    fotos: Array.isArray(vistoria.fotos)
      ? vistoria.fotos
          .map((f) => {
            const data =
              typeof urlFotoVistoria === "function" ? urlFotoVistoria(f) : f?.data || "";
            return data && safeText(data).length > 20 ? { ...f, data } : null;
          })
          .filter(Boolean)
      : [],
    questionario:
      vistoria.questionario && typeof vistoria.questionario === "object"
        ? vistoria.questionario
        : null,
  };
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function corQuadroResultado(rec) {
  if (rec === "ALTO" || rec === "SUPRESSÃO") return [253, 232, 232];
  if (rec === "MÉDIO" || rec === "INTERVENÇÃO URGENTE" || rec === "PODAS / ACOMPANHAMENTO") {
    return [255, 248, 231];
  }
  return [216, 243, 220];
}

function cabecalhoLaudoConfig() {
  if (typeof CABECALHO_LAUDO !== "undefined") return CABECALHO_LAUDO;
  return {
    linhas: [
      "SECRETARIA DE SEGURANÇA PÚBLICA",
      "CORPO DE BOMBEIROS MILITAR DO MARANHÃO",
      "BATALHÃO DE BOMBEIROS AMBIENTAL",
    ],
    titulo: "RELATÓRIO DE VISTORIA DE ÁRVORE",
  };
}

function logoDataUrl() {
  return typeof LOGO_BBA_DATA_URL !== "undefined" ? LOGO_BBA_DATA_URL : null;
}

function estiloTabelaPadrao(fontSize = 10) {
  const base = {
    theme: "grid",
    styles: {
      fontSize,
      cellPadding: 4,
      overflow: "linebreak",
      lineColor: [210, 210, 210],
      lineWidth: 0.2,
    },
    headStyles: {
      fillColor: [45, 106, 79],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    margin: { left: PDF_MARGEM, right: PDF_MARGEM },
  };
  if (fontSize === 10) {
    base.alternateRowStyles = { fillColor: [246, 249, 247] };
  }
  return base;
}

function desenharCabecalhoLaudo(doc, vistoria) {
  const pageW = doc.internal.pageSize.getWidth();
  const center = pageW / 2;
  let y = PDF_MARGEM;
  const cab = cabecalhoLaudoConfig();
  const logo = logoDataUrl();

  if (logo) {
    try {
      doc.addImage(logo, "PNG", center - 14, y, 28, 28);
      y += 32;
    } catch (e) {
      console.warn("Logo nao incluido no PDF:", e);
    }
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(27, 67, 50);
  cab.linhas.forEach((linha) => {
    doc.text(linha, center, y, { align: "center" });
    y += 5;
  });

  const numero =
    typeof numeroLaudoVistoria === "function"
      ? numeroLaudoVistoria(vistoria)
      : `${String(vistoria.id || 1).padStart(4, "0")}/${new Date().getFullYear()}`;

  doc.setFontSize(11);
  doc.text(`${cab.titulo} Nº ${numero}`, center, y + 2, { align: "center" });
  y += 10;

  doc.setDrawColor(45, 106, 79);
  doc.setLineWidth(0.5);
  doc.line(PDF_MARGEM, y, pageW - PDF_MARGEM, y);
  doc.setTextColor(0, 0, 0);

  return y + 8;
}

function desenharQuadroResultado(doc, vistoria, yStart, res, maxSim) {
  const rgb = corQuadroResultado(vistoria.recomendacao);
  const body = [
    [{ content: `Nível de risco: ${vistoria.recomendacao}`, styles: { fontStyle: "bold", fontSize: 11 } }],
    [
      {
        content: `Indicadores de risco (itens 3 e 4): ${vistoria.pontuacao_total} / ${maxSim}`,
        styles: { fontStyle: "bold" },
      },
    ],
    [vistoria.justificativa || ""],
  ];

  if (res && res.orientacao_conduta && res.orientacao_conduta.length) {
    body.push([{ content: "O que deve ser feito com a árvore:", styles: { fontStyle: "bold" } }]);
    res.orientacao_conduta.forEach((item) => body.push([`• ${safeText(item)}`]));
  }

  doc.autoTable({
    body,
    startY: yStart,
    margin: { left: PDF_MARGEM, right: PDF_MARGEM },
    theme: "plain",
    styles: {
      fillColor: rgb,
      fontSize: 10,
      cellPadding: 6,
      overflow: "linebreak",
      lineColor: [45, 106, 79],
      lineWidth: 0.3,
    },
  });

  return doc.lastAutoTable.finalY + 6;
}

function tituloSecao(doc, y, texto) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(27, 67, 50);
  doc.text(safeText(texto), PDF_MARGEM, y);
  doc.setTextColor(0, 0, 0);
  return y + 8;
}

function agruparArtigosEsfera(artigos) {
  const ordem = [
    ["federal", "Federal"],
    ["estadual", "Estadual (MA)"],
    ["municipal", "Municipal (São Luís)"],
  ];
  const grupos = {};
  (artigos || []).forEach((art) => {
    const esfera = safeText(art.esfera).toLowerCase();
    let trecho = `${safeText(art.norma)}, ${safeText(art.artigo)}`;
    if (art.texto) trecho += ` (${art.texto})`;
    if (!grupos[esfera]) grupos[esfera] = [];
    grupos[esfera].push(trecho);
  });
  return ordem.filter(([chave]) => grupos[chave]).map(([chave, rotulo]) => [rotulo, grupos[chave].join("; ")]);
}

function parseResultadoEspecie(texto) {
  const linhas = safeText(texto)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (!linhas.length) return null;
  const titulo = linhas[0];
  const descricao = [];
  const citacoes = [];
  const prefixos = [
    ["Lei federal:", "Federal"],
    ["Lei/dec. estadual (MA):", "Estadual (MA)"],
    ["Lei municipal (São Luís):", "Municipal (São Luís)"],
  ];
  linhas.slice(1).forEach((linha) => {
    const hit = prefixos.find(([p]) => linha.startsWith(p));
    if (hit) citacoes.push([hit[1], linha.slice(hit[0].length).trim()]);
    else if (!citacoes.length) descricao.push(linha);
  });
  return { titulo, descricao: descricao.join(" "), citacoes };
}

function infoLegislacao(vistoria) {
  const catalogo =
    typeof ESPECIES_CATALOGO !== "undefined" && ESPECIES_CATALOGO.especies
      ? ESPECIES_CATALOGO.especies
      : [];
  const statusMap =
    typeof ESPECIES_CATALOGO !== "undefined" && ESPECIES_CATALOGO.status_label
      ? ESPECIES_CATALOGO.status_label
      : {};
  const id = safeText(vistoria.especie_catalogo_id);
  const especie = id ? catalogo.find((e) => e.id === id) : null;

  if (especie && ["ameacada", "tombada", "protegida", "imune"].includes(especie.status)) {
    const label = statusMap[especie.status] || String(especie.status || "").toUpperCase();
    const esfera = safeText(especie.esfera).toUpperCase();
    return {
      titulo: `${label} (${esfera})`,
      descricao: `${especie.nome_popular} (${especie.nome_cientifico}). ${especie.conduta}`,
      citacoes: agruparArtigosEsfera(especie.artigos),
    };
  }

  const resultado = safeText(vistoria.resultado_especie).trim();
  if (!resultado) return null;
  const parsed = parseResultadoEspecie(resultado);
  if (!parsed) return null;
  const protegido = /AMEAÇADA|TOMBADA|PROTEGIDA|IMUNE/.test(parsed.titulo.toUpperCase());
  if (!protegido && !parsed.citacoes.length) return null;
  return parsed;
}

function estimarAlturaLegislacao(info) {
  const descLinhas = Math.ceil(safeText(info.descricao).length / 78);
  const citacoesAlt = (info.citacoes || []).reduce(
    (total, [, texto]) => total + Math.max(1, Math.ceil(safeText(texto).length / 62)),
    0
  );
  return 8 + descLinhas * 4 + 8 + citacoesAlt * 5 + 8;
}

function desenharLegislacao(doc, y, vistoria) {
  const info = infoLegislacao(vistoria);
  if (!info) return y;

  const pageH = doc.internal.pageSize.getHeight();
  const altura = estimarAlturaLegislacao(info);
  if (y + altura > pageH - PDF_MARGEM) {
    doc.addPage();
    y = PDF_MARGEM;
  }

  y = tituloSecao(doc, y, "7. Legislação");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(27, 67, 50);
  doc.text(safeText(info.titulo), PDF_MARGEM, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  const desc = doc.splitTextToSize(safeText(info.descricao), PDF_LARGURA);
  doc.text(desc, PDF_MARGEM, y);
  y += desc.length * 3.8 + 2;

  if (info.citacoes && info.citacoes.length) {
    doc.autoTable({
      ...estiloTabelaPadrao(8),
      head: [["Esfera", "Dispositivo legal"]],
      body: info.citacoes,
      startY: y,
      columnStyles: {
        0: { cellWidth: 32, fontStyle: "bold", fillColor: [232, 245, 233] },
        1: { cellWidth: 138, overflow: "linebreak" },
      },
      margin: { left: PDF_MARGEM, right: PDF_MARGEM },
    });
    y = doc.lastAutoTable.finalY + 4;
  }

  return y;
}

function desenharTabelaDados(doc, y, vistoria) {
  y = tituloSecao(doc, y, "1. Dados da ocorrência");
  const body = [
    ["Nº do Laudo", numeroLaudoVistoria(vistoria)],
    ["Data", safeText(vistoria.created_at) || "—"],
    ["Solicitante", vistoria.solicitante || "—"],
    ["CPF do Solicitante", vistoria.cpf_solicitante ? formatarCpf(vistoria.cpf_solicitante) : "—"],
    ["Endereço", vistoria.endereco || "—"],
    ["Contato", vistoria.contato_telefonico ? formatarTelefonePdf(vistoria.contato_telefonico) : "—"],
    ["Forma de Acionamento", vistoria.forma_acionamento || "—"],
    ["Protocolo CIOPS/Portaria/OS", vistoria.protocolo || "—"],
    ["Natureza da ocorrência", vistoria.natureza_ocorrencia || "—"],
    ["Descrição da ocorrência", vistoria.descricao_ocorrencia || "—"],
    ["Espécie", vistoria.especie || "—"],
  ];

  doc.autoTable({
    ...estiloTabelaPadrao(),
    head: [["Campo", "Valor"]],
    body,
    startY: y,
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold" }, 1: { cellWidth: 120 } },
  });
  return doc.lastAutoTable.finalY + 6;
}

function desenharSecoesQuestionario(doc, y, vistoria) {
  if (!vistoria.questionario || typeof QUESTIONARIO === "undefined") return y;

  QUESTIONARIO.secoes.forEach((secao) => {
    y = tituloSecao(doc, y, secao.titulo);
    const blocos = [];
    if (secao.perguntas) blocos.push(["", secao.perguntas]);
    (secao.grupos || []).forEach((g) => blocos.push([g.titulo, g.perguntas]));

    blocos.forEach(([grupo, perguntas]) => {
      if (grupo) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text(safeText(grupo), PDF_MARGEM, y);
        y += 6;
      }

      const body = (perguntas || []).map((p) => {
        const val = safeText((vistoria.questionario || {})[p.id] || "nao").toUpperCase();
        let texto = safeText(p.texto);
        if (texto.length > 80) texto = `${texto.substring(0, 80)}…`;
        return [safeText(p.numero), texto, val];
      });

      if (!body.length) return;

      doc.autoTable({
        ...estiloTabelaPadrao(8),
        head: [["Item", "Pergunta", "Resposta"]],
        body,
        startY: y,
        columnStyles: {
          0: { cellWidth: 16 },
          1: { cellWidth: 118 },
          2: { cellWidth: 20, halign: "center" },
        },
      });
      y = doc.lastAutoTable.finalY + 4;
    });
  });

  return y + 2;
}

function desenharSecao6(doc, y, res) {
  if (!res) return y;

  y = tituloSecao(doc, y, "6. Resultado da avaliação de risco");
  const s = res.somatorio || {};
  const body = [
    ["ALTO", "42 a 54"],
    ["MÉDIO", "23 a 41"],
    ["BAIXO", "0 a 22"],
    ["Item 3 (Nível I)", `${s.secao_3_sim || 0} SIM / ${s.secao_3_total || 12}`],
    ["Item 4 (Níveis II e III)", `${s.secao_4_sim || 0} SIM / ${s.secao_4_total || 42}`],
    ["Total itens 3 e 4", `${s.total_3_4_sim || 0} SIM / ${s.total_3_4_max || 54}`],
    ["Classificação", `${s.nivel || ""} (faixa ${s.faixa || ""})`],
  ];

  doc.autoTable({
    ...estiloTabelaPadrao(),
    head: [["Nível", "Indicadores de risco (itens 3 e 4)"]],
    body,
    startY: y,
    columnStyles: { 0: { cellWidth: 60, fontStyle: "bold" }, 1: { cellWidth: 110 } },
  });
  y = doc.lastAutoTable.finalY + 6;

  return y;
}

function estimarAlturaRecursos(vistoria) {
  const txt = safeText(vistoria.recursos_adicionais).trim();
  if (!txt) return 0;
  return 8 + Math.min(24, Math.ceil(txt.length / 55) * 5) + 4;
}

function estimarAlturaRubrica(vistoria) {
  const rubrica = vistoria.rubrica;
  if (rubrica && rubrica.imagem && safeText(rubrica.imagem).length > 20) {
    return 8 + (rubrica.nome ? 5 : 0) + (rubrica.data_hora ? 5 : 0) + 34 + 4;
  }
  return 8 + 6 + 4;
}

function estimarAlturaAssinatura(vistoria) {
  if (vistoria.assinatura) return 52;
  return 36;
}

function desenharRecursosAdicionais(doc, y, vistoria) {
  const txt = safeText(vistoria.recursos_adicionais).trim();
  if (!txt) return y;
  y = tituloSecao(doc, y, "Recursos adicionais");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  const linhas = doc.splitTextToSize(txt, PDF_LARGURA);
  doc.text(linhas, PDF_MARGEM, y);
  return y + linhas.length * 5 + 4;
}

function desenharRubricaEAssinatura(doc, y, vistoria) {
  const pageH = doc.internal.pageSize.getHeight();
  const blocoAltura =
    estimarAlturaRecursos(vistoria) +
    8 +
    estimarAlturaRubrica(vistoria) +
    8 +
    estimarAlturaAssinatura(vistoria);
  if (y + blocoAltura > pageH - PDF_MARGEM) {
    doc.addPage();
    y = PDF_MARGEM;
  }
  y = desenharRecursosAdicionais(doc, y, vistoria);
  y = desenharRubrica(doc, y, vistoria);
  y = desenharAssinaturaChefe(doc, y, vistoria, true);
  return y;
}

function desenharRubrica(doc, y, vistoria) {
  y = tituloSecao(doc, y, "Rubrica do solicitante");
  const rubrica = vistoria.rubrica;

  if (rubrica && rubrica.imagem && safeText(rubrica.imagem).length > 20) {
    if (rubrica.nome) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(safeText(rubrica.nome), PDF_MARGEM, y);
      y += 5;
    }
    if (rubrica.data_hora) {
      doc.setFont("helvetica", "normal");
      doc.text(safeText(rubrica.data_hora), PDF_MARGEM, y);
      y += 5;
    }
    try {
      const fmt = rubrica.imagem.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(rubrica.imagem, fmt, PDF_MARGEM, y, 80, 30);
      y += 34;
    } catch (e) {
      doc.setFont("helvetica", "normal");
      doc.text("[Rubrica registrada]", PDF_MARGEM, y);
      y += 6;
    }
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Não rubricado (opcional).", PDF_MARGEM, y);
    y += 6;
  }

  return y + 4;
}

function desenharAssinaturaChefe(doc, y, vistoria, blocoUnido = false) {
  y = tituloSecao(doc, y, "Assinatura do Chefe de Socorro");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const centro = pageW / 2;
  const paddingTop = 10;
  const paddingBottom = 10;
  const lineHeight = 6;
  const lineHeightLarge = 8;

  let linhas = [];
  let assinada = false;

  if (vistoria.assinatura) {
    assinada = true;
    const a = vistoria.assinatura;
    const matricula = safeText(a.matricula) || "—";
    linhas = [
      { text: "Documento assinado eletronicamente", bold: true, size: 10, gap: lineHeight },
      {
        text: safeText(a.assinado_por),
        bold: true,
        size: 12,
        color: [27, 67, 50],
        gap: lineHeightLarge,
      },
      {
        text: `${safeText(a.cargo || "Chefe de Socorro")} · Mat. ${matricula}`,
        size: 10,
        gap: lineHeight,
      },
      { text: safeText(a.data_hora), bold: true, size: 10, gap: lineHeightLarge },
      {
        text: `${safeText(a.tipo || "Assinatura eletronica")} — BBA/CBMMA`,
        size: 8,
        color: [120, 120, 120],
        gap: 0,
      },
    ];
  } else {
    linhas = [
      { text: "Pendente de assinatura eletronica", bold: true, size: 10, gap: lineHeight },
      { text: "Chefe de Socorro", size: 10, gap: 0 },
    ];
  }

  const altura =
    paddingTop + paddingBottom + linhas.reduce((total, linha) => total + (linha.gap || lineHeight), 0);

  if (!blocoUnido && y + altura > pageH - PDF_MARGEM) {
    doc.addPage();
    y = PDF_MARGEM;
  }

  if (assinada) {
    doc.setFillColor(246, 249, 247);
    doc.setDrawColor(45, 106, 79);
    doc.setLineWidth(0.6);
  } else {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(176, 176, 176);
    doc.setLineWidth(0.4);
  }
  doc.rect(PDF_MARGEM, y, PDF_LARGURA, altura, "FD");

  let cy = y + paddingTop + 4;
  linhas.forEach((linha) => {
    doc.setFontSize(linha.size || 10);
    doc.setFont("helvetica", linha.bold ? "bold" : "normal");
    if (linha.color) {
      doc.setTextColor(linha.color[0], linha.color[1], linha.color[2]);
    } else {
      doc.setTextColor(0, 0, 0);
    }
    doc.text(linha.text, centro, cy, { align: "center" });
    cy += linha.gap || lineHeight;
  });

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  return y + altura + 6;
}

function calcularDimensaoFotoCaixa(imgW, imgH) {
  const ratio = imgW / imgH;
  let w = FOTO_CAIXA_LARGURA;
  let h = w / ratio;
  if (h > FOTO_CAIXA_ALTURA) {
    h = FOTO_CAIXA_ALTURA;
    w = h * ratio;
  }
  return { w, h };
}

function desenharFotos(doc, y, fotos) {
  if (!fotos.length) return y;

  y = tituloSecao(doc, y, "Registro Fotográfico");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const centro = pageW / 2;
  const frameX = centro - FOTO_CAIXA_LARGURA / 2;

  fotos.forEach((foto, idx) => {
    try {
      const data = safeText(foto.data);
      if (data.length < 20) return;
      const fmt = data.includes("image/png") ? "PNG" : "JPEG";

      if (y + FOTO_BLOCO_ALTURA > pageH - PDF_MARGEM) {
        doc.addPage();
        y = PDF_MARGEM;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(85, 85, 85);
      doc.text(`Foto ${idx + 1}`, centro, y + 4, { align: "center" });
      y += 8;

      doc.setFillColor(248, 248, 248);
      doc.setDrawColor(204, 204, 204);
      doc.setLineWidth(0.3);
      doc.rect(frameX, y, FOTO_CAIXA_LARGURA, FOTO_CAIXA_ALTURA, "FD");

      const props = doc.getImageProperties(data);
      const { w, h } = calcularDimensaoFotoCaixa(props.width, props.height);
      const ix = centro - w / 2;
      const iy = y + (FOTO_CAIXA_ALTURA - h) / 2;
      doc.addImage(data, fmt, ix, iy, w, h);

      doc.setTextColor(0, 0, 0);
      y += FOTO_CAIXA_ALTURA + 8;
    } catch (e) {
      console.warn("Foto nao incluida no PDF:", e);
    }
  });

  return y;
}

function gerarPdfVistoria(vistoria, opts) {
  vistoria = normalizarVistoriaPdf(vistoria);
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const notaMax = 3;
  const maxSim = vistoria.pontuacao_maxima || (vistoria.questionario ? 54 : 18);
  const res =
    vistoria.questionario && typeof calcularResultadoQuestionario === "function"
      ? calcularResultadoQuestionario(vistoria.questionario)
      : null;

  let y = desenharCabecalhoLaudo(doc, vistoria);
  y = desenharTabelaDados(doc, y, vistoria);

  if (vistoria.questionario && typeof QUESTIONARIO !== "undefined") {
    y = desenharSecoesQuestionario(doc, y, vistoria);
  } else if (typeof CRITERIOS !== "undefined") {
    y = tituloSecao(doc, y, "Avaliação de Risco (formato anterior)");
    const body = CRITERIOS.map((c) => {
      const val = (vistoria.notas || {})[c.id] ?? "—";
      return [c.label, String(val)];
    });
    doc.autoTable({
      ...estiloTabelaPadrao(),
      head: [["Critério", `Nota (0–${notaMax})`]],
      body,
      startY: y,
      columnStyles: { 0: { cellWidth: 120 }, 1: { cellWidth: 50, halign: "center" } },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  if (vistoria.observacoes) {
    y = tituloSecao(doc, y, "Observações adicionais");
    doc.autoTable({
      body: [[vistoria.observacoes]],
      startY: y,
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 4, overflow: "linebreak" },
      margin: { left: PDF_MARGEM, right: PDF_MARGEM },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  y = desenharSecao6(doc, y, res);
  y = desenharQuadroResultado(doc, vistoria, y, res, maxSim);
  y = desenharLegislacao(doc, y, vistoria);
  y = desenharRubricaEAssinatura(doc, y, vistoria);
  y = desenharFotos(doc, y, vistoria.fotos);

  const pageH = doc.internal.pageSize.getHeight();
  if (y + 10 > pageH - PDF_MARGEM) {
    doc.addPage();
    y = PDF_MARGEM;
  }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Documento gerado automaticamente pelo Sistema de Vistoria Arbórea — BBA/CBMMA.",
    PDF_MARGEM,
    y + 4
  );

  const nomeArquivo = `laudo_${String(numeroLaudoVistoria(vistoria)).replace("/", "_")}.pdf`;
  if (opts && opts.returnDoc) return doc;
  salvarPdf(doc, nomeArquivo);
}

function salvarPdf(doc, nomeArquivo) {
  const bridge = window.AndroidPdf;
  if (bridge && typeof bridge.pdfStart === "function") {
    const buffer = doc.output("arraybuffer");
    if (!buffer || !buffer.byteLength) {
      throw new Error("Falha ao gerar arquivo PDF");
    }
    const base64 = arrayBufferToBase64(buffer);
    const chunkSize = 512 * 1024;
    bridge.pdfStart(nomeArquivo);
    for (let i = 0; i < base64.length; i += chunkSize) {
      bridge.pdfAppend(base64.substring(i, i + chunkSize));
    }
    bridge.pdfFinish();
    return;
  }

  try {
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nomeArquivo;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  } catch (e) {
    doc.save(nomeArquivo);
  }
}

function autoTableDisponivel() {
  const jspdf = window.jspdf;
  return !!(jspdf && jspdf.jsPDF && jspdf.jsPDF.API && typeof jspdf.jsPDF.API.autoTable === "function");
}

function garantirAutoTable() {
  if (autoTableDisponivel()) return true;
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) return false;
  if (typeof window.applyPlugin === "function") {
    try {
      window.applyPlugin(jsPDF);
    } catch (e) {
      console.warn("Falha ao aplicar plugin autoTable:", e);
    }
  }
  return autoTableDisponivel();
}

async function abrirPdfVistoria(id) {
  try {
    let v = obterVistoria(id);
    if (!v) {
      alert("Vistoria não encontrada.");
      return;
    }
    if (typeof hidratarVistoria === "function") {
      v = await hidratarVistoria(v);
    }
    if (!window.jspdf) {
      alert("Biblioteca PDF não carregada.");
      return;
    }
    if (!garantirAutoTable()) {
      alert("Plugin de tabelas PDF não carregado.");
      return;
    }
    gerarPdfVistoria(v);
  } catch (e) {
    console.error("Erro ao gerar PDF:", e);
    alert("Erro ao gerar PDF: " + (e.message || e));
  }
}

async function compartilharPdfVistoria(id) {
  await abrirPdfVistoria(id);
}
