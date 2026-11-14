import { supabase } from "@/integrations/supabase/client";

export type FaturamentoRow = {
  id: string; operadora: string; mes: string; ano: number;
  faturado: number; pago: number; glosado: number; pendente: number; contas: number;
};
export type GlosaRow = {
  id: string; operadora: string; mes: string; ano: number;
  numero_guia: string | null; paciente: string | null; procedimento: string | null; motivo: string | null;
  valor_glosado: number; valor_recuperado: number;
  status: "Em análise" | "A recursar" | "Pago" | "Pago Parcial" | "Glosa devida" | "Não Pago" | "Excedeu o Prazo";
};

const n = (v: unknown) => { const x = typeof v === "number" ? v : parseFloat(String(v)); return Number.isFinite(x) ? x : 0; };

export async function listFaturamento(): Promise<FaturamentoRow[]> {
  const { data, error } = await supabase.from("faturamento").select("*").range(0, 9999);
  if (error) throw new Error(error.message);
  return data.map((r) => ({ ...r, faturado: n(r.faturado), pago: n(r.pago), glosado: n(r.glosado), pendente: n(r.pendente) }));
}

export async function listGlosasFn(): Promise<GlosaRow[]> {
  const { data, error } = await supabase.from("glosas").select("*").range(0, 9999);
  if (error) throw new Error(error.message);
  return data.map((r) => ({ ...r, valor_glosado: n(r.valor_glosado), valor_recuperado: n(r.valor_recuperado), status: r.status as GlosaRow["status"] }));
}
