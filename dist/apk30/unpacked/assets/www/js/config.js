const CRITERIOS = [
  { id: "nota_tronco", label: "Estado do Tronco", descricao: "Fissuras, oca, fungos, necrose, ferimentos" },
  { id: "nota_raizes", label: "Estado das Raízes / Solo", descricao: "Raízes expostas, levantamento de solo, compactação" },
  { id: "nota_inclinacao", label: "Inclinação / Estabilidade", descricao: "Desvio do eixo vertical, risco de queda" },
  { id: "nota_copa", label: "Estado da Copa", descricao: "Galhos secos, dieback, densidade irregular" },
  { id: "nota_pragas", label: "Pragas e Doenças", descricao: "Presença de insetos, fungos, doenças visíveis" },
  { id: "nota_proximidade", label: "Proximidade a Riscos", descricao: "Fiação, edificações, vias, áreas de circulação" },
];

const LIMIARES = { supressao: 15, intervencao: 11, acompanhamento: 6 };
const NOTA_MAX = 3;

function calcularResultado(notas) {
  const total = CRITERIOS.reduce((s, c) => s + (parseInt(notas[c.id], 10) || 0), 0);
  const maxTotal = CRITERIOS.length * NOTA_MAX;
  let recomendacao, justificativa;

  if (total >= LIMIARES.supressao) {
    recomendacao = "SUPRESSÃO";
    justificativa = `Pontuação total de ${total}/${maxTotal} indica risco crítico. Recomenda-se a supressão da árvore após autorização municipal.`;
  } else if (total >= LIMIARES.intervencao) {
    recomendacao = "INTERVENÇÃO URGENTE";
    justificativa = `Pontuação total de ${total}/${maxTotal} indica risco elevado. Intervenções imediatas são necessárias (podas, cabos, contenção).`;
  } else if (total >= LIMIARES.acompanhamento) {
    recomendacao = "PODAS / ACOMPANHAMENTO";
    justificativa = `Pontuação total de ${total}/${maxTotal} indica risco moderado. Recomenda-se podas corretivas e nova vistoria em 6–12 meses.`;
  } else {
    recomendacao = "MANUTENÇÃO";
    justificativa = `Pontuação total de ${total}/${maxTotal} indica baixo risco. Manutenção preventiva periódica é suficiente.`;
  }

  return {
    pontuacao_total: total,
    pontuacao_maxima: maxTotal,
    recomendacao,
    justificativa,
    supressao_recomendada: total >= LIMIARES.supressao,
  };
}

const CABECALHO_LAUDO = {
  linhas: [
    "SECRETARIA DE SEGURANÇA PÚBLICA",
    "CORPO DE BOMBEIROS MILITAR DO MARANHÃO",
    "BATALHÃO DE BOMBEIROS AMBIENTAL",
  ],
  titulo: "RELATÓRIO DE VISTORIA DE ÁRVORE",
};

const MODULOS = [
  { id: "arvores", nome: "Vistoria de Árvores", descricao: "Avaliação de risco arbóreo e laudo", icone: "🌳", cor: "#2d6a4f", url: "arvores/index.html", ativo: true },
  { id: "materiais", nome: "Checklist de Materiais", descricao: "Controle de equipamentos e EPIs", icone: "📦", icone_img: "img/icon-motosserra.svg", cor: "#f5921e", ativo: false },
  { id: "viaturas", nome: "Vistoria de Viaturas", descricao: "Inspeção de veículos da frota", icone: "🚗", icone_img: "img/icon-viatura-bombeiro.svg", cor: "#c62828", url: "viaturas/index.html", ativo: true },
  { id: "legislacao", nome: "Legislação", descricao: "Portarias, BG, manuais e normas", icone: "⚖️", cor: "#334155", url: "legislacao/index.html", ativo: true },
  { id: "pop", nome: "POP", descricao: "Procedimentos operacionais padrão", icone: "📋", cor: "#0f766e", url: "pop/index.html", ativo: true },
  { id: "treinamentos", nome: "Treinamentos", descricao: "Cursos e capacitações", icone: "🎓", cor: "#1d4ed8", ativo: false },
];
