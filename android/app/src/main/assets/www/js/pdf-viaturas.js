const PDF_MARGEM = 20;
const PDF_LARGURA = 170;

function corStatusViatura(rec) {
  if (rec === "IMPEDIDA") return [253, 232, 232];
  if (rec === "APROVADA COM RESTRIÇÕES") return [255, 248, 231];
  return [216, 243, 220];
}

function desenharCabecalhoViatura(doc, vistoria) {
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

  const numero = numeroVistoriaViatura(vistoria);
  doc.setFontSize(11);
  doc.text(`CHECKLIST DE VISTORIA DE VIATURA Nº ${numero}`, center, y + 2, { align: "center" });
  return y + 12;
}

function gerarPdfViatura(vistoria) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const checklist = vistoria.checklist || {};
  const totalItens = typeof totalItensChecklistViatura === "function" ? totalItensChecklistViatura() : 19;
  const status = statusViatura(vistoria);

  let y = desenharCabecalhoViatura(doc, vistoria);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);

  const [r, g, b] = corStatusViatura(vistoria.recomendacao);
  doc.setFillColor(r, g, b);
  doc.setDrawColor(198, 40, 40);
  doc.roundedRect(PDF_MARGEM, y, PDF_LARGURA, 22, 2, 2, "FD");
  doc.text(`Status: ${status}`, PDF_MARGEM + 4, y + 7);
  doc.text(
    `Itens não conformes: ${vistoria.pontuacao_total || 0} / ${totalItens}`,
    PDF_MARGEM + 4,
    y + 13
  );
  const just = doc.splitTextToSize(vistoria.justificativa || "—", PDF_LARGURA - 8);
  doc.text(just, PDF_MARGEM + 4, y + 19);
  y += 28;

  doc.autoTable({
    startY: y,
    head: [["Campo", "Valor"]],
    body: [
      ["Nº da vistoria", numeroVistoriaViatura(vistoria)],
      ["Data", formatarDataHoraBr(vistoria.created_at)],
      ["Condutor", vistoria.condutor || "—"],
      ["Viatura", textoViatura(vistoria)],
      ["Quilometragem", vistoria.km || "—"],
      ["Status", status],
    ],
    ...estiloTabelaPadrao(10),
  });
  y = doc.lastAutoTable.finalY + 6;

  (CHECKLIST_VIATURA_SECOES || []).forEach((secao) => {
    if (y > 250) {
      doc.addPage();
      y = PDF_MARGEM;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(198, 40, 40);
    doc.text(secao.titulo, PDF_MARGEM, y);
    y += 4;

    const body = secao.perguntas.map((p) => {
      const val = checklist[p.id] || "nao";
      return [p.numero, p.texto + (p.critico ? " ⚠" : ""), val === "sim" ? "SIM" : "NÃO"];
    });

    doc.autoTable({
      startY: y,
      head: [["Item", "Descrição", "Conforme"]],
      body,
      columnStyles: { 0: { cellWidth: 14 }, 2: { cellWidth: 22 } },
      ...estiloTabelaPadrao(9),
    });
    y = doc.lastAutoTable.finalY + 4;
  });

  if (vistoria.observacoes) {
    if (y > 260) {
      doc.addPage();
      y = PDF_MARGEM;
    }
    doc.setFont("helvetica", "bold");
    doc.setTextColor(198, 40, 40);
    doc.text("Observações", PDF_MARGEM, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const obs = doc.splitTextToSize(String(vistoria.observacoes), PDF_LARGURA);
    doc.text(obs, PDF_MARGEM, y);
    y += obs.length * 4 + 4;
  }

  if (y > 250) {
    doc.addPage();
    y = PDF_MARGEM;
  }
  doc.setFont("helvetica", "bold");
  doc.setTextColor(198, 40, 40);
  doc.text("Assinatura do Condutor de viatura", PDF_MARGEM, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  if (vistoria.assinatura) {
    const a = vistoria.assinatura;
    doc.text(a.assinado_por || "—", PDF_MARGEM, y);
    doc.text(a.cargo || "Condutor de viatura", PDF_MARGEM, y + 5);
    doc.text(a.data_hora || "", PDF_MARGEM, y + 10);
    doc.setFontSize(8);
    doc.text(a.tipo || "Assinatura eletrônica", PDF_MARGEM, y + 15);
  } else {
    doc.text("Aguardando assinatura do Condutor de viatura.", PDF_MARGEM, y);
  }

  const nomeArquivo = `checklist_viatura_${String(numeroVistoriaViatura(vistoria)).replace("/", "_")}.pdf`;
  salvarPdf(doc, nomeArquivo);
}

async function abrirPdfViatura(id) {
  try {
    const v = obterVistoriaViatura(id);
    if (!v) {
      alert("Vistoria não encontrada.");
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
    gerarPdfViatura(v);
  } catch (e) {
    console.error("Erro ao gerar PDF:", e);
    alert("Não foi possível gerar o PDF.");
  }
}
