CREATE OR REPLACE FUNCTION public.can_see_sector(_user_id uuid, _slug text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin') OR EXISTS (
    SELECT 1 FROM public.sector_members m JOIN public.sectors s ON s.id = m.sector_id
    WHERE m.user_id = _user_id AND s.slug = _slug)
$$;

CREATE TABLE public.faturamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operadora text NOT NULL,
  mes text NOT NULL,
  ano integer NOT NULL DEFAULT 2026,
  faturado numeric(14,2) NOT NULL DEFAULT 0,
  pago numeric(14,2) NOT NULL DEFAULT 0,
  glosado numeric(14,2) NOT NULL DEFAULT 0,
  pendente numeric(14,2) NOT NULL DEFAULT 0,
  contas integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.glosas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operadora text NOT NULL,
  mes text NOT NULL,
  ano integer NOT NULL DEFAULT 2026,
  numero_guia text,
  paciente text,
  procedimento text,
  motivo text,
  valor_glosado numeric(14,2) NOT NULL DEFAULT 0,
  valor_recuperado numeric(14,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Em análise' CHECK (status IN ('Em análise','A recursar','Pago','Pago Parcial','Glosa devida','Não Pago','Excedeu o Prazo')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX faturamento_ano_idx ON public.faturamento (ano, operadora, mes);
CREATE INDEX glosas_ano_idx ON public.glosas (ano, operadora, mes);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.faturamento, public.glosas TO authenticated;
GRANT ALL ON public.faturamento, public.glosas TO service_role;
ALTER TABLE public.faturamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glosas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sector read" ON public.faturamento FOR SELECT TO authenticated USING (public.can_see_sector(auth.uid(), 'faturamento'));
CREATE POLICY "admin write" ON public.faturamento FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "sector read" ON public.glosas FOR SELECT TO authenticated USING (public.can_see_sector(auth.uid(), 'faturamento'));
CREATE POLICY "admin write" ON public.glosas FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));