CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
CREATE TABLE public.sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  position int NOT NULL DEFAULT 0
);
CREATE TABLE public.sector_members (
  user_id uuid NOT NULL,
  sector_id uuid NOT NULL REFERENCES public.sectors(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, sector_id)
);
CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id uuid NOT NULL REFERENCES public.sectors(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  sheet_name text NOT NULL,
  columns jsonb NOT NULL DEFAULT '[]',
  rows jsonb NOT NULL DEFAULT '[]',
  uploaded_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles, public.user_roles, public.sectors TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.sector_members TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.reports TO authenticated;
GRANT ALL ON public.profiles, public.user_roles, public.sectors, public.sector_members, public.reports TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sector_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;
CREATE OR REPLACE FUNCTION public.is_sector_member(_user_id uuid, _sector_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.sector_members WHERE user_id = _user_id AND sector_id = _sector_id)
$$;

CREATE POLICY "own or admin profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "sectors visible" ON public.sectors FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_sector_member(auth.uid(), id));
CREATE POLICY "members read" ON public.sector_members FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin add members" ON public.sector_members FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin remove members" ON public.sector_members FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "reports read" ON public.reports FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.is_sector_member(auth.uid(), sector_id));
CREATE POLICY "reports insert" ON public.reports FOR INSERT TO authenticated
  WITH CHECK (uploaded_by = auth.uid() AND (public.has_role(auth.uid(), 'admin') OR public.is_sector_member(auth.uid(), sector_id)));
CREATE POLICY "reports delete" ON public.reports FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR (uploaded_by = auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email) ON CONFLICT DO NOTHING;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

INSERT INTO public.profiles (id, email) SELECT id, email FROM auth.users ON CONFLICT DO NOTHING;
INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'admin' FROM auth.users ORDER BY created_at LIMIT 1 ON CONFLICT DO NOTHING;

INSERT INTO public.sectors (slug, name, description, position) VALUES
  ('faturamento', 'Faturamento', 'Receita, convênios e glosas', 1),
  ('financeiro-custos', 'Financeiro · Custos', 'Custos e fluxo de caixa', 2),
  ('compras', 'Compras', 'Pedidos, fornecedores e estoque', 3),
  ('recepcao', 'Recepção · Atendimento', 'Atendimentos e agenda', 4);