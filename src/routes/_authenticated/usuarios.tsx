import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/AppShell";
import { accessQuery } from "@/lib/access";
import { Checkbox } from "@/components/ui/checkbox";

const usersQuery = queryOptions({
  queryKey: ["admin-users"],
  queryFn: async () => {
    const [p, m, r] = await Promise.all([
      supabase.from("profiles").select("id, email").order("email"),
      supabase.from("sector_members").select("user_id, sector_id"),
      supabase.from("user_roles").select("user_id, role"),
    ]);
    if (p.error) throw p.error;
    return { profiles: p.data, members: m.data ?? [], roles: r.data ?? [] };
  },
});

export const Route = createFileRoute("/_authenticated/usuarios")({
  head: () => ({
    meta: [
      { title: "Usuários — Portal ACCEB" },
      { name: "description", content: "Defina quais setores cada pessoa pode ver." },
      { property: "og:title", content: "Usuários — Portal ACCEB" },
      { property: "og:description", content: "Defina quais setores cada pessoa pode ver." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  loader: async ({ context }) => {
    const access = await context.queryClient.ensureQueryData(accessQuery);
    if (!access.isAdmin) throw redirect({ to: "/portal" });
    await context.queryClient.ensureQueryData(usersQuery);
  },
  component: UsersPage,
});

function UsersPage() {
  const { data: access } = useSuspenseQuery(accessQuery);
  const { data } = useSuspenseQuery(usersQuery);
  const qc = useQueryClient();

  async function toggle(userId: string, sectorId: string, on: boolean) {
    const { error } = on
      ? await supabase.from("sector_members").insert({ user_id: userId, sector_id: sectorId })
      : await supabase.from("sector_members").delete().eq("user_id", userId).eq("sector_id", sectorId);
    if (error) {
      toast.error("Não foi possível salvar.");
      return;
    }
    await qc.invalidateQueries({ queryKey: ["admin-users"] });
  }

  return (
    <AppShell>
      <h1 className="font-display text-4xl text-foreground">Usuários</h1>
      <p className="mt-1 text-muted-foreground">Marque os setores que cada pessoa pode ver. Administradores veem tudo.</p>
      <div className="mt-8 overflow-x-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-muted-foreground">
              <th className="p-4 font-medium">Pessoa</th>
              {access.sectors.map((s) => <th key={s.id} className="p-4 text-center font-medium">{s.name}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.profiles.map((p) => {
              const admin = data.roles.some((r) => r.user_id === p.id && r.role === "admin");
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-4 text-foreground">
                    {p.email}
                    {admin && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">Admin</span>}
                  </td>
                  {access.sectors.map((s) => (
                    <td key={s.id} className="p-4 text-center">
                      <Checkbox
                        disabled={admin}
                        checked={admin || data.members.some((m) => m.user_id === p.id && m.sector_id === s.id)}
                        onCheckedChange={(v) => toggle(p.id, s.id, v === true)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
