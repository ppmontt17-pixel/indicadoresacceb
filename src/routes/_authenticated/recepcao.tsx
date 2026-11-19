import { createFileRoute, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { accessQuery } from "@/lib/access";
import { ReceptionShell } from "@/features/recepcao/dashboard-shell";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReceptionDashboard } from "@/features/recepcao/dashboard";
import { isReceptionRows } from "@/features/recepcao/report";

const receptionQuery = (sectorId:string) => queryOptions({queryKey:["reception-reports",sectorId],queryFn:async()=>{
  const {data,error}=await supabase.from("reports").select("*").eq("sector_id",sectorId).order("created_at",{ascending:false});
  if(error) throw error;
  return data.flatMap((r)=>Array.isArray(r.rows) && isReceptionRows(r.rows) ? [{...r,rows:r.rows}] : []);
}});
export const Route = createFileRoute("/_authenticated/recepcao")({
  head:()=>({meta:[{title:"Recepção · Atendimento — Portal ACCEB"},{name:"description",content:"Atendimentos, convênios, especialidades, exames e resultados da recepção ACCEB."},{property:"og:title",content:"Recepção · Atendimento — Portal ACCEB"},{property:"og:description",content:"Resultados mensais da recepção e atendimento ACCEB."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),
  loader:async({context})=>{const access=await context.queryClient.ensureQueryData(accessQuery);const sector=access.sectors.find(s=>s.slug==="recepcao");if(!sector)throw notFound();await context.queryClient.ensureQueryData(receptionQuery(sector.id));return {sector};},
  component:ReceptionPage,
});
function ReceptionPage(){
  const {sector}=Route.useLoaderData();const {data}=useSuspenseQuery(receptionQuery(sector.id));const [selected,setSelected]=useState("");
  const [activeGroup,setActiveGroup]=useState(1);
  const report=data.find(r=>r.id===selected)??data[0];
  return <ReceptionShell active={activeGroup} onSelect={setActiveGroup} headerActions={report && <Select value={report.id} onValueChange={setSelected}><SelectTrigger className="w-48 bg-card sm:w-64"><SelectValue/></SelectTrigger><SelectContent>{data.map(r=><SelectItem key={r.id} value={r.id}>{r.rows[0]?.periodo}</SelectItem>)}</SelectContent></Select>}>{report ? <ReceptionDashboard key={`${report.id}-${activeGroup}`} rows={report.rows} activeGroup={activeGroup}/> : <p className="mt-8 text-muted-foreground">Nenhum relatório de recepção enviado.</p>}</ReceptionShell>;
}