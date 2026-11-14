export type Row = Record<string, unknown>;

export function toNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  let s = v.trim().replace(/R\$|\s|%/g, "");
  if (!s) return null;
  // Brazilian format: 1.234,56
  if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** A column is numeric when at least 80% of its filled cells are numbers. */
export function analyzeColumns(columns: string[], rows: Row[]) {
  const numeric: string[] = [];
  const text: string[] = [];
  for (const c of columns) {
    const filled = rows.map((r) => r[c]).filter((v) => v !== null && v !== undefined && v !== "");
    if (!filled.length) continue;
    const nums = filled.filter((v) => toNumber(v) !== null).length;
    (nums / filled.length >= 0.8 ? numeric : text).push(c);
  }
  return { numeric, text };
}

export function sumColumn(rows: Row[], col: string) {
  return rows.reduce((acc, r) => acc + (toNumber(r[col]) ?? 0), 0);
}

export function groupSum(rows: Row[], by: string, col: string, limit = 12) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const k = String(r[by] ?? "—").trim() || "—";
    map.set(k, (map.get(k) ?? 0) + (toNumber(r[col]) ?? 0));
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
