import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowUpRight, FileSpreadsheet, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { accessQuery } from "@/lib/access";
import { getSectorPanel } from "@/lib/sector-panels";
import { isReceptionRows } from "@/features/recepcao/report";
import { ReceptionDashboard } from "@/features/recepcao/dashboard";
import { analyzeColumns, fmt, groupSum, sumColumn, type Row } from "@/lib/report-stats";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const reportsQuery = (sectorId: string) =>
  queryOptions({
    queryKey: ["reports", sectorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reports").select("*").eq("sector_id", sectorId).order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((r) => ({ ...r, columns: r.columns as string[], rows: r.rows as Row[] }));
    },
  });

export const Route = createFileRoute("/_authenticated/setor/$slug")({
  head: () => ({
    meta: [
      { title: "Setor — Portal ACCEB" },
      { name: "description", content: "Relatórios do setor a partir das planilhas enviadas." },
      { property: "og:title", content: "Setor — Portal ACCEB" },
      { property: "og:description", content: "Relatórios do setor a partir das planilhas enviadas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context, params }) => {
    const access = await context.queryClient.ensureQueryData(accessQuery);
    const sector = access.sectors.find((s) => s.slug === params.slug);
    if (!sector) throw notFound();
    await context.queryClient.ensureQueryData(reportsQuery(sector.id));
    return { sector };
  },
  notFoundComponent: () => <AppShellFallback text="Setor não encontrado ou sem acesso." />,
  errorComponent: () => <AppShellFallback text="Não foi possível carregar este setor." />,
  component: SectorPage,
});

function AppShellFallback({ text }: { text: string }) {
  return <div className="p-10 text-center text-muted-foreground">{text}</div>;
}

function SectorPage() {
  const { sector } = Route.useLoaderData();
  const { data: reports } = useSuspenseQuery(reportsQuery(sector.id));
  const panel = getSectorPanel(sector.slug);
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const report = reports.find((r) => r.id === selectedId) ?? reports[0];

  async function remove(id: string) {
    if (!confirm("Remover este relatório?")) return;
    const { error } = await supabase.from("reports").delete().eq("id", id);
    if (error) {
      toast.error("Não foi possível remover.");
      return;
    }
    setSelectedId(null);
    await qc.invalidateQueries({ queryKey: ["reports", sector.id] });
  }

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-foreground">{sector.name}</h1>
          <p className="mt-1 text-muted-foreground">{sector.description}</p>
        </div>
      </div>

      {panel && (
        <section className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Painel do setor</h2>
          <Link to={panel.to} className="group mt-3 flex max-w-xl items-center justify-between gap-4 rounded-lg border bg-card p-6 shadow-soft hover:border-primary">
            <div><h3 className="font-display text-2xl text-foreground">{panel.name}</h3><p className="mt-1 text-sm text-muted-foreground">{panel.description}</p></div>
            <ArrowUpRight className="size-5 shrink-0 text-primary" />
          </Link>
        </section>
      )}

      {!report ? (
        <div className="mt-10 rounded-2xl border border-dashed bg-card p-12 text-center">
          <FileSpreadsheet className="mx-auto size-10 text-primary" />
          <p className="mt-4 text-foreground">Nenhum relatório disponível para este setor.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Select value={report.id} onValueChange={setSelectedId}>
              <SelectTrigger className="w-full max-w-md bg-card"><SelectValue /></SelectTrigger>
              <SelectContent>
                {reports.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.file_name} · {r.sheet_name} · {new Date(r.created_at).toLocaleDateString("pt-BR")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" onClick={() => remove(report.id)}><Trash2 /> Remover</Button>
          </div>
          {sector.slug === "recepcao" && isReceptionRows(report.rows)
            ? <ReceptionDashboard key={report.id} rows={report.rows} />
            : <Dashboard key={report.id} columns={report.columns} rows={report.rows} />}
        </>
      )}
    </AppShell>
  );
}

function Dashboard({ columns, rows }: { columns: string[]; rows: Row[] }) {
  const { numeric, text } = useMemo(() => analyzeColumns(columns, rows), [columns, rows]);
  const [valueCol, setValueCol] = useState(numeric[0] ?? "");
  const [groupCol, setGroupCol] = useState(text[0] ?? "");
  const chart = useMemo(
    () => (valueCol && groupCol ? groupSum(rows, groupCol, valueCol) : []),
    [rows, valueCol, groupCol],
  );

  return (
    <div className="mt-6 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label="Linhas" value={fmt(rows.length)} />
        {numeric.slice(0, 3).map((c) => <Kpi key={c} label={`Total · ${c}`} value={fmt(sumColumn(rows, c))} />)}
      </div>

      {numeric.length > 0 && text.length > 0 && (
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            Somar
            <ColSelect value={valueCol} onChange={setValueCol} options={numeric} />
            por
            <ColSelect value={groupCol} onChange={setGroupCol} options={text} />
          </div>
          <ChartContainer config={{ value: { label: valueCol, color: "var(--primary)" } }} className="mt-6 h-80 w-full">
            <BarChart data={chart} margin={{ left: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} interval={0} tick={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => fmt(v)} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={6} />
            </BarChart>
          </ChartContainer>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
        <div className="max-h-[480px] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>{columns.map((c) => <TableHead key={c} className="whitespace-nowrap">{c}</TableHead>)}</TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 200).map((r, i) => (
                <TableRow key={i}>
                  {columns.map((c) => <TableCell key={c} className="whitespace-nowrap">{String(r[c] ?? "")}</TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {rows.length > 200 && <p className="border-t p-3 text-center text-xs text-muted-foreground">Mostrando 200 de {rows.length} linhas</p>}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-soft">
      <p className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl text-foreground">{value}</p>
    </div>
  );
}

function ColSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-auto min-w-40"><SelectValue /></SelectTrigger>
      <SelectContent>{options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
    </Select>
  );
}
