import { redirect } from "@tanstack/react-router";
import { accessQuery } from "@/lib/access";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  ChevronDown,
  Hash,
  ReceiptText,
  Search,
  TrendingUp,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { DashboardShell } from "@/features/financeiro/dashboard-shell";
import { FINANCE_SHEETS, type FinanceSheet } from "@/features/financeiro/finance-sheets";
import { MONTHS, type MonthKey } from "@/features/financeiro/finance-accounts";
import { money } from "@/features/financeiro/finance";

export const Route = createFileRoute("/_authenticated/financeiro/abas/$sheetId")({
  beforeLoad: async ({ context }) => {
    const access = await context.queryClient.ensureQueryData(accessQuery);
    if (!access.sectors.some((s) => s.slug === "financeiro-custos")) throw redirect({ to: "/portal" });
  },
  loader: ({ params }) => {
    const sheet = FINANCE_SHEETS.find((item) => item.id === params.sheetId);
    if (!sheet) throw notFound();
    return { sheet };
  },
  head: ({ loaderData }) => {
    const label = loaderData?.sheet.label ?? "Aba da planilha";
    return {
      meta: [
        { title: `${label} | ACCEB` },
        { name: "description", content: `Análise detalhada da aba ${label} da planilha de custos da ACCEB.` },
        { property: "og:title", content: `${label} | ACCEB` },
        { property: "og:description", content: `Análise detalhada da aba ${label} da planilha de custos da ACCEB.` },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: SheetNotFound,
  component: SheetAnalysis,
});

type MonthFilter = "Todos" | MonthKey;

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const chartConfig = {
  total: { label: "Total", color: "var(--chart-2)" },
} satisfies ChartConfig;

function SheetAnalysis() {
  const { sheet } = Route.useLoaderData();
  const [monthFilter, setMonthFilter] = useState<MonthFilter>("Todos");
  const [search, setSearch] = useState("");

  const selectedMonths = monthFilter === "Todos" ? MONTHS : [monthFilter];

  const monthlyTotals = useMemo(
    () =>
      MONTHS.map((month) => ({
        month,
        total: sheet.months[month].reduce((sum, item) => sum + item.valor, 0),
      })),
    [sheet],
  );

  const transactions = useMemo(() => {
    const normalized = search.trim().toLocaleLowerCase("pt-BR");
    return selectedMonths
      .flatMap((month) => sheet.months[month].map((item) => ({ ...item, month })))
      .filter((item) => !normalized || item.empresa.toLocaleLowerCase("pt-BR").includes(normalized));
  }, [sheet, selectedMonths, search]);

  const total = transactions.reduce((sum, item) => sum + item.valor, 0);
  const average = selectedMonths.length ? total / selectedMonths.length : 0;

  const topCompanies = useMemo(() => {
    const grouped = new Map<string, number>();
    transactions.forEach((item) => {
      const key = item.empresa || "Não identificado";
      grouped.set(key, (grouped.get(key) ?? 0) + item.valor);
    });
    return [...grouped.entries()]
      .map(([empresa, valor]) => ({ empresa, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 8);
  }, [transactions]);

  const biggest = topCompanies[0];

  return (
    <DashboardShell
      active={sheet.id}
      title={sheet.label}
      subtitle={`${sheet.description} · Maio a Setembro`}
      headerActions={
        <Link to="/financeiro">
          <Button variant="outline" size="sm"><ArrowLeft /> <span className="hidden sm:inline">Visão geral</span></Button>
        </Link>
      }
    >
      <div className="mx-auto max-w-[1500px] space-y-7 px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Aba da planilha</p>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{sheet.label}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{sheet.description}.</p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-md border border-border bg-card p-1 md:self-auto">
            <CalendarDays className="ml-2 size-4 text-muted-foreground" />
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value as MonthFilter)} className="h-8 bg-transparent pr-2 text-sm font-medium outline-none" aria-label="Filtrar por mês">
              <option value="Todos">Todos os meses</option>
              {MONTHS.map((month) => <option key={month} value={month}>{month}</option>)}
            </select>
            <ChevronDown className="mr-1 size-4 text-muted-foreground" aria-hidden="true" />
          </div>
        </section>

        <section className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
          <SheetMetric title="Total no período" value={money(total)} icon={ReceiptText} note={monthFilter === "Todos" ? "Soma dos 5 meses" : `Referente a ${monthFilter}`} />
          <SheetMetric title="Média mensal" value={money(average)} icon={TrendingUp} note={monthFilter === "Todos" ? "Por mês no período" : "Mês selecionado"} />
          <SheetMetric title="Lançamentos" value={String(transactions.length)} icon={Hash} note="Registros na aba" />
          <SheetMetric title="Maior fornecedor" value={biggest ? biggest.empresa : "—"} icon={Building2} note={biggest ? money(biggest.valor) : "Sem lançamentos"} small />
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
          <div className="rounded-md border border-border bg-card p-5 sm:p-6">
            <div className="mb-6"><h3 className="font-display text-xl font-semibold">Total por mês</h3><p className="mt-1 text-xs text-muted-foreground">Soma dos lançamentos da aba em cada mês</p></div>
            <ChartContainer config={chartConfig} className="h-[260px] w-full aspect-auto">
              <BarChart data={monthlyTotals} margin={{ left: 0, right: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis tickFormatter={(v) => money(v, true)} tickLine={false} axisLine={false} width={64} />
                <ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel formatter={(v) => <span className="font-mono font-semibold">{money(Number(v))}</span>} />} />
                <Bar dataKey="total" fill="var(--color-total)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>

          <div className="rounded-md border border-border bg-card">
            <div className="border-b border-border px-5 py-5 sm:px-6"><h3 className="font-display text-xl font-semibold">Maiores fornecedores</h3><p className="mt-1 text-xs text-muted-foreground">Agregado no período selecionado</p></div>
            <div className="divide-y divide-border px-5 sm:px-6">
              {topCompanies.map((item, index) => (
                <div key={item.empresa} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 py-3.5">
                  <span className="font-mono text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                  <p className="truncate text-sm font-medium">{item.empresa}</p>
                  <div className="text-right">
                    <p className="font-mono text-sm font-semibold tabular-nums">{money(item.valor)}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{total ? `${((item.valor / total) * 100).toFixed(1).replace(".", ",")}%` : "—"}</p>
                  </div>
                </div>
              ))}
              {topCompanies.length === 0 ? <p className="py-8 text-center text-sm text-muted-foreground">Nenhum lançamento no período.</p> : null}
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-md border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div><h3 className="font-display text-xl font-semibold">Lançamentos</h3><p className="mt-1 text-xs text-muted-foreground">{transactions.length} registros · {monthFilter === "Todos" ? "todos os meses" : monthFilter}</p></div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar fornecedor" aria-label="Buscar fornecedor" className="pl-9" />
            </div>
          </div>
          <div className="overflow-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead className="sticky top-0 z-10 bg-muted/95 text-xs text-muted-foreground backdrop-blur">
                <tr>
                  <th className="px-5 py-3 text-left font-semibold sm:px-6">Data</th>
                  <th className="px-4 py-3 text-left font-semibold">Fornecedor</th>
                  <th className="px-4 py-3 text-left font-semibold">Mês</th>
                  <th className="px-5 py-3 text-right font-semibold sm:px-6">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((item, index) => (
                  <tr key={`${item.month}-${index}`} className="hover:bg-muted/35">
                    <td className="px-5 py-3 font-mono text-xs tabular-nums text-muted-foreground sm:px-6">{formatDate(item.data)}</td>
                    <td className="px-4 py-3 font-medium">{item.empresa || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{item.month}</td>
                    <td className="px-5 py-3 text-right font-mono text-xs font-semibold tabular-nums sm:px-6">{money(item.valor)}</td>
                  </tr>
                ))}
                {transactions.length === 0 ? <tr><td colSpan={4} className="px-5 py-10 text-center text-muted-foreground">Nenhum lançamento encontrado.</td></tr> : null}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border bg-muted/50 px-5 py-4 text-sm sm:px-6">
            Total exibido: <strong className="font-mono tabular-nums">{money(total)}</strong>
          </div>
        </section>

        <footer className="flex flex-col gap-1 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Fonte: Planilha CUSTOS - ACCEB · aba {sheet.label}</span>
          <span>Período: Maio a Setembro</span>
        </footer>
      </div>
    </DashboardShell>
  );
}

function SheetMetric({ title, value, note, icon: Icon, small = false }: { title: string; value: string; note: string; icon: typeof ReceiptText; small?: boolean }) {
  return (
    <div className="bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between"><p className="text-xs font-medium text-muted-foreground">{title}</p><Icon className="size-4 text-primary" /></div>
      <p className={`mt-4 font-display font-semibold tabular-nums ${small ? "truncate text-lg" : "text-2xl sm:text-[28px]"}`} title={value}>{value}</p>
      <p className="mt-2 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function SheetNotFound() {
  return (
    <DashboardShell active="" title="Aba não encontrada">
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-semibold">Aba não encontrada</h2>
        <p className="mt-3 text-sm text-muted-foreground">A aba solicitada não existe na planilha de custos.</p>
        <Link to="/financeiro"><Button className="mt-6"><ArrowLeft /> Voltar à visão geral</Button></Link>
      </div>
    </DashboardShell>
  );
}
