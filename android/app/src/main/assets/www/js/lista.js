document.querySelectorAll(".btn-acao-share, .btn-share-pdf").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const url = btn.dataset.pdfUrl;
    const titulo = btn.dataset.titulo || "Laudo de Vistoria";
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error("Falha ao baixar PDF");
      const blob = await resp.blob();
      const file = new File([blob], `${titulo.replace(/\s+/g, "_")}.pdf`, {
        type: "application/pdf",
      });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: titulo });
        return;
      }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      window.open(url, "_blank");
    }
  });
});

if (location.hash) {
  const el = document.querySelector(location.hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
}
