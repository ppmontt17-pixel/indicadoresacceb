export const sectorPanels = {
  faturamento: { name: "Painel de Faturamento", description: "Receita por convênio e status de glosas.", to: "/faturamento" },
  "financeiro-custos": { name: "Painel Financeiro", description: "Custos, fluxo de caixa e serviços principais.", to: "/financeiro" },
  recepcao: { name: "Painel de Recepção · Atendimento", description: "Atendimentos, convênios, exames e resultados da equipe.", to: "/recepcao" },
} as const;

export function getSectorPanel(slug: string) {
  if (slug === "faturamento" || slug === "financeiro-custos" || slug === "recepcao") return sectorPanels[slug];
  return undefined;
}

export function canUploadSpreadsheets(_isAdmin: boolean) {
  return false;
}