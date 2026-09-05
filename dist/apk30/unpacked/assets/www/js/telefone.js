function limparTelefone(valor) {
  return String(valor || "").replace(/\D/g, "").slice(0, 11);
}

function formatarTelefone(valor) {
  const d = limparTelefone(valor);
  if (!d.length) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function aplicarMascaraTelefone(input) {
  if (!input) return;
  input.value = formatarTelefone(input.value);
}

function initMascaraTelefone(input) {
  if (!input) return;
  input.maxLength = 15;
  input.addEventListener("input", () => aplicarMascaraTelefone(input));
  input.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text") || "";
    input.value = text;
    aplicarMascaraTelefone(input);
  });
  input.addEventListener("beforeinput", (e) => {
    if (e.inputType !== "insertText" && e.inputType !== "insertCompositionText") return;
    const digitos = limparTelefone(input.value).length;
    const selecionado = (input.selectionEnd || 0) - (input.selectionStart || 0);
    const novos = String(e.data || "").replace(/\D/g, "").length;
    if (selecionado === 0 && digitos >= 11 && novos > 0) e.preventDefault();
  });
}
