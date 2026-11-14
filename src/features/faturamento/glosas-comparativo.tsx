import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fmt, MESES_ORDEM, STATUS_ORDER, type Glosa } from "@/features/faturamento/glosas-panel";

export type GlosaAno = Glosa & { ano: number };

const MES_CURTO: Record<string, string> = {
  Janeiro: "Jan", Fevereiro: "Fev", Março: "Mar", Abril: "Abr", Maio: "Mai", Junho: "Jun",
  Julho: "Jul", Agosto: "Ago", Setembro: "Set", Outubro: "Out", Novembro: "Nov", Dezembro: "Dez",
};

const fmtCompact = (v: number) =>
  "R$ " + Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(v);

const RECUPERADOS = new Set(["Pago", "Pago Parcial"]);
const EM_ANDAMENTO = new Set(["Em análise", "A recursar"]);
const CORES_ANO = ["var(--color-chart-3)", "var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-5)"];
const TOOLTIP_STYLE = { background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 12 };

type Totais = {
  glosado: number;
  recuperado: number;
  taxa: number;
  emAndamento: number;
  perda: number;
  lancamentos: number;
};

function totaisDe(glosas: GlosaAno[]): Totais {
  const t: Totais = { glosado: 0, recuperado: 0, taxa: 0, emAndamento: 0, perda: 0, lancamentos: glosas.length };
  for (const g of glosas) {
    const saldo = g.valorGlosado - g.valorRecuperado;
    t.glosado += g.valorGlosado;
    t.recuperado += g.valorRecuperado;
    if (RECUPERADOS.has(g.status)) continue;
    if (EM_ANDAMENTO.has(g.status)) t.emAndamento += saldo;
    else t.perda += saldo;
  }
  t.taxa = t.glosado > 0 ? (t.recuperado / t.glosado) * 100 : 0;
  return t;
}

type Indicador = {
  label: string;
  campo: keyof Totais;
  /** true quando diminuir é bom (ex.: glosado, perda) */
  menorMelhor: boolean;
  formato: "moeda" | "pct" | "num";
};

const INDICADORES: Indicador[] = [
  { label: "Total glosado", campo: "glosado", menorMelhor: true, formato: "moeda" },
  { label: "Recuperado", campo: "recuperado", menorMelhor: false, formato: "moeda" },
  { label: "Taxa de recuperação", campo: "taxa", menorMelhor: false, formato: "pct" },
  { label: "Em análise / recurso", campo: "emAndamento", menorMelhor: true, formato: "moeda" },
  { label: "Perda definitiva", campo: "perda", menorMelhor: true, formato: "moeda" },
  { label: "Lançamentos", campo: "lancamentos", menorMelhor: true, formato: "num" },
];

const formatar = (v: number, f: Indicador["formato"]) =>
  f === "moeda" ? fmt(v) : f === "pct" ? `${v.toFixed(1)}%` : v.toLocaleString("pt-BR");

export function GlosasComparativo({ glosas }: { glosas: GlosaAno[] }) {
  const [operadoraFiltro, setOperadoraFiltro] = useState("todas");
  const [mesFiltro, setMesFiltro] = useState("todos");

  const anos = useMemo(
    () => Array.from(new Set(glosas.map((g) => g.ano))).sort((a, b) => a - b),
    [glosas],
  );
  const operadoras = useMemo(
    () => Array.from(new Set(glosas.map((g) => g.operadora))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [glosas],
  );
  const meses = useMemo(() => {
    const presentes = new Set(glosas.map((g) => g.mes));
    return MESES_ORDEM.filter((m) => presentes.has(m));
  }, [glosas]);

  const filtradas = useMemo(
    () =>
      glosas.filter(
        (g) =>
          (operadoraFiltro === "todas" || g.operadora === operadoraFiltro) &&
          (mesFiltro === "todos" || g.mes === mesFiltro),
      ),
    [glosas, operadoraFiltro, mesFiltro],
  );

  const porAno = useMemo(() => {
    const map = new Map<number, Totais>();
    for (const ano of anos) map.set(ano, totaisDe(filtradas.filter((g) => g.ano === ano)));
    return map;
  }, [filtradas, anos]);

  const anoA = anos[0];
  const anoB = anos[anos.length - 1];
  const temComparacao = anos.length >= 2;
  const tA = anoA !== undefined ? porAno.get(anoA) : undefined;
  const tB = anoB !== undefined ? porAno.get(anoB) : undefined;

  const evolucaoMensal = useMemo(() => {
    return MESES_ORDEM.map((mes) => {
      const ponto: Record<string, number | string> = { mes: MES_CURTO[mes] ?? mes };
      let temDado = false;
      for (const ano of anos) {
        const total = filtradas
          .filter((g) => g.ano === ano && g.mes === mes)
          .reduce((acc, g) => acc + g.valorGlosado, 0);
        if (total > 0) temDado = true;
        ponto[String(ano)] = total;
      }
      return temDado ? ponto : null;
    }).filter(Boolean) as Record<string, number | string>[];
  }, [filtradas, anos]);

  const porStatus = useMemo(() => {
    return STATUS_ORDER.map((status) => {
      const ponto: Record<string, number | string> = { status };
      let temDado = false;
      for (const ano of anos) {
        const total = filtradas
          .filter((g) => g.ano === ano && g.status === status)
          .reduce((acc, g) => acc + g.valorGlosado, 0);
        if (total > 0) temDado = true;
        ponto[String(ano)] = total;
      }
      return temDado ? ponto : null;
    }).filter(Boolean) as Record<string, number | string>[];
  }, [filtradas, anos]);

  const porOperadora = useMemo(() => {
    const map = new Map<string, Record<number, number>>();
    for (const g of filtradas) {
      const cur = map.get(g.operadora) ?? {};
      cur[g.ano] = (cur[g.ano] ?? 0) + g.valorGlosado;
      map.set(g.operadora, cur);
    }
    return Array.from(map.entries())
      .map(([operadora, dados]) => ({ operadora, dados }))
      .sort((a, b) => {
        const ta = anos.reduce((acc, ano) => acc + (a.dados[ano] ?? 0), 0);
        const tb = anos.reduce((acc, ano) => acc + (b.dados[ano] ?? 0), 0);
        return tb - ta;
      });
  }, [filtradas, anos]);

  const diffGlosado = tA && tB ? tB.glosado - tA.glosado : 0;
  const pctGlosado = tA && tA.glosado > 0 ? (diffGlosado / tA.glosado) * 100 : null;
  const reduziu = diffGlosado < 0;

  const recorte = [
    mesFiltro === "todos" ? "todos os meses" : mesFiltro,
    operadoraFiltro === "todas" ? "todas as operadoras" : operadoraFiltro,
  ].join(" · ");

  return (
    <section className="space-y-6">
      {/* Cabeçalho + filtros */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Comparativo de glosas</h2>
          <p className="text-sm text-muted-foreground">
            {anos.join(" × ")} · {recorte}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={mesFiltro} onValueChange={setMesFiltro}>
            <SelectTrigger className="w-[170px]" aria-label="Filtrar por mês"><SelectValue placeholder="Mês" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os meses</SelectItem>
              {meses.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={operadoraFiltro} onValueChange={setOperadoraFiltro}>
            <SelectTrigger className="w-[220px]" aria-label="Filtrar por operadora"><SelectValue placeholder="Operadora" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as operadoras</SelectItem>
              {operadoras.map((op) => <SelectItem key={op} value={op}>{op}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 1. Resultado principal */}
      {temComparacao && tA && tB && (
        <Card className={`border-l-4 ${reduziu ? "border-l-[color:var(--color-success)]" : diffGlosado > 0 ? "border-l-destructive" : ""}`}>
          <CardContent className="grid gap-6 p-6 md:grid-cols-[1fr_auto_1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Glosado em {anoA}</p>
              <p className="mt-1 text-2xl font-semibold">{fmt(tA.glosado)}</p>
            </div>
            <span className="hidden text-2xl text-muted-foreground md:block">→</span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Glosado em {anoB}</p>
              <p className="mt-1 text-2xl font-semibold">{fmt(tB.glosado)}</p>
            </div>
            {pctGlosado !== null && diffGlosado !== 0 && (
              <div
                className={`flex items-center gap-3 rounded-xl px-4 py-3 ${reduziu ? "bg-success/10 text-[color:var(--color-success)]" : "bg-destructive/10 text-destructive"}`}
              >
                {reduziu ? <TrendingDown className="h-7 w-7" /> : <TrendingUp className="h-7 w-7" />}
                <div>
                  <p className="text-xl font-bold leading-none">
                    {reduziu ? "−" : "+"}{Math.abs(pctGlosado).toFixed(1)}%
                  </p>
                  <p className="mt-1 text-xs font-medium">
                    {reduziu ? "redução" : "aumento"} de {fmt(Math.abs(diffGlosado))}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 2. Indicadores lado a lado */}
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Indicadores</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indicador</TableHead>
                {anos.map((ano, i) => (
                  <TableHead key={ano} className="text-right">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ background: CORES_ANO[i % CORES_ANO.length] }} />
                      {ano}
                    </span>
                  </TableHead>
                ))}
                {temComparacao && <TableHead className="text-right">Variação</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {INDICADORES.map((ind) => {
                const va = tA?.[ind.campo] ?? 0;
                const vb = tB?.[ind.campo] ?? 0;
                let variacao: React.ReactNode = <span className="text-muted-foreground">—</span>;
                if (temComparacao) {
                  const diff = vb - va;
                  const bom = ind.menorMelhor ? diff < 0 : diff > 0;
                  const cor = diff === 0 ? "" : bom ? "text-[color:var(--color-success)]" : "text-destructive";
                  if (ind.formato === "pct") {
                    variacao = <span className={cor}>{diff > 0 ? "+" : ""}{diff.toFixed(1)}%</span>;
                  } else if (va) {
                    const pct = (diff / va) * 100;
                    variacao = <span className={cor}>{pct > 0 ? "+" : ""}{pct.toFixed(1)}%</span>;
                  }
                }
                return (
                  <TableRow key={ind.campo}>
                    <TableCell className="font-medium">{ind.label}</TableCell>
                    {anos.map((ano) => (
                      <TableCell key={ano} className="text-right tabular-nums">
                        {formatar(porAno.get(ano)?.[ind.campo] ?? 0, ind.formato)}
                      </TableCell>
                    ))}
                    {temComparacao && <TableCell className="text-right font-medium tabular-nums">{variacao}</TableCell>}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 3. Detalhamento em abas */}
      <Card>
        <Tabs defaultValue="mensal">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-2">
            <CardTitle className="text-base">Detalhamento</CardTitle>
            <TabsList>
              <TabsTrigger value="mensal">Por mês</TabsTrigger>
              <TabsTrigger value="status">Por status</TabsTrigger>
              <TabsTrigger value="operadora">Por operadora</TabsTrigger>
            </TabsList>
          </CardHeader>
          <CardContent>
            <TabsContent value="mensal" className="mt-0 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolucaoMensal} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={fmtCompact} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => fmt(v)} />
                  <Legend />
                  {anos.map((ano, i) => (
                    <Line key={ano} type="monotone" dataKey={String(ano)} name={String(ano)} stroke={CORES_ANO[i % CORES_ANO.length]} strokeWidth={2.5} dot={{ r: 3 }} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="status" className="mt-0 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={porStatus} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="status" stroke="var(--color-muted-foreground)" fontSize={11} interval={0} angle={-20} textAnchor="end" height={60} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={fmtCompact} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => fmt(v)} />
                  <Legend />
                  {anos.map((ano, i) => (
                    <Bar key={ano} dataKey={String(ano)} name={String(ano)} fill={CORES_ANO[i % CORES_ANO.length]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="operadora" className="mt-0">
              <div className="max-h-[420px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operadora</TableHead>
                      {anos.map((ano) => (
                        <TableHead key={ano} className="text-right">Glosado {ano}</TableHead>
                      ))}
                      {temComparacao && <TableHead className="text-right">Variação</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {porOperadora.map(({ operadora, dados }) => {
                      const va = anoA !== undefined ? dados[anoA] ?? 0 : 0;
                      const vb = anoB !== undefined ? dados[anoB] ?? 0 : 0;
                      const pct = va ? ((vb - va) / va) * 100 : null;
                      return (
                        <TableRow key={operadora}>
                          <TableCell className="font-medium">{operadora}</TableCell>
                          {anos.map((ano) => (
                            <TableCell key={ano} className="text-right tabular-nums">
                              {dados[ano] ? fmt(dados[ano]) : <span className="text-muted-foreground">—</span>}
                            </TableCell>
                          ))}
                          {temComparacao && (
                            <TableCell className="text-right font-medium tabular-nums">
                              {pct === null ? (
                                <span className="text-muted-foreground">—</span>
                              ) : (
                                <span className={pct < 0 ? "text-[color:var(--color-success)]" : pct > 0 ? "text-destructive" : ""}>
                                  {pct > 0 ? "+" : ""}{pct.toFixed(1)}%
                                </span>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                    {porOperadora.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={anos.length + 2} className="py-8 text-center text-muted-foreground">
                          Sem glosas para este filtro.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </section>
  );
}
