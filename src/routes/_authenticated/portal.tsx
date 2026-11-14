import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, LogOut, Receipt, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Painéis — Portal ACCEB" },
      { name: "description", content: "Todos os painéis da ACCEB em um só lugar." },
      { property: "og:title", content: "Painéis — Portal ACCEB" },
      { property: "og:description", content: "Todos os painéis da ACCEB em um só lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Portal,
});

const panels = [
  {
    name: "Financeiro",
    description: "Custos, fluxo de caixa e serviços principais, organizados a partir das planilhas.",
    url: "https://custosacceb.lovable.app",
    icon: Wallet,
  },
  {
    name: "Faturamento",
    description: "Receita por convênio, desempenho financeiro e status de glosas.",
    url: "https://accebfat2026.lovable.app",
    icon: Receipt,
  },
];

function Portal() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <main className="portal-bg min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">ACCEB · Centro Médico</p>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut /> Sair
            </Button>
          </div>
        </header>

        <section className="mt-16 max-w-2xl">
          <h1 className="font-display text-5xl leading-tight text-foreground">Seus painéis, em um só lugar.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Escolha um painel para abrir.</p>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          {panels.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex flex-col rounded-2xl border bg-card p-8 shadow-soft transition-all hover:-translate-y-1 hover:border-primary hover:shadow-lift"
            >
              <div className="flex items-start justify-between">
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <p.icon className="size-6" />
                </span>
                <ArrowUpRight className="size-6 text-muted-foreground transition-colors group-hover:text-primary" />
              </div>
              <h2 className="mt-8 font-display text-3xl text-foreground">{p.name}</h2>
              <p className="mt-2 text-muted-foreground">{p.description}</p>
              <span className="mt-6 text-sm font-semibold text-primary">Abrir painel →</span>
            </a>
          ))}
        </section>
      </div>
    </main>
  );
}
