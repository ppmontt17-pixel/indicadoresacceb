import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight, FolderOpen, Receipt, Wallet } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { accessQuery } from "@/lib/access";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Início — Portal ACCEB" },
      { name: "description", content: "Painéis e setores da ACCEB em um só lugar." },
      { property: "og:title", content: "Início — Portal ACCEB" },
      { property: "og:description", content: "Painéis e setores da ACCEB em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(accessQuery),
  component: Portal,
});

const panels = [
  { name: "Financeiro", description: "Custos, fluxo de caixa e serviços principais.", url: "https://custosacceb.lovable.app", icon: Wallet },
  { name: "Faturamento", description: "Receita por convênio e status de glosas.", url: "https://accebfat2026.lovable.app", icon: Receipt },
];

const card = "group flex flex-col rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lift";

function Portal() {
  const { data } = useSuspenseQuery(accessQuery);
  return (
    <AppShell>
      <h1 className="font-display text-5xl leading-tight text-foreground">Tudo da ACCEB, em um só lugar.</h1>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Setores</h2>
      {data.sectors.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Você ainda não tem acesso a nenhum setor. Peça a um administrador.</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.sectors.map((s) => (
            <Link key={s.id} to="/setor/$slug" params={{ slug: s.slug }} className={card}>
              <FolderOpen className="size-6 text-primary" />
              <h3 className="mt-6 font-display text-2xl text-foreground">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            </Link>
          ))}
        </div>
      )}

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Painéis</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {panels.map((p) => (
          <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className={card}>
            <div className="flex items-start justify-between">
              <p.icon className="size-6 text-primary" />
              <ArrowUpRight className="size-5 text-muted-foreground group-hover:text-primary" />
            </div>
            <h3 className="mt-6 font-display text-2xl text-foreground">{p.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
          </a>
        ))}
      </div>
    </AppShell>
  );
}
