import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { accessQuery } from "@/lib/access";
import { getSectorDestination } from "@/lib/sector-panels";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: ReactNode }) {
  const { data } = useSuspenseQuery(accessQuery);
  const navigate = useNavigate();
  const qc = useQueryClient();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  const link = "rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground";
  const active = { className: "bg-accent text-accent-foreground" };
  return (
    <main className="portal-bg min-h-screen px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/portal" className="mr-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">ACCEB</Link>
            <Link to="/portal" className={link} activeProps={active}>Início</Link>
            {data.sectors.map((s) => (
              <Link key={s.id} {...getSectorDestination(s.slug)} className={link} activeProps={active}>{s.name}</Link>
            ))}
            {data.isAdmin && <Link to="/usuarios" className={link} activeProps={active}>Usuários</Link>}
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground md:inline">{data.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}><LogOut /> Sair</Button>
          </div>
        </header>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
