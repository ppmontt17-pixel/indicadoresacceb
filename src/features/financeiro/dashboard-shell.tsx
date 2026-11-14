import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import accebLogoUrl from "@/assets/acceb-logo.png";
const accebLogo = { url: accebLogoUrl };
import {
  Banknote,
  FileSpreadsheet,
  Landmark,
  LayoutDashboard,
  Menu,
  ReceiptText,
  TrendingUp,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { FINANCE_SHEETS } from "@/features/financeiro/finance-sheets";

export type ShellNavId = "overview" | "receita" | "outputs" | "aporte" | "cash";

const ANALYSIS_ITEMS: { id: ShellNavId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "receita", label: "Receitas", icon: TrendingUp },
  { id: "outputs", label: "Custos e despesas", icon: ReceiptText },
  { id: "aporte", label: "Aportes", icon: Landmark },
  { id: "cash", label: "Fluxo de caixa", icon: Banknote },
];

type DashboardShellProps = {
  active: string;
  title: string;
  subtitle?: string;
  headerActions?: ReactNode;
  onNavAction?: (id: ShellNavId) => void;
  children: ReactNode;
};

function Brand() {
  return (
    <Link to="/portal" className="flex h-20 shrink-0 items-center gap-3 px-4" title="Voltar ao portal">
      <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-sidebar-border bg-card p-1 shadow-sm">
        <img src={accebLogo.url} alt="ACCEB" className="size-full rounded-md object-contain" />
      </span>
      <span className="text-sm font-semibold leading-snug text-sidebar-foreground">ACCEB -<br />Centro Médico</span>
    </Link>
  );
}

function NavButton({ icon: Icon, label, active = false, onClick }: { icon: typeof LayoutDashboard; label: string; active?: boolean; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className={`mb-1 h-10 w-full justify-start gap-3 px-3 text-sm font-medium ${active ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}
    >
      <Icon className="size-4" />
      <span className="truncate">{label}</span>
    </Button>
  );
}

function NavContent({ active, onNavAction, closeMobile }: { active: string; onNavAction?: ((id: ShellNavId) => void) | undefined; closeMobile?: (() => void) | undefined }) {
  const close = () => closeMobile?.();
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Navegação principal">
      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/45">Análises</p>
      {onNavAction
        ? ANALYSIS_ITEMS.map((item) => (
            <NavButton key={item.id} icon={item.icon} label={item.label} active={active === item.id} onClick={() => { onNavAction(item.id); close(); }} />
          ))
        : (
          <Link to="/financeiro" onClick={close} className="block">
            <span className="mb-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground">
              <LayoutDashboard className="size-4 shrink-0" />
              <span className="truncate">Visão geral</span>
            </span>
          </Link>
        )}
      <p className="mt-7 px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/45">Serviços principais</p>
      {FINANCE_SHEETS.map((sheet) => (
        <Link key={sheet.id} to="/financeiro/abas/$sheetId" params={{ sheetId: sheet.id }} onClick={close} className="block">
          <span className={`mb-1 flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors ${active === sheet.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`}>
            <FileSpreadsheet className="size-4 shrink-0" />
            <span className="truncate">{sheet.label}</span>
          </span>
        </Link>
      ))}
    </nav>
  );
}

export function DashboardShell({ active, title, subtitle, headerActions, onNavAction, children }: DashboardShellProps) {
  const [mobileNav, setMobileNav] = useState(false);
  const closeMobile = () => setMobileNav(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col">
        <Brand />
        <NavContent active={active} onNavAction={onNavAction} />
        <Link to="/portal" className="m-4 rounded-md border-t border-sidebar-border px-3 pt-4 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground">← Voltar ao portal</Link>
      </aside>

      {mobileNav ? (
        <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={closeMobile}>
          <aside className="flex h-full w-72 flex-col bg-sidebar p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <Brand />
              <Button variant="ghost" size="icon" aria-label="Fechar menu" onClick={closeMobile}><X /></Button>
            </div>
            <NavContent active={active} onNavAction={onNavAction} closeMobile={closeMobile} />
          </aside>
        </div>
      ) : null}

      <main className="lg:ml-60">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menu" onClick={() => setMobileNav(true)}><Menu /></Button>
              <div className="flex items-center gap-2 lg:hidden">
                <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-card p-1 shadow-sm">
                  <img src={accebLogo.url} alt="ACCEB" className="size-full rounded-md object-contain" />
                </span>
                <span className="max-w-28 text-xs font-semibold leading-snug text-foreground">ACCEB - Centro Médico</span>
              </div>
              <div className="hidden min-w-0 lg:block">
                <h1 className="truncate font-display text-xl font-semibold sm:text-2xl">{title}</h1>
                {subtitle ? <p className="hidden truncate text-xs text-muted-foreground sm:block">{subtitle}</p> : null}
              </div>
            </div>
            {headerActions ? <div className="flex items-center gap-2">{headerActions}</div> : null}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
