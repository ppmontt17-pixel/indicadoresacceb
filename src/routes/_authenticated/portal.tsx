import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FolderOpen } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { accessQuery } from "@/lib/access";
import { getSectorDestination } from "@/lib/sector-panels";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Indicadores ACCEB - 2026 — Centro Médico" },
      { name: "description", content: "Indicadores de 2026 dos setores da ACCEB - Centro Médico." },
      { property: "og:title", content: "Indicadores ACCEB - 2026 — Centro Médico" },
      { property: "og:description", content: "Indicadores de 2026 dos setores da ACCEB - Centro Médico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(accessQuery),
  component: Portal,
});

const card = "group flex min-w-0 flex-col rounded-2xl border border-primary/15 bg-card p-6 shadow-soft transition-all motion-safe:hover:-translate-y-1 hover:border-primary hover:shadow-lift";

function Portal() {
  const { data } = useSuspenseQuery(accessQuery);
  return (
    <AppShell>
      <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">Indicadores ACCEB - 2026</h1>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Setores</h2>
      {data.sectors.length === 0 ? (
        <p className="mt-4 text-muted-foreground">Você ainda não tem acesso a nenhum setor. Peça a um administrador.</p>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-2">
          {data.sectors.map((s) => (
            <Link key={s.id} {...getSectorDestination(s.slug)} className={card}>
              <FolderOpen className="size-6 text-primary" />
              <h3 className="mt-6 font-display text-2xl text-foreground">{s.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            </Link>
          ))}
        </div>
      )}

    </AppShell>
  );
}
