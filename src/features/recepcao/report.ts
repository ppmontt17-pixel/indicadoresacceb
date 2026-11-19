export type ReceptionRow = { periodo: string; grupo: string; item: string; quantidade: number };
export const receptionGroups = ["NÚMERO DE ATENDIMENTOS", "ATENDIMENTOS POR CONVENIO", "ATENDIMENTOS POR ESPECIALIDADE", "EXAMES DETALHADOS", "DESEMPENHO POR RECEPCIONISTA", "INCENTIVOS DE AVALIAÇÃO"] as const;
const normalize = (v: unknown) => String(v ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();

export function parseReceptionSheet(matrix: unknown[][]): ReceptionRow[] {
  const title = matrix.flat().find((v) => normalize(v).includes("RELATORIO DA RECEPCAO"));
  if (!title) return [];
  const period = String(title).split(/\s[-–]\s/).slice(1).join(" - ").trim();
  if (!period) throw new Error("O título do relatório precisa informar o mês e o ano.");
  let group = "";
  const rows: ReceptionRow[] = [];
  for (const line of matrix) {
    const label = String(line[0] ?? "").trim();
    const header = receptionGroups.find((g) => normalize(g) === normalize(label));
    if (header) { group = header; continue; }
    if (!label || !group || line[1] === undefined || line[1] === "") continue;
    const quantity = typeof line[1] === "number" ? line[1] : Number(String(line[1]).replace(/\./g, "").replace(",", "."));
    if (!Number.isFinite(quantity) || quantity < 0 || !Number.isInteger(quantity)) throw new Error(`Quantidade inválida em ${label}.`);
    rows.push({ periodo: period, grupo: group, item: label, quantidade: quantity });
  }
  return rows;
}

export function receptionSummary(rows: ReceptionRow[]) {
  const overview = rows.filter((r) => r.grupo === receptionGroups[0]);
  const total = overview.find((r) => normalize(r.item) === "TOTAL")?.quantidade ?? overview.reduce((s, r) => s + r.quantidade, 0);
  const get = (label: string) => overview.find((r) => normalize(r.item) === label)?.quantidade ?? 0;
  const sum = (group: string) => rows.filter((r) => r.grupo === group).reduce((s, r) => s + r.quantidade, 0);
  return { total, consultas: get("CONSULTAS E RETORNOS"), exames: get("EXAMES"), terapias: get("TERAPIAS"), convenios: sum(receptionGroups[1]), especialidades: sum(receptionGroups[2]), examesDetalhados: sum(receptionGroups[3]), recepcionistas: sum(receptionGroups[4]), avaliacoes: sum(receptionGroups[5]) };
}

export function isReceptionRows(rows: unknown[]): rows is ReceptionRow[] {
  return rows.length > 0 && rows.every((r) => typeof r === "object" && r !== null && "grupo" in r && "quantidade" in r && "periodo" in r && "item" in r);
}