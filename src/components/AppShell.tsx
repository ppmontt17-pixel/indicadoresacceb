import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { FolderOpen, Home, LogOut, Menu, UserRound, Users } from "lucide-react";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { accessQuery } from "@/lib/access";
import { getSectorDestination } from "@/lib/sector-panels";
import { Button } from "@/components/ui/button";
import accebLogo from "@/assets/acceb-logo.png";

export function AppShell({ children }: { children: ReactNode }) {
  const { data } = useSuspenseQuery(accessQuery);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(true);
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  const link = "flex min-w-0 items-center gap-3 rounded-md px-3 py-3 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground";
  const active = { className: "bg-accent text-accent-foreground" };
  return (
    <main className="portal-bg min-h-screen px-6 py-8 sm:py-10">
      <div className="mx-auto grid max-w-6xl min-w-0 gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <header className="min-w-0 border-b border-primary/20 pb-8 lg:col-start-1 lg:row-start-1">
          <Link to="/portal" className="inline-grid max-w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4 font-display text-2xl text-foreground sm:gap-6 sm:text-4xl">
            <img src={accebLogo} alt="Logotipo da ACCEB" className="size-20 shrink-0 rounded-3xl object-contain shadow-soft sm:size-24" />
            <span className="min-w-0 leading-tight">ACCEB - Centro Médico</span>
          </Link>
        </header>
          <aside className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-l lg:border-primary/20 lg:pl-6 lg:pt-6" aria-label="Menu do usuário">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-b border-primary/20 pb-4">
              <div className="flex min-w-0 items-center gap-2">
                <UserRound className="size-5 shrink-0 text-primary" />
                <span className="min-w-0 truncate text-xs text-foreground" title={data.email}>{data.email}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Recolher menu" : "Abrir menu"} aria-expanded={menuOpen} aria-controls="portal-navigation" title={menuOpen ? "Recolher menu" : "Abrir menu"}><Menu className="size-5 shrink-0" /></Button>
            </div>
            {menuOpen && <nav id="portal-navigation" aria-label="Navegação dos setores" className="mt-3 flex min-w-0 flex-col gap-1">
              <Link to="/portal" className={link} activeProps={active}><Home className="size-4 shrink-0" /><span className="min-w-0">Início</span></Link>
              {data.sectors.map((s) => <Link key={s.id} {...getSectorDestination(s.slug)} className={link} activeProps={active}><FolderOpen className="size-4 shrink-0" /><span className="min-w-0">{s.name}</span></Link>)}
              {data.isAdmin && <Link to="/usuarios" className={link} activeProps={active}><Users className="size-4 shrink-0" /><span className="min-w-0">Usuários</span></Link>}
            </nav>}
            <div className="mt-4 border-t border-primary/20 pt-4"><Button variant="ghost" size="sm" className="w-full justify-start" onClick={signOut}><LogOut /> Sair</Button></div>
          </aside>
          <div className="min-w-0 lg:col-start-1 lg:row-start-2">{children}</div>
      </div>
    </main>
  );
}
