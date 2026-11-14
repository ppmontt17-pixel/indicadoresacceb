import { redirect } from "@tanstack/react-router";
import { accessQuery } from "@/lib/access";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import acebLogoUrl from "@/assets/acceb-logo.jpg";
const acebLogo = { url: acebLogoUrl };
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlosasPanel, type Glosa } from "@/features/faturamento/glosas-panel";
import { GlosasComparativo, type GlosaAno } from "@/features/faturamento/glosas-comparativo";
import { listFaturamento, listGlosasFn } from "@/features/faturamento/data";

export const Route = createFileRoute("/_authenticated/faturamento")({
  beforeLoad: async ({ context }) => {
    const access = await context.queryClient.ensureQueryData(accessQuery);
    if (!access.sectors.some((s) => s.slug === "faturamento")) throw redirect({ to: "/portal" });
  },
  validateSearch: (search: Record<string, unknown>): { aba?: "comparativo"; ano?: number } => {
    if (search["aba"] === "comparativo") return { aba: "comparativo" };
    const ano = Number(search["ano"]);
    return Number.isInteger(ano) && ano > 2000 ? { ano } : {};
  },
  head: () => ({
    meta: [
      { title: "ACCEB - Centro Médico — Painel de Faturamento" },
      {
        name: "description",
        content: "Painel interno de faturamento, glosas, pagos e pendentes por operadora.",
      },
      { property: "og:title", content: "ACCEB — Indicadores de faturamento e glosas" },
      { property: "og:description", content: "Indicadores por mês e operadora e comparação das glosas de 2025 e 2026." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const MESES_ORDEM = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
] as const;
const MES_CURTO: Record<string, string> = {
  Janeiro: "Jan", Fevereiro: "Fev", Março: "Mar", Abril: "Abr", Maio: "Mai", Junho: "Jun",
  Julho: "Jul", Agosto: "Ago", Setembro: "Set", Outubro: "Out", Novembro: "Nov", Dezembro: "Dez",
};

const fmt = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtCompact = (v: number) =>
  "R$ " + Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(v);

function Dashboard() {
  const [mesFiltro, setMesFiltro] = useState<string>("todos");
  const [operadoraFiltro, setOperadoraFiltro] = useState<string>("todas");
  const { aba, ano } = Route.useSearch();
  const anoFiltro = ano ?? 2026;
  useEffect(() => { setMesFiltro("todos"); setOperadoraFiltro("todas"); }, [anoFiltro, aba]);
  const comparativo = aba === "comparativo";
  const [busca, setBusca] = useState("");

  const fatQuery = useQuery({ queryKey: ["faturamento"], queryFn: () => listFaturamento() });
  const glosasQuery = useQuery({ queryKey: ["glosas"], queryFn: () => listGlosasFn() });

  const anosDisponiveis = useMemo(() => {
    const set = new Set<number>([2025, 2026]);
    for (const r of fatQuery.data ?? []) set.add(r.ano);
    for (const g of glosasQuery.data ?? []) set.add(g.ano);
    return Array.from(set).sort((a, b) => a - b);
  }, [fatQuery.data, glosasQuery.data]);

  const operadorasMes = useMemo(
    () => (fatQuery.data ?? []).filter((r) => r.ano === anoFiltro),
    [fatQuery.data, anoFiltro],
  );
  const glosas: Glosa[] = useMemo(
    () =>
      (glosasQuery.data ?? []).filter((g) => g.ano === anoFiltro).map((g) => ({
        operadora: g.operadora,
        mes: g.mes,
        numeroGuia: g.numero_guia ?? undefined,
        paciente: g.paciente ?? undefined,
        procedimento: g.procedimento ?? undefined,
        motivo: g.motivo ?? undefined,
        valorGlosado: g.valor_glosado,
        valorRecuperado: g.valor_recuperado,
        status: g.status,
      })),
    [glosasQuery.data, anoFiltro],
  );

  const todasGlosas: GlosaAno[] = useMemo(
    () =>
      (glosasQuery.data ?? []).map((g) => ({
        operadora: g.operadora,
        mes: g.mes,
        ano: g.ano,
        numeroGuia: g.numero_guia ?? undefined,
        valorGlosado: g.valor_glosado,
        valorRecuperado: g.valor_recuperado,
        status: g.status,
      })),
    [glosasQuery.data],
  );

  const mesesDisponiveis = useMemo(() => {
    const set = new Set([...operadorasMes.map((o) => o.mes), ...glosas.map((g) => g.mes)]);
    return MESES_ORDEM.filter((m) => set.has(m));
  }, [operadorasMes, glosas]);

  const operadorasDisponiveis = useMemo(() => {
    const set = new Set([...operadorasMes.map((o) => o.operadora), ...glosas.map((g) => g.operadora)]);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [operadorasMes, glosas]);

  const operadoras = useMemo(() => {
    let filtered = operadorasMes;
    if (mesFiltro !== "todos") filtered = filtered.filter((o) => o.mes === mesFiltro);
    if (operadoraFiltro !== "todas") filtered = filtered.filter((o) => o.operadora === operadoraFiltro);
    const agg = new Map<string, { nome: string; faturado: number; pago: number; glosado: number; pendente: number; contas: number }>();
    for (const r of filtered) {
      const cur = agg.get(r.operadora);
      if (cur) {
        cur.faturado += r.faturado; cur.pago += r.pago; cur.glosado += r.glosado;
        cur.pendente += r.pendente; cur.contas += r.contas;
      } else {
        agg.set(r.operadora, { nome: r.operadora, faturado: r.faturado, pago: r.pago, glosado: r.glosado, pendente: r.pendente, contas: r.contas });
      }
    }
    return Array.from(agg.values()).sort((a, b) => b.faturado - a.faturado);
  }, [operadorasMes, mesFiltro, operadoraFiltro]);

  const evolucao = useMemo(() => {
    let filtered = operadorasMes;
    if (mesFiltro !== "todos") filtered = filtered.filter((o) => o.mes === mesFiltro);
    if (operadoraFiltro !== "todas") filtered = filtered.filter((o) => o.operadora === operadoraFiltro);
    const agg = new Map<string, { mes: string; faturado: number; pago: number; glosado: number; pendente: number }>();
    for (const r of filtered) {
      const cur = agg.get(r.mes);
      if (cur) { cur.faturado += r.faturado; cur.pago += r.pago; cur.glosado += r.glosado; cur.pendente += r.pendente; }
      else agg.set(r.mes, { mes: r.mes, faturado: r.faturado, pago: r.pago, glosado: r.glosado, pendente: r.pendente });
    }
    return MESES_ORDEM.filter((m) => agg.has(m)).map((m) => {
      const e = agg.get(m);
      return { ...e, mes: MES_CURTO[m] ?? m };
    });
  }, [operadorasMes, mesFiltro, operadoraFiltro]);

  const totals = useMemo(() =>
    operadoras.reduce(
      (acc, o) => {
        acc.faturado += o.faturado; acc.pago += o.pago; acc.glosado += o.glosado;
        acc.pendente += o.pendente; acc.contas += o.contas;
        return acc;
      },
      { faturado: 0, pago: 0, glosado: 0, pendente: 0, contas: 0 },
    ),
    [operadoras],
  );

  const filtradas = useMemo(
    () => operadoras.filter((o) => o.nome.toLowerCase().includes(busca.toLowerCase())),
    [busca, operadoras],
  );

  const taxaPago = totals.faturado ? ((totals.pago / totals.faturado) * 100).toFixed(1) : "0";
  const taxaGlosa = totals.faturado ? ((totals.glosado / totals.faturado) * 100).toFixed(1) : "0";
  const taxaPendente = totals.faturado ? ((totals.pendente / totals.faturado) * 100).toFixed(1) : "0";

  const pieData = [
    { name: "Pago", value: totals.pago, fill: "var(--color-chart-2)" },
    { name: "Pendente", value: totals.pendente, fill: "var(--color-chart-3)" },
    { name: "Glosado", value: totals.glosado, fill: "var(--color-chart-4)" },
  ];

  const loading = fatQuery.isLoading || glosasQuery.isLoading;
  const error = fatQuery.error ?? glosasQuery.error;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <Link to="/portal" className="flex items-center gap-3" title="Voltar ao portal">
            <img src={acebLogo.url} alt="ACCEB - Centro Médico" className="h-12 w-12 rounded-xl bg-card object-contain shadow-sm" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">ACCEB - Centro Médico</h1>
              <p className="text-xs text-muted-foreground">Painel de faturamento · ← Portal</p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded-lg border bg-muted/40 p-1">
              {anosDisponiveis.map((a) => (
                <Button
                  key={a}
                  asChild
                  variant="ghost"
                  size="sm"
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    !comparativo && anoFiltro === a
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Link to="/faturamento" search={a === 2026 ? {} : { ano: a }} aria-current={!comparativo && anoFiltro === a ? "page" : undefined}>{a}</Link>
                </Button>
              ))}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  comparativo
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Link to="/faturamento" search={{ aba: "comparativo" }} aria-current={comparativo ? "page" : undefined}>Comparativo</Link>
              </Button>
            </div>
            {!comparativo && (
            <>
            <Select value={operadoraFiltro} onValueChange={setOperadoraFiltro}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Operadora" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as operadoras</SelectItem>
                {operadorasDisponiveis.map((op) => <SelectItem key={op} value={op}>{op}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={mesFiltro} onValueChange={setMesFiltro}>
              <SelectTrigger className="w-[170px]"><SelectValue placeholder="Mês" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os meses</SelectItem>
                {mesesDisponiveis.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            <Badge variant="secondary" className="hidden gap-1 sm:flex">
              <Activity className="h-3 w-3" />{totals.contas} contas
            </Badge>
            </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        {loading && <p className="text-sm text-muted-foreground">Carregando dados…</p>}
        {error && (
          <p className="text-sm text-destructive">
            Erro ao carregar: {(error as Error).message}
          </p>
        )}

        {!loading && !error && !comparativo && operadorasMes.length === 0 && (
          <Card>
            <CardContent className="p-5 text-sm text-muted-foreground">
              Não há faturamento cadastrado para {anoFiltro} — abaixo segue apenas a análise de glosas do ano.
            </CardContent>
          </Card>
        )}

        {!comparativo && operadorasMes.length > 0 && (
        <>
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Visão geral</h2>
          <p className="text-sm text-muted-foreground">Indicadores consolidados de {anoFiltro}.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Faturamento geral" value={fmt(totals.faturado)} hint={`${totals.contas} contas`} trend="" trendUp icon={<Activity className="h-4 w-4" />} accent="primary" />
          <KpiCard label="Valor pago" value={fmt(totals.pago)} hint={`${taxaPago}% do faturado`} trend="" trendUp icon={<CheckCircle2 className="h-4 w-4" />} accent="success" />
          <KpiCard label="Valor pendente" value={fmt(totals.pendente)} hint={`${taxaPendente}% aguardando`} trend="" trendUp={false} icon={<Clock className="h-4 w-4" />} accent="warning" />
          <KpiCard label="Valor glosado" value={fmt(totals.glosado)} hint={`${taxaGlosa}% de glosa`} trend="" trendUp={false} icon={<AlertTriangle className="h-4 w-4" />} accent="destructive" />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Evolução mensal</CardTitle></CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucao} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={fmtCompact} />
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
                  <Line type="monotone" dataKey="faturado" name="Faturado" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="pago" name="Pago" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="pendente" name="Pendente" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="glosado" name="Glosado" stroke="var(--color-chart-4)" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Composição</CardTitle></CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                    {pieData.map((d) => <Cell key={d.name} fill={d.fill} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-center gap-4 text-xs">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.fill }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader><CardTitle className="text-base">Faturamento por operadora</CardTitle></CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operadoras} margin={{ left: 4, right: 12, top: 48, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="nome" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={fmtCompact} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 }} formatter={(v: number) => fmt(v)} />
                <Bar dataKey="pago" name="Pago" stackId="a" fill="var(--color-chart-2)" />
                <Bar dataKey="pendente" name="Pendente" stackId="a" fill="var(--color-chart-3)" />
                <Bar dataKey="glosado" name="Glosado" stackId="a" fill="var(--color-chart-4)" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="faturado" position="top" angle={-90} offset={8} fontSize={10} fill="var(--color-foreground)" textAnchor="start" formatter={(v: number) => (v > 0 ? Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(v) : "")} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">Detalhamento por operadora</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar operadora..." value={busca} onChange={(e) => setBusca(e.target.value)} className="pl-8" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operadora</TableHead>
                  <TableHead className="text-right">Contas</TableHead>
                  <TableHead className="text-right">Faturado</TableHead>
                  <TableHead className="text-right">Pago</TableHead>
                  <TableHead className="text-right">Pendente</TableHead>
                  <TableHead className="text-right">Glosado</TableHead>
                  <TableHead className="text-right">% Glosa</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtradas.map((o) => {
                  const rank = [...filtradas].sort((a, b) => b.faturado - a.faturado).findIndex((x) => x.nome === o.nome);
                  const top10 = rank >= 0 && rank < 10 && o.faturado > 0;
                  const pctGlosa = o.faturado ? (o.glosado / o.faturado) * 100 : 0;
                  return (
                    <TableRow key={o.nome} className={top10 ? "bg-primary/10 hover:bg-primary/15" : ""}>
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-2">
                          {top10 && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">{rank + 1}</span>}
                          {o.nome}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{o.contas}</TableCell>
                      <TableCell className="text-right">{fmt(o.faturado)}</TableCell>
                      <TableCell className="text-right text-[color:var(--color-success)]">{fmt(o.pago)}</TableCell>
                      <TableCell className="text-right text-[color:var(--color-warning-foreground)]">{fmt(o.pendente)}</TableCell>
                      <TableCell className="text-right text-destructive">{fmt(o.glosado)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className={pctGlosa > 8 ? "bg-destructive/10 text-destructive" : pctGlosa > 5 ? "bg-warning/20 text-warning-foreground" : "bg-success/15 text-[color:var(--color-success)]"}>
                          {pctGlosa.toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        </>
        )}

        {!comparativo && (
          <GlosasPanel key={anoFiltro} glosas={glosas} mesFiltro={mesFiltro} operadoraFiltro={operadoraFiltro} faturamentoTotal={totals.faturado} />
        )}

        {comparativo && <GlosasComparativo glosas={todasGlosas} />}
      </main>
    </div>
  );
}

function KpiCard({
  label, value, hint, trend, trendUp, icon, accent,
}: {
  label: string; value: string; hint: string; trend: string; trendUp: boolean;
  icon: React.ReactNode; accent: "primary" | "success" | "warning" | "destructive";
}) {
  const accentMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/15 text-[color:var(--color-success)]",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentMap[accent]}`}>{icon}</div>
          {trend && (
            <span className={`flex items-center gap-1 text-xs font-medium ${trendUp ? "text-[color:var(--color-success)]" : "text-destructive"}`}>
              {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {trend}
            </span>
          )}
        </div>
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}
