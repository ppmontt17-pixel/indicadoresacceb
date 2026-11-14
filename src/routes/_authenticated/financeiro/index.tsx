import { redirect } from "@tanstack/react-router";
import { accessQuery } from "@/lib/access";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { DashboardShell } from "@/features/financeiro/dashboard-shell";
import { FINANCE_TOTALS as DATA, money, totalAccounts } from "@/features/financeiro/finance";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileText,
  Landmark,
  LayoutDashboard,
  Menu,
  ReceiptText,
  Search,
  Sheet,
  TrendingUp,
  WalletCards,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FINANCE_ACCOUNTS,
  MONTHS,
  type AccountCategory,
  type MonthKey,
} from "@/features/financeiro/finance-accounts";

export const Route = createFileRoute("/_authenticated/financeiro/")({
  beforeLoad: async ({ context }) => {
    const access = await context.queryClient.ensureQueryData(accessQuery);
    if (!access.sectors.some((s) => s.slug === "financeiro-custos")) throw redirect({ to: "/portal" });
  },
  head: () => ({
    meta: [
      { title: "Visão Financeira | ACCEB" },
      {
        name: "description",
        content: "Painel analítico de receitas, custos, despesas, aportes e resultado operacional da ACCEB.",
      },
      { property: "og:title", content: "Visão Financeira | ACCEB" },
      {
        property: "og:description",
        content: "Análise financeira mensal e consolidada da ACCEB, de maio a setembro.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FinanceDashboard,
});

type Period = "Consolidado" | MonthKey;
type NavSection = "overview" | "receita" | "outputs" | "aporte" | "cash";

type MonthData = {
  receita: number;
  custo: number;
  despesa: number;
  imposto: number;
  aporte: number;
  pendencias: number;
};

const CATEGORY_KEYS: AccountCategory[] = ["receita", "custo", "despesa", "imposto", "aporte"];

const CATEGORY_INFO: Record<AccountCategory, { label: string; shortLabel: string }> = {
  receita: { label: "Receitas", shortLabel: "Receitas" },
  custo: { label: "Custos operacionais", shortLabel: "Custos" },
  despesa: { label: "Despesas operacionais", shortLabel: "Despesas" },
  imposto: { label: "Impostos", shortLabel: "Impostos" },
  aporte: { label: "Aportes", shortLabel: "Aportes" },
};

const OUTPUT_CATEGORIES: AccountCategory[] = ["custo", "despesa", "imposto"];

const pct = (value: number) => `${value.toFixed(1).replace(".", ",")}%`;

const chartConfig = {
  receita: { label: "Receita", color: "var(--chart-1)" },
  saidas: { label: "Saídas", color: "var(--chart-2)" },
  resultado: { label: "Resultado operacional", color: "var(--chart-3)" },
} satisfies ChartConfig;

function operational(d: MonthData) {
  return d.receita - d.custo - d.despesa - d.imposto;
}

function sumData(months: MonthKey[]): MonthData {
  const total: MonthData = { receita: 0, custo: 0, despesa: 0, imposto: 0, aporte: 0, pendencias: 0 };
  months.forEach((m) => {
    CATEGORY_KEYS.forEach((k) => { total[k] += DATA[m][k]; });
    total.pendencias += DATA[m].pendencias;
  });
  return total;
}

function FinanceDashboard() {
  const [period, setPeriod] = useState<Period>("Consolidado");
  const [activeNav, setActiveNav] = useState<NavSection>("overview");
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory | null>(null);
  const [detailMode, setDetailMode] = useState<"single" | "outputs">("single");
  const [accountSearch, setAccountSearch] = useState("");
  const selectedMonths = period === "Consolidado" ? MONTHS : [period];
  const current = sumData(selectedMonths);
  const totalOut = current.custo + current.despesa + current.imposto;
  const result = operational(current);
  const cashResult = result + current.aporte;
  const margin = current.receita ? (result / current.receita) * 100 : 0;

  const evolution = MONTHS.map((month) => ({
    month,
    receita: DATA[month].receita,
    saidas: DATA[month].custo + DATA[month].despesa + DATA[month].imposto,
    resultado: operational(DATA[month]),
  }));

  const composition: { name: string; value: number; fill: string; category: AccountCategory }[] = [
    { name: "Custos", value: current.custo, fill: "var(--chart-2)", category: "custo" },
    { name: "Despesas operacionais", value: current.despesa, fill: "var(--chart-4)", category: "despesa" },
    { name: "Impostos", value: current.imposto, fill: "var(--chart-5)", category: "imposto" },
  ];

  const accounts = useMemo(() => {
    return FINANCE_ACCOUNTS
      .filter((a) => a.level === 2 && OUTPUT_CATEGORIES.includes(a.category))
      .map((a) => ({ name: a.name, type: CATEGORY_INFO[a.category].shortLabel, value: selectedMonths.reduce((s, m) => s + (a.values[m] ?? 0), 0) }))
      .sort((x, y) => y.value - x.value)
      .slice(0, 5);
  }, [period]);

  const openAccountDetails = (category: AccountCategory, mode: "single" | "outputs" = "single") => {
    setSelectedCategory(category);
    setDetailMode(mode);
    setAccountSearch("");
  };

  const handleNavAction = (section: NavSection) => {
    setActiveNav(section);

    if (section === "receita") openAccountDetails("receita");
    if (section === "outputs") openAccountDetails("custo", "outputs");
    if (section === "aporte") openAccountDetails("aporte");
    if (section === "overview") window.scrollTo({ top: 0, behavior: "smooth" });
    if (section === "cash") document.getElementById("cash-reading")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const openGlobalSearch = () => {
    setGlobalSearch("");
    setGlobalSearchOpen(true);
  };

  const downloadCsv = () => {
    const visibleMonths = period === "Consolidado" ? MONTHS : [period];
    const header = ["Conta", "Classificação", ...visibleMonths, ...(period === "Consolidado" ? ["Total"] : [])];
    const rows = FINANCE_ACCOUNTS.map((account) => {
      const values = visibleMonths.map((month) => account.values[month]);
      const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
      return [
        account.name,
        CATEGORY_INFO[account.category].label,
        ...values.map((value) => value === null ? "Pendente" : value.toFixed(2).replace(".", ",")),
        ...(period === "Consolidado" ? [total.toFixed(2).replace(".", ",")] : []),
      ];
    });
    const escapeCell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const csv = [header, ...rows].map((row) => row.map((value) => escapeCell(String(value))).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `ACCEB-financeiro-${period.toLocaleLowerCase("pt-BR")}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const [{ jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const visibleMonths = period === "Consolidado" ? MONTHS : [period];
    const reportPeriod = period === "Consolidado" ? "Maio a Setembro" : period;
    const filePeriod = period.toLocaleLowerCase("pt-BR");
    const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = document.internal.pageSize.getWidth();

    document.setFillColor(18, 67, 57);
    document.rect(0, 0, pageWidth, 34, "F");
    document.setTextColor(255, 255, 255);
    document.setFont("helvetica", "bold");
    document.setFontSize(18);
    document.text("ACCEB - Centro Médico", 14, 15);
    document.setFont("helvetica", "normal");
    document.setFontSize(10);
    document.text(`Relatório financeiro | ${reportPeriod}`, 14, 23);

    document.setTextColor(35, 45, 42);
    document.setFont("helvetica", "bold");
    document.setFontSize(12);
    document.text("Resumo do período", 14, 44);
    document.setFontSize(9);
    const summary = [
      ["Receita operacional", money(current.receita)],
      ["Custos e despesas", money(totalOut)],
      ["Resultado operacional", money(result)],
      ["Aporte", money(current.aporte)],
      ["Resultado após aporte", money(cashResult)],
      ["Valores pendentes", String(current.pendencias)],
    ];
    autoTable(document, {
      startY: 49,
      body: summary,
      theme: "plain",
      tableWidth: 112,
      styles: { font: "helvetica", fontSize: 8.5, cellPadding: 2.2, textColor: [35, 45, 42] },
      columnStyles: { 0: { fontStyle: "bold" }, 1: { halign: "right" } },
      alternateRowStyles: { fillColor: [241, 245, 243] },
    });

    const tableStart = (document as typeof document & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? 80;
    const header = ["Conta", "Classificação", ...visibleMonths, ...(period === "Consolidado" ? ["Total"] : [])];
    const body = FINANCE_ACCOUNTS.map((account) => {
      const values = visibleMonths.map((month) => account.values[month]);
      const total = values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
      return [
        account.name,
        CATEGORY_INFO[account.category].label,
        ...values.map((value) => value === null ? "Pendente" : money(value)),
        ...(period === "Consolidado" ? [money(total)] : []),
      ];
    });

    autoTable(document, {
      startY: tableStart + 8,
      head: [header],
      body,
      margin: { top: 15, right: 14, bottom: 14, left: 14 },
      theme: "grid",
      styles: { font: "helvetica", fontSize: 7.2, cellPadding: 2, lineColor: [215, 222, 219], lineWidth: 0.15, textColor: [35, 45, 42] },
      headStyles: { fillColor: [18, 67, 57], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [246, 248, 247] },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 39 },
        ...Object.fromEntries(visibleMonths.map((_, index) => [index + 2, { halign: "right", cellWidth: 34 }])),
        ...(period === "Consolidado" ? { [visibleMonths.length + 2]: { halign: "right", cellWidth: 34, fontStyle: "bold" } } : {}),
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.cell.raw === "Pendente") data.cell.styles.textColor = [166, 91, 14];
      },
      didDrawPage: () => {
        const page = document.getNumberOfPages();
        document.setFont("helvetica", "normal");
        document.setFontSize(7.5);
        document.setTextColor(100, 110, 106);
        document.text("Fonte: Planilha CUSTOS - ACCEB", 14, 202);
        document.text(`Página ${page}`, pageWidth - 14, 202, { align: "right" });
      },
    });

    document.save(`ACCEB-financeiro-${filePeriod}.pdf`);
  };

  return (
    <DashboardShell
      active={activeNav}
      onNavAction={handleNavAction}
      title="Visão financeira"
      subtitle="Acompanhamento gerencial · Maio a Setembro"
      headerActions={<>
        <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={openGlobalSearch}><Search /> Buscar conta</Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="outline" size="icon" aria-label="Baixar arquivo" title="Baixar arquivo"><Download /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => void downloadPdf()}><FileText />Baixar PDF</DropdownMenuItem>
            <DropdownMenuItem onSelect={downloadCsv}><Sheet />Baixar CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>}
    >
        <div className="mx-auto max-w-[1500px] space-y-7 px-4 py-6 sm:px-7 lg:px-10 lg:py-9">
          <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Painel executivo</p>
              <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">ANÁLISE DE CUSTOS - ACCEB</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Receitas, custos e despesas classificados a partir da planilha de fluxo de caixa.</p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-md border border-border bg-card p-1 md:self-auto">
              <CalendarDays className="ml-2 size-4 text-muted-foreground" />
              <select value={period} onChange={(e) => setPeriod(e.target.value as Period)} className="h-8 bg-transparent pr-2 text-sm font-medium outline-none" aria-label="Selecionar período">
                <option>Consolidado</option>{MONTHS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <ChevronDown className="mr-1 size-4 text-muted-foreground" aria-hidden="true" />
            </div>
          </section>

          <section className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 xl:grid-cols-4">
            <Metric title="Receita operacional" value={money(current.receita)} icon={CircleDollarSign} note={period === "Consolidado" ? `Total dos ${MONTHS.length} meses` : `Referente a ${period}`} tone="positive" onClick={() => openAccountDetails("receita")} />
            <Metric title="Custos e despesas" value={money(totalOut)} icon={ReceiptText} note={`${pct((totalOut / current.receita) * 100)} da receita`} tone="neutral" onClick={() => openAccountDetails("custo", "outputs")} />
            <Metric title="Resultado operacional" value={money(result)} icon={result >= 0 ? ArrowUpRight : ArrowDownRight} note={`Margem de ${pct(margin)}`} tone={result >= 0 ? "positive" : "negative"} />
            <Metric title="Aporte" value={money(current.aporte)} icon={WalletCards} note="Fora do resultado operacional" tone="accent" onClick={() => openAccountDetails("aporte")} />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
            <div className="rounded-md border border-border bg-card p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="font-display text-xl font-semibold">Evolução mensal</h3><p className="mt-1 text-xs text-muted-foreground">Receitas versus saídas operacionais</p></div>
                <div className="flex gap-4 text-xs text-muted-foreground"><Legend color="bg-chart-1" label="Receita" /><Legend color="bg-chart-2" label="Saídas" /></div>
              </div>
              <ChartContainer config={chartConfig} className="h-[280px] w-full aspect-auto sm:h-[330px]">
                <AreaChart data={evolution} margin={{ left: 0, right: 8, top: 8 }}>
                  <defs><linearGradient id="rev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-receita)" stopOpacity={0.18}/><stop offset="95%" stopColor="var(--color-receita)" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={12} />
                  <YAxis tickFormatter={(v) => money(v, true)} tickLine={false} axisLine={false} width={64} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(v, name) => <><span className="text-muted-foreground">{name === "receita" ? "Receita" : "Saídas"}</span><span className="ml-auto font-mono font-semibold">{money(Number(v))}</span></>} />} />
                  <Area type="monotone" dataKey="receita" stroke="var(--color-receita)" fill="url(#rev)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="saidas" stroke="var(--color-saidas)" fill="transparent" strokeWidth={2.5} />
                </AreaChart>
              </ChartContainer>
            </div>

            <div className="rounded-md border border-border bg-card p-5 sm:p-6">
              <div><h3 className="font-display text-xl font-semibold">Composição das saídas</h3><p className="mt-1 text-xs text-muted-foreground">Participação por classificação</p></div>
              <div className="relative mx-auto mt-3 max-w-[280px]">
                <ChartContainer config={chartConfig} className="h-[210px] w-full aspect-auto">
                  <PieChart><Pie data={composition} dataKey="value" nameKey="name" innerRadius={62} outerRadius={88} paddingAngle={2} strokeWidth={0}>{composition.map((entry) => <Cell key={entry.name} fill={entry.fill} />)}</Pie><ChartTooltip content={<ChartTooltipContent hideLabel formatter={(v, name) => <><span className="text-muted-foreground">{name}</span><span className="ml-auto font-mono font-semibold">{money(Number(v))}</span></>} />} /></PieChart>
                </ChartContainer>
                <div className="pointer-events-none absolute inset-0 grid place-content-center text-center"><span className="text-xs text-muted-foreground">Total</span><strong className="font-display text-sm">{money(totalOut)}</strong></div>
              </div>
              <div className="space-y-3">
                {composition.map((item, index) => <CompositionRow key={item.name} name={item.name} value={item.value} total={totalOut} color={index === 0 ? "bg-chart-2" : index === 1 ? "bg-chart-4" : "bg-chart-5"} onClick={() => openAccountDetails(item.category)} />)}
              </div>
            </div>
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
            <div className="rounded-md border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-5 sm:px-6"><div><h3 className="font-display text-xl font-semibold">Maiores contas</h3><p className="mt-1 text-xs text-muted-foreground">Principais impactos nas saídas do período</p></div><span className="text-xs font-medium text-muted-foreground">% das saídas</span></div>
              <div className="divide-y divide-border px-5 sm:px-6">
                {accounts.map((item, index) => <div key={item.name} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 py-4"><span className="font-mono text-xs text-muted-foreground">0{index + 1}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{item.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{item.type}</p></div><div className="text-right"><p className="font-mono text-sm font-semibold tabular-nums">{money(item.value)}</p><p className="mt-0.5 text-xs text-muted-foreground">{pct((item.value / totalOut) * 100)}</p></div></div>)}
              </div>
            </div>

            <div className="space-y-5">
              <div id="cash-reading" className="scroll-mt-24 rounded-md border border-primary/25 bg-primary/5 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Leitura do caixa</p>
                <div className="mt-4 flex items-end justify-between gap-3"><div><p className="text-sm text-muted-foreground">Resultado após aporte</p><p className={`mt-1 font-display text-3xl font-semibold ${cashResult >= 0 ? "text-positive" : "text-negative"}`}>{money(cashResult)}</p></div><Landmark className="mb-1 size-7 text-primary" /></div>
                <div className="mt-5 border-t border-primary/15 pt-4 text-xs leading-relaxed text-muted-foreground">O aporte de <strong className="text-foreground">{money(current.aporte)}</strong> é exibido separadamente e não altera a margem operacional.</div>
              </div>
              <div className="rounded-md border border-warning/35 bg-warning/10 p-5 sm:p-6">
                <div className="flex items-start gap-3"><div className="grid size-9 shrink-0 place-items-center rounded-full bg-warning/20 text-warning-foreground"><AlertTriangle className="size-4" /></div><div><h3 className="text-sm font-semibold">Dados em preenchimento</h3><p className="mt-1 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">{current.pendencias} células</strong> ainda estão vazias no período. Elas não foram tratadas como zero e podem alterar o resultado.</p></div></div>
              </div>
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-5 sm:p-6">
            <div className="mb-6"><h3 className="font-display text-xl font-semibold">Resultado por mês</h3><p className="mt-1 text-xs text-muted-foreground">Resultado operacional antes de aportes</p></div>
            <ChartContainer config={chartConfig} className="h-[240px] w-full aspect-auto">
              <BarChart data={evolution} margin={{ left: 0, right: 8 }}><CartesianGrid vertical={false} strokeDasharray="4 4" /><XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} /><YAxis tickFormatter={(v) => money(v, true)} tickLine={false} axisLine={false} width={64} /><ChartTooltip cursor={{ fill: "var(--muted)" }} content={<ChartTooltipContent hideLabel formatter={(v) => <span className="font-mono font-semibold">{money(Number(v))}</span>} />} /><Bar dataKey="resultado" radius={[3, 3, 0, 0]}>{evolution.map((entry) => <Cell key={entry.month} fill={entry.resultado >= 0 ? "var(--positive)" : "var(--negative)"} />)}</Bar></BarChart>
            </ChartContainer>
          </section>

          <footer className="flex flex-col gap-1 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span>Fonte: Planilha CUSTOS - ACCEB</span><span>Valores sujeitos ao preenchimento das células pendentes</span></footer>
        </div>

      <AccountDetailsDialog
        category={selectedCategory}
        mode={detailMode}
        period={period}
        search={accountSearch}
        onSearchChange={setAccountSearch}
        onCategoryChange={setSelectedCategory}
        onClose={() => { setSelectedCategory(null); setActiveNav("overview"); }}
      />
      <SearchAccountsDialog
        open={globalSearchOpen}
        period={period}
        search={globalSearch}
        onSearchChange={setGlobalSearch}
        onClose={() => setGlobalSearchOpen(false)}
      />
    </DashboardShell>
  );
}

function Metric({ title, value, note, icon: Icon, tone, onClick }: { title: string; value: string; note: string; icon: typeof CircleDollarSign; tone: "positive" | "negative" | "accent" | "neutral"; onClick?: () => void }) {
  const toneClass = tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : tone === "accent" ? "text-primary" : "text-foreground";
  const content = <><div className="flex items-start justify-between"><p className="text-xs font-medium text-muted-foreground">{title}</p><Icon className={`size-4 ${toneClass}`} /></div><p className={`mt-4 font-display text-2xl font-semibold tabular-nums sm:text-[28px] ${toneClass}`}>{value}</p><div className="mt-2 flex items-center justify-between gap-2"><p className="text-left text-xs text-muted-foreground">{note}</p>{onClick ? <span className="flex shrink-0 items-center gap-1 text-[11px] font-semibold text-primary">Ver contas <ChevronRight className="size-3" /></span> : null}</div></>;
  if (onClick) return <Button type="button" variant="ghost" onClick={onClick} className="h-auto w-full justify-stretch rounded-none bg-card p-5 text-left whitespace-normal hover:bg-accent/45 sm:p-6"><span className="block w-full">{content}</span></Button>;
  return <div className="bg-card p-5 sm:p-6">{content}</div>;
}

function Legend({ color, label }: { color: string; label: string }) { return <span className="flex items-center gap-1.5"><i className={`size-2 rounded-sm ${color}`} />{label}</span>; }

function CompositionRow({ name, value, total, color, onClick }: { name: string; value: number; total: number; color: string; onClick: () => void }) {
  return <Button type="button" variant="ghost" onClick={onClick} className="h-auto w-full justify-stretch px-2 py-2 whitespace-normal"><span className="grid w-full grid-cols-[1fr_auto] items-center gap-3"><span className="flex items-center gap-2 text-left text-xs text-muted-foreground"><span className={`size-2 rounded-sm ${color}`} />{name}<ChevronRight className="size-3" /></span><span className="text-right"><span className="font-mono text-xs font-semibold">{money(value)}</span><span className="ml-2 text-[11px] text-muted-foreground">{pct((value / total) * 100)}</span></span></span></Button>;
}

function SearchAccountsDialog({ open, period, search, onSearchChange, onClose }: { open: boolean; period: Period; search: string; onSearchChange: (value: string) => void; onClose: () => void }) {
  const visibleMonths = period === "Consolidado" ? MONTHS : [period];
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const rows = FINANCE_ACCOUNTS
    .filter((account) => !normalizedSearch || account.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch));

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="flex max-h-[88vh] w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:rounded-md">
        <DialogHeader className="border-b border-border px-5 py-5 pr-12 sm:px-7">
          <DialogTitle className="font-display text-2xl">Buscar conta</DialogTitle>
          <DialogDescription>Consulte todas as contas · {period === "Consolidado" ? "Maio a Setembro" : period}</DialogDescription>
        </DialogHeader>
        <div className="border-b border-border px-5 py-4 sm:px-7">
          <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input autoFocus value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Digite o nome da conta" aria-label="Digite o nome da conta" className="pl-9" /></div>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[660px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-muted/95 text-xs text-muted-foreground backdrop-blur"><tr><th className="px-5 py-3 text-left font-semibold sm:px-7">Conta</th><th className="px-4 py-3 text-left font-semibold">Classificação</th>{visibleMonths.map((month) => <th key={month} className="px-4 py-3 text-right font-semibold">{month}</th>)}{period === "Consolidado" ? <th className="px-5 py-3 text-right font-semibold sm:px-7">Total</th> : null}</tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map((account) => {
                const total = visibleMonths.reduce((sum, month) => sum + (account.values[month] ?? 0), 0);
                return <tr key={`${account.category}-${account.name}`} className="hover:bg-muted/35"><td className={`px-5 py-3.5 sm:px-7 ${account.level === 2 ? "pl-9 text-muted-foreground sm:pl-11" : "font-semibold"}`}>{account.name}</td><td className="px-4 py-3.5 text-xs text-muted-foreground">{CATEGORY_INFO[account.category].label}</td>{visibleMonths.map((month) => <td key={month} className="px-4 py-3.5 text-right font-mono text-xs tabular-nums">{account.values[month] === null ? <span className="font-sans text-warning-foreground">Pendente</span> : money(account.values[month])}</td>)}{period === "Consolidado" ? <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold tabular-nums sm:px-7">{money(total)}</td> : null}</tr>;
              })}
              {rows.length === 0 ? <tr><td colSpan={visibleMonths.length + (period === "Consolidado" ? 3 : 2)} className="px-5 py-10 text-center text-muted-foreground">Nenhuma conta encontrada.</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border bg-muted/50 px-5 py-4 text-sm text-muted-foreground sm:px-7">{rows.length} contas encontradas</div>
      </DialogContent>
    </Dialog>
  );
}

function AccountDetailsDialog({ category, mode, period, search, onSearchChange, onCategoryChange, onClose }: { category: AccountCategory | null; mode: "single" | "outputs"; period: Period; search: string; onSearchChange: (value: string) => void; onCategoryChange: (category: AccountCategory) => void; onClose: () => void }) {
  if (!category) return null;

  const visibleMonths = period === "Consolidado" ? MONTHS : [period];
  const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");
  const rows = FINANCE_ACCOUNTS
    .filter((account) => account.category === category)
    .filter((account) => !normalizedSearch || account.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch));
  const categoryTotal = totalAccounts(rows, visibleMonths);
  const pendingCount = rows.reduce((count, account) => count + visibleMonths.filter((month) => account.values[month] === null).length, 0);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="flex max-h-[88vh] w-[calc(100%-2rem)] max-w-5xl flex-col gap-0 overflow-hidden p-0 sm:rounded-md">
        <DialogHeader className="border-b border-border px-5 py-5 pr-12 sm:px-7">
          <DialogTitle className="font-display text-2xl">{CATEGORY_INFO[category].label}</DialogTitle>
          <DialogDescription>Contas da planilha · {period === "Consolidado" ? "Maio a Setembro" : period}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          {mode === "outputs" ? (
            <div className="flex gap-1 rounded-md bg-muted p-1" aria-label="Tipo de saída">
              {OUTPUT_CATEGORIES.map((item) => <Button key={item} type="button" size="sm" variant={category === item ? "default" : "ghost"} onClick={() => onCategoryChange(item)}>{CATEGORY_INFO[item].shortLabel}</Button>)}
            </div>
          ) : <p className="text-xs text-muted-foreground">{rows.length} contas encontradas</p>}
          <div className="relative w-full sm:w-64"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar conta" aria-label="Buscar conta" className="pl-9" /></div>
        </div>

        <div className="overflow-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead className="sticky top-0 z-10 bg-muted/95 text-xs text-muted-foreground backdrop-blur">
              <tr><th className="px-5 py-3 text-left font-semibold sm:px-7">Conta</th>{visibleMonths.map((month) => <th key={month} className="px-4 py-3 text-right font-semibold">{month}</th>)}{period === "Consolidado" ? <th className="px-5 py-3 text-right font-semibold sm:px-7">Total</th> : null}</tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((account) => {
                const rowTotal = visibleMonths.reduce((sum, month) => sum + (account.values[month] ?? 0), 0);
                return <tr key={account.name} className="hover:bg-muted/35"><td className={`px-5 py-3.5 sm:px-7 ${account.level === 2 ? "pl-9 text-muted-foreground sm:pl-11" : "font-semibold"}`}>{account.name}</td>{visibleMonths.map((month) => <td key={month} className="px-4 py-3.5 text-right font-mono text-xs tabular-nums">{account.values[month] === null ? <span className="font-sans text-warning-foreground">Pendente</span> : money(account.values[month], false)}</td>)}{period === "Consolidado" ? <td className="px-5 py-3.5 text-right font-mono text-xs font-semibold tabular-nums sm:px-7">{money(rowTotal)}</td> : null}</tr>;
              })}
              {rows.length === 0 ? <tr><td colSpan={visibleMonths.length + (period === "Consolidado" ? 2 : 1)} className="px-5 py-10 text-center text-muted-foreground">Nenhuma conta encontrada.</td></tr> : null}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-1 border-t border-border bg-muted/50 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <span className="text-muted-foreground">{pendingCount > 0 ? `${pendingCount} valores pendentes no período` : "Todos os valores estão preenchidos"}</span>
          <span>Total exibido: <strong className="font-mono tabular-nums">{money(categoryTotal)}</strong></span>
        </div>
      </DialogContent>
    </Dialog>
  );
}