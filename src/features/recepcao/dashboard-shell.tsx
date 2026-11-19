import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Activity, ArrowLeft, ClipboardCheck, HeartPulse, Menu, Microscope, Star, Users, X } from "lucide-react";
import logo from "@/assets/acceb-logo.png";
import { Button } from "@/components/ui/button";

const items = [
  { label: "Atendimentos", icon: Activity },
  { label: "Convênios", icon: HeartPulse },
  { label: "Especialidades", icon: ClipboardCheck },
  { label: "Exames", icon: Microscope },
  { label: "Recepcionistas", icon: Users },
  { label: "Avaliações", icon: Star },
];

export function ReceptionShell({ active, onSelect, headerActions, children }: { active: number; onSelect: (index: number) => void; headerActions?: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  function navigation() {
    return <><Link to="/portal" className="flex h-20 shrink-0 items-center gap-3 px-4" title="Voltar ao portal"><span className="grid size-11 shrink-0 place-items-center rounded-lg border border-sidebar-border bg-card p-1"><img src={logo} alt="ACCEB" className="size-full object-contain"/></span><span className="text-sm font-semibold leading-snug text-sidebar-foreground">ACCEB -<br/>Centro Médico</span></Link><nav className="flex-1 overflow-y-auto px-3 py-6" aria-label="Indicadores da recepção"><p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/60">Indicadores</p>{items.map((item,index)=><Button key={item.label} variant="ghost" aria-current={active===index ? "page":undefined} onClick={()=>{onSelect(index);setOpen(false);}} className={`mb-1 h-11 w-full justify-start gap-3 px-3 ${active===index ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}><item.icon className="size-4"/>{item.label}</Button>)}</nav><Link to="/portal" className="m-4 flex items-center gap-2 border-t border-sidebar-border px-2 pt-4 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"><ArrowLeft className="size-4 shrink-0"/>Voltar aos setores</Link></>;
  }
  return <div className="min-h-screen bg-background text-foreground"><aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">{navigation()}</aside>{open && <div className="fixed inset-0 z-50 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={()=>setOpen(false)}><aside role="dialog" aria-modal="true" aria-label="Menu de indicadores" className="relative flex h-full w-72 max-w-[90%] flex-col bg-sidebar shadow-lift" onClick={e=>e.stopPropagation()}><Button variant="ghost" size="icon" aria-label="Fechar menu" className="absolute right-1 top-1 text-sidebar-foreground hover:bg-sidebar-accent" onClick={()=>setOpen(false)}><X/></Button>{navigation()}</aside></div>}<main className="lg:ml-60"><header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur"><div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-7 lg:px-10"><div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" aria-label="Abrir menu" className="shrink-0 lg:hidden" onClick={()=>setOpen(true)}><Menu/></Button><div><h1 className="font-display text-xl sm:text-2xl">Recepção · Atendimento</h1><p className="text-xs text-muted-foreground">ACCEB - Centro Médico</p></div></div>{headerActions}</div></header><div className="px-4 pb-10 sm:px-7 lg:px-10">{children}</div></main></div>;
}