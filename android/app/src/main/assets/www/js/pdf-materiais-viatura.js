function tituloSecaoMateriais(doc, y, texto) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(45, 106, 79);
  doc.text(String(texto), PDF_MARGEM, y);
  doc.setTextColor(0, 0, 0);
  return y + 7;
}

function desenharCabecalhoMateriais(doc, item) {
  const pageW = doc.internal.pageSize.getWidth();
  const center = pageW / 2;
  let y = PDF_MARGEM;
  const logo = typeof LOGO_BBA_DATA_URL !== "undefined" ? LOGO_BBA_DATA_URL : null;

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
  [
    "SECRETARIA DE SEGURANÇA PÚBLICA",
    "CORPO DE BOMBEIROS MILITAR DO MARANHÃO",
    "BATALHÃO DE BOMBEIROS AMBIENTAL",
  ].forEach((linha) => {
    doc.text(linha, center, y, { align: "center" });
    y += 5;
  });

  doc.setFontSize(11);
  doc.text("CONFERÊNCIA DE MATERIAIS DA VIATURA", center, y + 2, { align: "center" });
  y += 10;

  doc.setDrawColor(45, 106, 79);
  doc.setLineWidth(0.5);
  doc.line(PDF_MARGEM, y, pageW - PDF_MARGEM, y);
  doc.setTextColor(0, 0, 0);
  return y + 8;
}

function textoViaturaPdf(v) {
  const ar = String(v.ar || "").trim();
  const marca = String(v.marca || "").trim();
  const modelo = String(v.modelo || "").trim();
  const placa = String(v.placa || "").trim();
  const nome = `${marca} ${modelo}`.trim();
  if (ar && nome) return placa ? `AR ${ar} — ${nome} · ${placa}` : `AR ${ar} — ${nome}`;
  return ar || placa || "—";
}

function nomeArquivoMateriais(item) {
  const data = String(item.data_servico || "conferencia").replace(/-/g, "");
  return `conferencia_materiais_${data}_${item.id || "0"}.pdf`;
}

function gerarPdfMateriais(item, opts) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = desenharCabecalhoMateriais(doc, item);

  const servico = [
    ["Data do serviço", dataExtensoMaterial(item.data_servico)],
    ["Dia da semana", item.dia_semana || "—"],
    ["Chefe de socorro", item.chefe_socorro || "—"],
  ];
  if (item.contato) servico.push(["Contato funcional", item.contato]);
  if (item.condutor) servico.push(["Motorista", item.condutor]);
  if (item.comandante) servico.push(["Comandante de guarnição", item.comandante]);
  if (item.oficial_dia) servico.push(["Oficial de dia", item.oficial_dia]);
  if (item.tipo_checklist) {
    servico.push([
      "Tipo de checklist",
      item.tipo_checklist === "foto" ? "Checklist com Foto" : "Checklist Manual",
    ]);
  }

  doc.autoTable({
    ...estiloTabelaPadrao(),
    head: [["Campo", "Valor"]],
    body: servico,
    startY: y,
    headStyles: { fillColor: [45, 106, 79] },
    columnStyles: { 0: { cellWidth: 52, fontStyle: "bold" }, 1: { cellWidth: 118 } },
  });
  y = doc.lastAutoTable.finalY + 6;

  const viaturas = item.viaturas || [];
  if (viaturas.length) {
    y = tituloSecaoMateriais(doc, y, "Viaturas");
    doc.autoTable({
      ...estiloTabelaPadrao(9),
      head: [["Viatura", "KM inicial", "Abastecimento"]],
      body: viaturas.map((v) => [
        textoViaturaPdf(v),
        v.km_inicial || v.km || "—",
        v.abastecimento || v.k7 || "—",
      ]),
      startY: y,
      headStyles: { fillColor: [45, 106, 79] },
      columnStyles: { 0: { cellWidth: 88 }, 1: { cellWidth: 38 }, 2: { cellWidth: 44 } },
    });
    y = doc.lastAutoTable.finalY + 6;
  }

  (item.secoes || []).forEach((secao) => {
    y = tituloSecaoMateriais(doc, y, secao.titulo || "Materiais");
    const body = (secao.itens || []).map((mat) => {
      const qtd = mat.status === "alterado" && mat.qtd_nova ? mat.qtd_nova : mat.qtd;
      const obs = [mat.obs, mat.status === "alterado" ? mat.obs_nova : ""].filter(Boolean).join(" · ");
      return [qtdLabelMaterial(qtd), mat.nome || "—", (mat.status || "pronto"), obs || "—"];
    });
    doc.autoTable({
      ...estiloTabelaPadrao(8),
      head: [["Qtd", "Material", "Status", "Observação"]],
      body,
      startY: y,
      headStyles: { fillColor: [45, 106, 79] },
      columnStyles: {
        0: { cellWidth: 14, halign: "center" },
        1: { cellWidth: 72 },
        2: { cellWidth: 24 },
        3: { cellWidth: 60 },
      },
    });
    y = doc.lastAutoTable.finalY + 6;
  });

  const assinaturas = item.assinaturas || {};
  if (assinaturas.saindo || assinaturas.entrando) {
    y = tituloSecaoMateriais(doc, y, "Passagem de serviço");
    if (assinaturas.saindo) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`Saindo: ${assinaturas.saindo.nome || "—"}`, PDF_MARGEM, y);
      y += 5;
      if (assinaturas.saindo.imagem) {
        try {
          const fmt = assinaturas.saindo.imagem.includes("image/png") ? "PNG" : "JPEG";
          doc.addImage(assinaturas.saindo.imagem, fmt, PDF_MARGEM, y, 70, 24);
          y += 28;
        } catch (e) {
          console.warn("Assinatura saindo nao incluida:", e);
        }
      }
    }
    if (assinaturas.entrando) {
      doc.setFont("helvetica", "bold");
      doc.text(`Entrando: ${assinaturas.entrando.nome || "—"}`, PDF_MARGEM, y);
      y += 5;
      if (assinaturas.entrando.imagem) {
        try {
          const fmt = assinaturas.entrando.imagem.includes("image/png") ? "PNG" : "JPEG";
          doc.addImage(assinaturas.entrando.imagem, fmt, PDF_MARGEM, y, 70, 24);
          y += 28;
        } catch (e) {
          console.warn("Assinatura entrando nao incluida:", e);
        }
      }
    }
  }

  const pageH = doc.internal.pageSize.getHeight();
  if (y + 10 > pageH - PDF_MARGEM) {
    doc.addPage();
    y = PDF_MARGEM;
  }
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Documento gerado automaticamente — Sistema BBA/CBMMA.",
    PDF_MARGEM,
    y + 4
  );

  const nomeArquivo = nomeArquivoMateriais(item);
  if (opts && opts.returnDoc) return { doc, nomeArquivo };
  salvarPdf(doc, nomeArquivo);
}

async function abrirPdfMateriais(id) {
  try {
    const item = obterConferenciaMateriais(id);
    if (!item) {
      alert("Conferência não encontrada.");
      return;
    }
    if (!window.jspdf) {
      alert("Biblioteca PDF não carregada.");
      return;
    }
    if (typeof garantirAutoTable === "function" && !garantirAutoTable()) {
      alert("Plugin de tabelas PDF não carregado.");
      return;
    }
    gerarPdfMateriais(item);
  } catch (e) {
    console.error("Erro ao gerar PDF:", e);
    alert("Não foi possível gerar o PDF.");
  }
}

async function compartilharPdfMateriais(id) {
  try {
    const item = obterConferenciaMateriais(id);
    if (!item) {
      alert("Conferência não encontrada.");
      return;
    }
    if (!window.jspdf) {
      alert("Biblioteca PDF não carregada.");
      return;
    }
    if (typeof garantirAutoTable === "function" && !garantirAutoTable()) {
      alert("Plugin de tabelas PDF não carregado.");
      return;
    }
    const { doc, nomeArquivo } = gerarPdfMateriais(item, { returnDoc: true });
    const blob = doc.output("blob");
    const titulo = `Conferência ${dataExtensoMaterial(item.data_servico)}`;
    const file = new File([blob], nomeArquivo, { type: "application/pdf" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: titulo });
      return;
    }
    salvarPdf(doc, nomeArquivo);
  } catch (e) {
    if (e && e.name === "AbortError") return;
    console.error("Erro ao compartilhar PDF:", e);
    alert("Não foi possível compartilhar o PDF.");
  }
}

function bindAcoesMateriais(root) {
  const scope = root || document;
  scope.querySelectorAll(".btn-acao-pdf-materiais").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (btn.disabled) return;
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Gerando…";
      try {
        await abrirPdfMateriais(btn.dataset.id);
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  });
  scope.querySelectorAll(".btn-acao-share-materiais").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (btn.disabled) return;
      const label = btn.textContent;
      btn.disabled = true;
      btn.textContent = "Preparando…";
      try {
        await compartilharPdfMateriais(btn.dataset.id);
      } finally {
        btn.disabled = false;
        btn.textContent = label;
      }
    });
  });
}
