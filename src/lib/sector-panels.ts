export const sectorPanels = {
  faturamento: { name: "Painel de Faturamento", description: "Receita por convênio e status de glosas.", to: "/faturamento" },
  "financeiro-custos": { name: "Painel Financeiro", description: "Custos, fluxo de caixa e serviços principais.", to: "/financeiro" },
} as const;

export function getSectorPanel(slug: string) {
  if (slug === "faturamento" || slug === "financeiro-custos") return sectorPanels[slug];
  return undefined;
}

export function canUploadSpreadsheets(isAdmin: boolean) {
  return isAdmin;
}