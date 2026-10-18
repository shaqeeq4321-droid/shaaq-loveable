ALTER TABLE public.appointments ADD COLUMN visit_address text;
GRANT INSERT ON public.appointments TO anon, authenticated;
GRANT ALL ON public.appointments TO service_role;