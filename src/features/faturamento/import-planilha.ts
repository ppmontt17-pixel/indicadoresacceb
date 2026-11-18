import { toNumber, type Row } from "@/lib/report-stats";

export type SheetData = { name: string; rows: Row[] };

export type FaturamentoInsert = {
  operadora: string;
  mes: string;
  ano: number;
  faturado: number;
  pago: number;
  glosado: number;
  pendente: number;
  contas: number;
};

export type GlosaInsert = {
  operadora: string;
  mes: string;
  ano: number;
  numero_guia: string | null;
  paciente: string | null;
  procedimento: string | null;
  motivo: string | null;
  valor_glosado: number;
  valor_recuperado: number;
  status: string;
};

const GLOSA_STATUSES = [
  "Em análise",
  "A recursar",
  "Pago",
  "Pago Parcial",
  "Glosa devida",
  "Não Pago",
  "Excedeu o Prazo",
] as const;

/** Lowercase, strip accents and non-alphanumerics: "Valor Glosado" -> "valorglosado". */
export function normalizeHeader(h: string): string {
  return h
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function findCol(columns: string[], ...aliases: string[]): string | null {
  const wanted = aliases.map(normalizeHeader);
  for (const c of columns) if (wanted.includes(normalizeHeader(c))) return c;
  return null;
}

const text = (v: unknown): string | null => {
  const s = String(v ?? "").trim();
  return s || null;
};

const MES_ALIASES: Record<string, string> = {
  jan: "Janeiro", janeiro: "Janeiro",
  fev: "Fevereiro", fevereiro: "Fevereiro",
  mar: "Março", marco: "Março",
  abr: "Abril", abril: "Abril",
  mai: "Maio", maio: "Maio",
  jun: "Junho", junho: "Junho",
  jul: "Julho", julho: "Julho",
  ago: "Agosto", agosto: "Agosto",
  set: "Setembro", setembro: "Setembro",
  out: "Outubro", outubro: "Outubro",
  nov: "Novembro", novembro: "Novembro",
  dez: "Dezembro", dezembro: "Dezembro",
};

export function normalizeMes(v: unknown): string | null {
  const key = normalizeHeader(String(v ?? ""));
  return MES_ALIASES[key] ?? null;
}

function normalizeStatus(v: unknown): string {
  const key = normalizeHeader(String(v ?? ""));
  const match = GLOSA_STATUSES.find((s) => normalizeHeader(s) === key);
  return match ?? "Em análise";
}

export function isFaturamentoSheet(columns: string[]): boolean {
  return Boolean(
    findCol(columns, "operadora") &&
      findCol(columns, "mes", "mês") &&
      findCol(columns, "ano") &&
      findCol(columns, "faturado", "valor faturado"),
  );
}

export function isGlosaSheet(columns: string[]): boolean {
  return Boolean(
    findCol(columns, "operadora") &&
      findCol(columns, "mes", "mês") &&
      findCol(columns, "ano") &&
      findCol(columns, "valor glosado", "valor_glosado", "glosado"),
  );
}

export function buildFaturamentoInserts(rows: Row[], columns: string[]): FaturamentoInsert[] {
  const cOp = findCol(columns, "operadora")!;
  const cMes = findCol(columns, "mes", "mês")!;
  const cAno = findCol(columns, "ano")!;
  const cFat = findCol(columns, "faturado", "valor faturado")!;
  const cPago = findCol(columns, "pago", "valor pago");
  const cGlo = findCol(columns, "glosado", "valor glosado");
  const cPen = findCol(columns, "pendente", "valor pendente");
  const cContas = findCol(columns, "contas", "qtd contas", "quantidade de contas");
  const out: FaturamentoInsert[] = [];
  for (const r of rows) {
    const operadora = text(r[cOp]);
    const mes = normalizeMes(r[cMes]);
    const ano = toNumber(r[cAno]);
    if (!operadora || !mes || !ano) continue;
    out.push({
      operadora,
      mes,
      ano: Math.trunc(ano),
      faturado: toNumber(r[cFat]) ?? 0,
      pago: cPago ? (toNumber(r[cPago]) ?? 0) : 0,
      glosado: cGlo ? (toNumber(r[cGlo]) ?? 0) : 0,
      pendente: cPen ? (toNumber(r[cPen]) ?? 0) : 0,
      contas: cContas ? Math.trunc(toNumber(r[cContas]) ?? 0) : 0,
    });
  }
  return out;
}

export function buildGlosaInserts(rows: Row[], columns: string[]): GlosaInsert[] {
  const cOp = findCol(columns, "operadora")!;
  const cMes = findCol(columns, "mes", "mês")!;
  const cAno = findCol(columns, "ano")!;
  const cGuia = findCol(columns, "numero guia", "nº guia", "guia", "numero_guia");
  const cPac = findCol(columns, "paciente");
  const cProc = findCol(columns, "procedimento");
  const cMot = findCol(columns, "motivo", "motivo da glosa");
  const cVG = findCol(columns, "valor glosado", "valor_glosado", "glosado")!;
  const cVR = findCol(columns, "valor recuperado", "valor_recuperado", "recuperado");
  const cStatus = findCol(columns, "status", "situação", "situacao");
  const out: GlosaInsert[] = [];
  for (const r of rows) {
    const operadora = text(r[cOp]);
    const mes = normalizeMes(r[cMes]);
    const ano = toNumber(r[cAno]);
    if (!operadora || !mes || !ano) continue;
    out.push({
      operadora,
      mes,
      ano: Math.trunc(ano),
      numero_guia: cGuia ? text(r[cGuia]) : null,
      paciente: cPac ? text(r[cPac]) : null,
      procedimento: cProc ? text(r[cProc]) : null,
      motivo: cMot ? text(r[cMot]) : null,
      valor_glosado: toNumber(r[cVG]) ?? 0,
      valor_recuperado: cVR ? (toNumber(r[cVR]) ?? 0) : 0,
      status: cStatus ? normalizeStatus(r[cStatus]) : "Em análise",
    });
  }
  return out;
}
