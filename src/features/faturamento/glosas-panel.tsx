import { useMemo, useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Target,
  XCircle,
  X,
  Lock,
  Unlock,
  Inbox,
  Search,
  FileText,
  Send,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type GlosaStatus =
  | "Em análise"
  | "A recursar"
  | "Pago"
  | "Pago Parcial"
  | "Glosa devida"
  | "Não Pago"
  | "Excedeu o Prazo";

export type Glosa = {
  data?: string;
  operadora: string;
  mes: string;
  numeroGuia?: string | undefined;
  paciente?: string | undefined;
  procedimento?: string | undefined;
  motivo?: string | undefined;
  valorGlosado: number;
  valorRecuperado: number;
  status: GlosaStatus;
};

export const STATUS_ORDER: GlosaStatus[] = [
  "Em análise",
  "A recursar",
  "Pago",
  "Pago Parcial",
  "Glosa devida",
  "Não Pago",
  "Excedeu o Prazo",
];

const RECUPERADOS: GlosaStatus[] = ["Pago", "Pago Parcial"];
const EM_ANDAMENTO: GlosaStatus[] = ["Em análise", "A recursar"];
const PERDAS: GlosaStatus[] = ["Glosa devida", "Não Pago", "Excedeu o Prazo"];

export const STATUS_COLOR: Record<GlosaStatus, string> = {
  "Em análise": "var(--color-chart-3)",
  "A recursar": "var(--color-chart-1)",
  Pago: "var(--color-chart-2)",
  "Pago Parcial": "var(--color-chart-5)",
  "Glosa devida": "var(--color-chart-4)",
  "Não Pago": "var(--color-destructive)",
  "Excedeu o Prazo": "var(--color-warning)",
};


export const MESES_ORDEM = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MES_CURTO: Record<string, string> = {
  Janeiro: "Jan",
  Fevereiro: "Fev",
  Março: "Mar",
  Abril: "Abr",
  Maio: "Mai",
  Junho: "Jun",
  Julho: "Jul",
  Agosto: "Ago",
  Setembro: "Set",
  Outubro: "Out",
  Novembro: "Nov",
  Dezembro: "Dez",
};

export const fmt = (v: number) =>
  v.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtCompact = (v: number) =>
  "R$ " + Intl.NumberFormat("pt-BR", { notation: "compact", maximumFractionDigits: 1 }).format(v);

export function GlosasPanel({
  glosas,
  mesFiltro,
  operadoraFiltro,
  faturamentoTotal = 0,
}: {
  glosas: Glosa[];
  mesFiltro: string;
  operadoraFiltro: string;
  faturamentoTotal?: number;
}) {
  const [metaGlosa, setMetaGlosa] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("glosa-meta-percent");
      return saved ? Number(saved) : 2;
    }
    return 2;
  });
  const [operadoraSelecionada, setOperadoraSelecionada] = useState<string | null>(null);
  const [mesLocal, setMesLocal] = useState<string | null>(null);
  const [operadoraLocal, setOperadoraLocal] = useState<string | null>(null);
  const [statusLocal, setStatusLocal] = useState<GlosaStatus | "todos">("todos");

  const [podeEditar, setPodeEditar] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("glosa-meta-edit-enabled") === "true";
    }
    return false;
  });
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senha, setSenha] = useState("");
  const [erroSenha, setErroSenha] = useState(false);

  const META_GLOSA_SENHA_CRIADOR = "acceb2026";

  const ativarEdicao = () => {
    if (senha === META_GLOSA_SENHA_CRIADOR) {
      setPodeEditar(true);
      setErroSenha(false);
      setMostrarSenha(false);
      setSenha("");
      if (typeof window !== "undefined") {
        localStorage.setItem("glosa-meta-edit-enabled", "true");
      }
    } else {
      setErroSenha(true);
    }
  };

  const bloquearEdicao = () => {
    setPodeEditar(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("glosa-meta-edit-enabled");
    }
  };

  useEffect(() => {
    localStorage.setItem("glosa-meta-percent", String(metaGlosa));
  }, [metaGlosa]);

  // Follow header changes, but allow an explicit "all" selection locally.
  useEffect(() => { setMesLocal(null); }, [mesFiltro]);
  useEffect(() => {
    setOperadoraLocal(null);
    setOperadoraSelecionada(null);
  }, [operadoraFiltro]);

  const mesEfetivo = mesLocal ?? mesFiltro;
  const operadoraEfetiva = operadoraLocal ?? operadoraFiltro;

  const filtradas = useMemo(() => {
    let r = glosas;
    if (mesEfetivo !== "todos") r = r.filter((g) => g.mes === mesEfetivo);
    if (operadoraEfetiva !== "todas") r = r.filter((g) => g.operadora === operadoraEfetiva);
    if (statusLocal !== "todos") r = r.filter((g) => g.status === statusLocal);
    if (operadoraSelecionada) r = r.filter((g) => g.operadora === operadoraSelecionada);
    return r;
  }, [glosas, mesEfetivo, operadoraEfetiva, statusLocal, operadoraSelecionada]);

  const mesesDisponiveis = useMemo(() => {
    const set = new Set(glosas.map((g) => g.mes));
    return MESES_ORDEM.filter((m) => set.has(m));
  }, [glosas]);

  const operadorasDisponiveis = useMemo(
    () => Array.from(new Set(glosas.map((g) => g.operadora))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [glosas],
  );

  const totals = useMemo(() => {
    const t = {
      total: 0,
      recuperado: 0,
      emAnalise: 0,
      recursada: 0,
      definitiva: 0,
      qtd: filtradas.length,
    };
    for (const g of filtradas) {
      t.total += g.valorGlosado;
      t.recuperado += g.valorRecuperado;
      const saldo = g.valorGlosado - g.valorRecuperado;
      if (g.status === "Em análise") t.emAnalise += saldo;
      if (g.status === "A recursar") t.recursada += saldo;
      if (PERDAS.includes(g.status)) t.definitiva += saldo;
    }
    return t;
  }, [filtradas]);


  const taxaRec = totals.total ? ((totals.recuperado / totals.total) * 100).toFixed(1) : "0";

  const baseMeta = faturamentoTotal > 0 ? faturamentoTotal : totals.total;
  const taxaGlosaMeta = baseMeta > 0 ? (totals.total / baseMeta) * 100 : 0;
  const metaUltrapassada = taxaGlosaMeta > metaGlosa;

  const porStatus = useMemo(() => {
    const m = new Map<GlosaStatus, number>();
    for (const s of STATUS_ORDER) m.set(s, 0);
    for (const g of filtradas) {
      m.set(g.status, (m.get(g.status) ?? 0) + g.valorGlosado);
    }
    return STATUS_ORDER.map((s) => ({ name: s, value: m.get(s) ?? 0, fill: STATUS_COLOR[s] }));
  }, [filtradas]);

  const resumoStatus = useMemo(() => {
    const m = new Map<
      GlosaStatus,
      { status: GlosaStatus; qtd: number; glosado: number; recuperado: number }
    >();
    for (const s of STATUS_ORDER) m.set(s, { status: s, qtd: 0, glosado: 0, recuperado: 0 });
    for (const g of filtradas) {
      const cur = m.get(g.status)!;
      cur.qtd += 1;
      cur.glosado += g.valorGlosado;
      cur.recuperado += g.valorRecuperado;
    }
    const total = filtradas.reduce((acc, g) => acc + g.valorGlosado, 0);
    return STATUS_ORDER.map((s) => {
      const r = m.get(s)!;
      return {
        ...r,
        saldo: Math.max(r.glosado - r.recuperado, 0),
        part: total > 0 ? (r.glosado / total) * 100 : 0,
      };
    });
  }, [filtradas]);


  const porOperadora = useMemo(() => {
    const m = new Map<string, { operadora: string; glosado: number; recuperado: number }>();
    for (const g of filtradas) {
      const cur = m.get(g.operadora);
      if (cur) {
        cur.glosado += g.valorGlosado;
        cur.recuperado += g.valorRecuperado;
      } else {
        m.set(g.operadora, {
          operadora: g.operadora,
          glosado: g.valorGlosado,
          recuperado: g.valorRecuperado,
        });
      }
    }
    return Array.from(m.values())
      .sort((a, b) => b.glosado - a.glosado)
      .slice(0, 10);
  }, [filtradas]);

  const evolucao = useMemo(() => {
    const map = new Map<string, { mes: string; glosado: number; recuperado: number }>();
    for (const g of filtradas) {
      const cur = map.get(g.mes);
      if (cur) {
        cur.glosado += g.valorGlosado;
        cur.recuperado += g.valorRecuperado;
      } else {
        map.set(g.mes, { mes: g.mes, glosado: g.valorGlosado, recuperado: g.valorRecuperado });
      }
    }
    return MESES_ORDEM.filter((m) => map.has(m)).map((m) => ({
      ...map.get(m),
      mes: MES_CURTO[m] ?? m,
    }));
  }, [filtradas]);

  const processoSteps = useMemo(() => {
    const total = filtradas.length;
    const emAnalise = filtradas.filter((g) => g.status === "Em análise").length;
    const recursada = filtradas.filter((g) => g.status === "A recursar").length;
    const finalizadas = filtradas.filter(
      (g) => RECUPERADOS.includes(g.status) || PERDAS.includes(g.status),
    ).length;
    const recuperada = filtradas.filter((g) => RECUPERADOS.includes(g.status)).length;
    const definitiva = filtradas.filter((g) => PERDAS.includes(g.status)).length;

    return [
      {
        key: "recebimento",
        title: "1. Recebimento",
        desc: "Glosa identificada no retorno da operadora e registrada no sistema.",
        icon: <Inbox className="h-5 w-5" />,
        count: total,
        valor: filtradas.reduce((s, g) => s + g.valorGlosado, 0),
        color: "var(--color-chart-3)",
      },
      {
        key: "analise",
        title: "2. Análise técnica",
        desc: "Conferência do motivo, prontuário, autorização e tabela contratual.",
        icon: <Search className="h-5 w-5" />,
        count: emAnalise,
        valor: filtradas
          .filter((g) => g.status === "Em análise")
          .reduce((s, g) => s + g.valorGlosado, 0),
        color: "var(--color-chart-3)",
      },
      {
        key: "recurso",
        title: "3. Recurso / defesa",
        desc: "Elaboração e envio do recurso administrativo à operadora.",
        icon: <FileText className="h-5 w-5" />,
        count: recursada,
        valor: filtradas
          .filter((g) => g.status === "A recursar")
          .reduce((s, g) => s + g.valorGlosado, 0),
        color: "var(--color-chart-1)",
      },
      {
        key: "retorno",
        title: "4. Retorno da operadora",
        desc: "Acompanhamento do parecer e tratativa de pendências.",
        icon: <Send className="h-5 w-5" />,
        count: recursada,
        valor: 0,
        color: "var(--color-chart-1)",
      },
      {
        key: "resultado",
        title: "5. Resultado",
        desc: "Glosa recuperada (pagamento liberado) ou tornada definitiva (perda).",
        icon: <CheckCircle2 className="h-5 w-5" />,
        count: finalizadas,
        valor: filtradas
          .filter((g) => RECUPERADOS.includes(g.status) || PERDAS.includes(g.status))
          .reduce((s, g) => s + g.valorGlosado, 0),
        color: "var(--color-chart-2)",
        extra: { recuperada, definitiva },
      },
    ];
  }, [filtradas]);

  if (glosas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Análise de glosas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Nenhum lançamento de glosa importado. Adicione a aba <code>Glosas</code> na planilha
            (colunas: Operadora, Competência, Guia, Paciente, Procedimento, Motivo, Valor Glosado,
            Valor Recuperado, Status) e importe novamente.
          </p>
        </CardContent>
      </Card>
    );
  }


  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Análise de glosas</h2>
          <p className="text-sm text-muted-foreground">
            Detalhamento por período, operadora e status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={mesEfetivo} onValueChange={setMesLocal}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os períodos</SelectItem>
              {mesesDisponiveis.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={operadoraSelecionada ?? operadoraEfetiva} onValueChange={(value) => {
            setOperadoraLocal(value);
            setOperadoraSelecionada(null);
          }}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Operadora" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as operadoras</SelectItem>
              {operadorasDisponiveis.map((op) => (
                <SelectItem key={op} value={op}>
                  {op}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={statusLocal}
            onValueChange={(v) => setStatusLocal(v as GlosaStatus | "todos")}
          >
            <SelectTrigger className="w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              {STATUS_ORDER.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(mesEfetivo !== "todos" ||
            operadoraEfetiva !== "todas" ||
            statusLocal !== "todos" ||
            operadoraSelecionada) && (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1"
              onClick={() => {
                setMesLocal("todos");
                setOperadoraLocal("todas");
                setStatusLocal("todos");
                setOperadoraSelecionada(null);
              }}
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </Button>
          )}
        </div>
      </div>


      <Tabs defaultValue="visao" className="space-y-6">
        <TabsList>
          <TabsTrigger value="visao">Visão geral</TabsTrigger>
          <TabsTrigger value="processo">Processo</TabsTrigger>
        </TabsList>

        <TabsContent value="visao" className="space-y-6">


      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MiniKpi
          label="Total glosado"
          value={fmt(totals.total)}
          hint={`${totals.qtd} lançamentos`}
          icon={<AlertTriangle className="h-4 w-4" />}
          accent="destructive"
        />
        <MiniKpi
          label="Recuperado"
          value={fmt(totals.recuperado)}
          hint={`${taxaRec}% de recuperação`}
          icon={<ShieldCheck className="h-4 w-4" />}
          accent="success"
        />
        <MiniKpi
          label="Em análise / recurso"
          value={fmt(totals.emAnalise + totals.recursada)}
          hint="A recuperar"
          icon={<RotateCcw className="h-4 w-4" />}
          accent="warning"
        />
        <MiniKpi
          label="Perda definitiva"
          value={fmt(totals.definitiva)}
          hint="Glosa não recuperada"
          icon={<XCircle className="h-4 w-4" />}
          accent="destructive"
        />
      </div>

      {/* Meta de glosa — só faz sentido quando há faturamento no período */}
      {faturamentoTotal > 0 && (
      <Card className={metaUltrapassada ? "border-destructive" : undefined}>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4" />
            Meta de glosa
            {podeEditar ? (
              <Unlock className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={
                metaUltrapassada
                  ? "bg-destructive/10 text-destructive"
                  : "bg-success/15 text-[color:var(--color-success)]"
              }
            >
              {metaUltrapassada ? "Meta ultrapassada" : "Dentro da meta"}
            </Badge>
            {!podeEditar ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMostrarSenha(true);
                  setErroSenha(false);
                  setSenha("");
                }}
                className="gap-1"
              >
                <Lock className="h-3.5 w-3.5" />
                Editar meta
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={bloquearEdicao}
                className="gap-1"
              >
                <Unlock className="h-3.5 w-3.5" />
                Bloquear edição
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mostrarSenha && (
            <div className="flex flex-col gap-2 rounded-lg bg-muted/50 p-3 sm:flex-row sm:items-center">
              <Input
                type="password"
                placeholder="Senha do criador"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErroSenha(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") ativarEdicao();
                }}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={ativarEdicao}>
                  Liberar
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setMostrarSenha(false);
                    setSenha("");
                    setErroSenha(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
          {erroSenha && (
            <p className="text-sm text-destructive">Senha incorreta.</p>
          )}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Slider
                value={[metaGlosa]}
                onValueChange={(v) => podeEditar && setMetaGlosa(v[0] ?? 0)}
                min={0}
                max={30}
                step={0.5}
                disabled={!podeEditar}
              />
            </div>
            <div className="flex items-center gap-2 w-32">
              <Input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={metaGlosa}
                onChange={(e) => podeEditar && setMetaGlosa(Number(e.target.value))}
                className="text-right"
                disabled={!podeEditar}
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Taxa atual:{" "}
              <strong className={metaUltrapassada ? "text-destructive" : "text-foreground"}>
                {taxaGlosaMeta.toFixed(1)}%
              </strong>
            </span>
            <span className="text-muted-foreground">
              Meta: <strong>{metaGlosa}%</strong>
            </span>
          </div>
          {metaUltrapassada && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              A taxa de glosa ({taxaGlosaMeta.toFixed(1)}%) ultrapassou a meta definida ({metaGlosa}%).
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Evolução temporal + Status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Evolução mensal de glosas</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucao} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="mes" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  tickFormatter={fmtCompact}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                  formatter={(v: number) => fmt(v)}
                />
                <Line
                  type="monotone"
                  dataKey="glosado"
                  name="Glosado"
                  stroke="var(--color-chart-4)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="recuperado"
                  name="Recuperado"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Glosas por status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                  }}
                  formatter={(v: number) => fmt(v)}
                />
                <Pie
                  data={porStatus.filter((d) => d.value > 0)}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {porStatus.map((d) => (
                    <Cell key={d.name} fill={d.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs">
              {porStatus.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: d.fill }}
                  />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top operadoras */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
          <CardTitle className="text-base">Top operadoras que mais glosam</CardTitle>
          {operadoraSelecionada && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOperadoraSelecionada(null)}
              className="gap-1"
            >
              <X className="h-3 w-3" />
              Limpar filtro: {operadoraSelecionada}
            </Button>
          )}
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={porOperadora}
              margin={{ left: 4, right: 12, top: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="operadora" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={fmtCompact}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-popover)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 12,
                }}
                formatter={(v: number) => fmt(v)}
              />
              <Bar
                dataKey="recuperado"
                name="Recuperado"
                stackId="g"
                fill="var(--color-chart-2)"
              />
              <Bar dataKey="glosado" name="Glosado" stackId="g" fill="var(--color-chart-4)">
                {porOperadora.map((d) => (
                  <Cell
                    key={d.operadora}
                    fill="var(--color-chart-4)"
                    onClick={() => setOperadoraSelecionada(d.operadora)}
                    cursor="pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Clique em uma barra para filtrar os lançamentos por operadora.
          </p>
        </CardContent>
      </Card>

      {/* Análise por status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Análise por status</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            {resumoStatus.map((s) => (
              <div key={s.status} className="rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    style={{ background: STATUS_COLOR[s.status] + "22", color: STATUS_COLOR[s.status] }}
                  >
                    {s.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {s.qtd} lançamento{s.qtd === 1 ? "" : "s"} · {s.part.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Glosado</p>
                    <p className="font-semibold text-destructive">{fmt(s.glosado)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Recuperado</p>
                    <p className="font-semibold text-[color:var(--color-success)]">
                      {fmt(s.recuperado)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Saldo</p>
                    <p className="font-semibold">{fmt(s.saldo)}</p>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.part}%`, background: STATUS_COLOR[s.status] }}
                  />
                </div>
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resumoStatus} layout="vertical" margin={{ left: 10, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => fmtCompact(Number(v))} fontSize={11} />
              <YAxis type="category" dataKey="status" width={90} fontSize={11} />
              <Tooltip formatter={(v: number) => fmt(Number(v))} />
              <Bar dataKey="recuperado" name="Recuperado" stackId="s" fill="var(--color-chart-2)" />
              <Bar dataKey="saldo" name="Em aberto" stackId="s" radius={[0, 4, 4, 0]}>
                {resumoStatus.map((s) => (
                  <Cell key={s.status} fill={STATUS_COLOR[s.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lançamentos de glosa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[480px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operadora</TableHead>
                  <TableHead>Competência</TableHead>
                  <TableHead>Guia</TableHead>
                  <TableHead className="text-right">Glosado</TableHead>
                  <TableHead className="text-right">Recuperado</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtradas.map((g, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{g.operadora}</TableCell>
                    <TableCell className="text-muted-foreground">{g.mes}</TableCell>
                    <TableCell className="text-muted-foreground">{g.numeroGuia ?? "—"}</TableCell>
                    <TableCell className="text-right text-destructive">
                      {fmt(g.valorGlosado)}
                    </TableCell>
                    <TableCell className="text-right text-[color:var(--color-success)]">
                      {fmt(g.valorRecuperado)}
                    </TableCell>
                    <TableCell className="text-right">
                      {fmt(g.valorGlosado - g.valorRecuperado)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        style={{
                          background: STATUS_COLOR[g.status] + "22",
                          color: STATUS_COLOR[g.status],
                        }}
                      >
                        {g.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtradas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Nenhuma glosa para os filtros atuais.
                    </TableCell>
                  </TableRow>
                )}
                {filtradas.length > 0 && (
                  <TableRow className="bg-muted/50 font-semibold">
                    <TableCell colSpan={3}>Total ({totals.qtd})</TableCell>
                    <TableCell className="text-right text-destructive">{fmt(totals.total)}</TableCell>
                    <TableCell className="text-right text-[color:var(--color-success)]">
                      {fmt(totals.recuperado)}
                    </TableCell>
                    <TableCell className="text-right">
                      {fmt(totals.total - totals.recuperado)}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

        </TabsContent>

        <TabsContent value="processo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fluxo do processo de glosa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Etapas que cada glosa percorre, do recebimento até o resultado final. Os
                contadores refletem os filtros aplicados.
              </p>
            </CardContent>
          </Card>

          <ol className="relative space-y-4">
            {processoSteps.map((step, idx) => (
              <li key={step.key} className="relative">
                <Card>
                  <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{ background: step.color + "22", color: step.color }}
                    >
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                      {step.extra && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-success/15 text-[color:var(--color-success)]"
                          >
                            Recuperadas: {step.extra.recuperada}
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-destructive/10 text-destructive"
                          >
                            Definitivas: {step.extra.definitiva}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-semibold tracking-tight">{step.count}</p>
                      <p className="text-xs text-muted-foreground">lançamentos</p>
                      {step.valor > 0 && (
                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                          {fmt(step.valor)}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                {idx < processoSteps.length - 1 && (
                  <div className="flex justify-center py-1 text-muted-foreground">
                    <ArrowRight className="h-4 w-4 rotate-90" />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function MiniKpi({
  label,
  value,
  hint,
  icon,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
  accent: "success" | "warning" | "destructive";
}) {
  const accentMap: Record<string, string> = {
    success: "bg-success/15 text-[color:var(--color-success)]",
    warning: "bg-warning/20 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  };
  return (
    <Card>
      <CardContent className="p-5">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentMap[accent]}`}
        >
          {icon}
        </div>
        <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}
