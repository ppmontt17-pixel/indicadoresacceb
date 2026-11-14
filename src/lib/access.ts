import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const accessQuery = queryOptions({
  queryKey: ["access"],
  queryFn: async () => {
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    const [{ data: roles }, { data: sectors, error }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", uid ?? ""),
      supabase.from("sectors").select("*").order("position"),
    ]);
    if (error) throw error;
    return {
      email: auth.user?.email ?? "",
      isAdmin: !!roles?.some((r) => r.role === "admin"),
      sectors: sectors ?? [],
    };
  },
});
