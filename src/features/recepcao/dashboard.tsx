import { useMemo, useState } from "react";
import { Activity, ClipboardCheck, HeartPulse, Microscope, Search, AlertTriangle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { receptionGroups, receptionSummary, type ReceptionRow } from "./report";

const labels = ["Atendimentos", "Convênios", "Especialidades", "Exames", "Recepcionistas", "Avaliações"];
const fmt = (n: number) => n.toLocaleString("pt-BR");
export function ReceptionDashboard({ rows }: { rows: ReceptionRow[] }) {
  const [groupIndex, setGroupIndex] = useState(1);
  const [search, setSearch] = useState("");
  const summary = useMemo(() => receptionSummary(rows), [rows]);
  const entries = rows.filter((r) => r.grupo === receptionGroups[groupIndex] && r.item !== "TOTAL").sort((a,b) => b.quantidade - a.quantidade);
  const filtered = entries.filter((r) => r.item.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")));
  const subtotal = entries.reduce((s,r) => s+r.quantidade,0);
  const checks = [
    { label: "Convênios", detail: summary.convenios, reference: summary.total },
    { label: "Exames detalhados", detail: summary.examesDetalhados, reference: summary.exames },
    { label: "Recepcionistas", detail: summary.recepcionistas, reference: summary.total },
    { label: "Especialidades", detail: summary.especialidades, reference: summary.consultas + summary.terapias },
  ].filter((c) => c.detail !== c.reference);
  return <div className="mt-8 space-y-8">
    <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-semibold uppercase tracking-wider text-primary">{rows[0]?.periodo}</p><h2 className="mt-2 font-display text-3xl">Resultados da recepção</h2></div><p className="text-sm text-muted-foreground">{fmt(summary.avaliacoes)} incentivos de avaliação</p></div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{[
      { label: "Total de atendimentos", value: summary.total, icon: Activity },
      { label: "Consultas e retornos", value: summary.consultas, icon: ClipboardCheck },
      { label: "Exames", value: summary.exames, icon: Microscope },
      { label: "Terapias", value: summary.terapias, icon: HeartPulse },
    ].map((k) => <div key={k.label} className="rounded-lg border bg-card p-5 shadow-soft"><k.icon className="mb-4 size-5 text-primary"/><p className="text-xs font-semibold uppercase text-muted-foreground">{k.label}</p><p className="mt-2 font-display text-3xl">{fmt(k.value)}</p>{k.value !== summary.total && <p className="mt-2 text-sm text-muted-foreground">{summary.total ? (k.value / summary.total * 100).toLocaleString("pt-BR", {maximumFractionDigits:1}) : "0"}% do total</p>}</div>)}</div>
    <section>
      <div className="flex flex-wrap gap-2 border-b pb-4" aria-label="Informações da recepção">{labels.map((label,i) => <Button key={label} variant={groupIndex === i ? "default" : "outline"} onClick={() => {setGroupIndex(i);setSearch("");}}>{label}</Button>)}</div>
      <div className="my-6 flex flex-wrap items-end justify-between gap-3"><div><h3 className="font-display text-2xl">{labels[groupIndex]}</h3><p className="text-sm text-muted-foreground">{fmt(subtotal)} registros contabilizados · {entries.length} categorias</p></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input aria-label="Buscar categoria" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Buscar" className="bg-card pl-9"/></div></div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="min-w-0"><p className="mb-3 text-sm text-muted-foreground">{filtered.length > 10 ? "10 maiores volumes" : "Volume por categoria"}</p><ChartContainer config={{ quantidade: { label:"Atendimentos",color:"var(--chart-1)" } }} className="h-[400px] w-full"><BarChart data={filtered.slice(0,10)} layout="vertical" margin={{left:0,right:20}}><CartesianGrid horizontal={false}/><XAxis type="number" tickLine={false}/><YAxis type="category" dataKey="item" width={120} tick={{fontSize:10}} tickFormatter={(v:string)=>v.length>18 ? v.slice(0,17)+"…" : v} tickLine={false}/><ChartTooltip content={<ChartTooltipContent/>}/><Bar dataKey="quantidade" fill="var(--color-quantidade)" radius={4}/></BarChart></ChartContainer></div>
        <div className="max-h-[440px] overflow-auto rounded-lg border bg-card"><Table><TableHeader><TableRow><TableHead>Categoria</TableHead><TableHead className="text-right">Quantidade</TableHead><TableHead className="text-right">Participação</TableHead></TableRow></TableHeader><TableBody>{filtered.map((r)=><TableRow key={r.item}><TableCell className="max-w-56 whitespace-normal text-xs">{r.item}</TableCell><TableCell className="text-right font-semibold">{fmt(r.quantidade)}</TableCell><TableCell className="text-right text-muted-foreground">{subtotal ? (r.quantidade/subtotal*100).toLocaleString("pt-BR",{maximumFractionDigits:1}):"0"}%</TableCell></TableRow>)}{!filtered.length && <TableRow><TableCell colSpan={3} className="py-8 text-center">Nenhuma categoria encontrada.</TableCell></TableRow>}</TableBody></Table></div>
      </div>
    </section>
    {checks.length > 0 && <section className="border-t pt-6"><h3 className="flex items-center gap-2 font-semibold"><AlertTriangle className="size-5 text-warning"/>Conferência do relatório</h3><p className="mt-2 text-sm text-muted-foreground">Valores preservados conforme a planilha. As diferenças abaixo precisam de conferência.</p><ul className="mt-4 space-y-2 text-sm">{checks.map((c)=><li key={c.label}><strong>{c.label}:</strong> {fmt(c.detail)} no detalhamento, frente a {fmt(c.reference)} na referência — diferença de {fmt(c.detail-c.reference)}.</li>)}</ul><p className="mt-3 text-xs text-muted-foreground">Referência de especialidades: consultas e retornos + terapias.</p></section>}
  </div>;
}