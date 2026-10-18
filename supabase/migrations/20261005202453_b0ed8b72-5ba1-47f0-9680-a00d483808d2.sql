CREATE TABLE public.vehicle_enquiries (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, email text NOT NULL, phone text, vehicle_id uuid REFERENCES public.cars(id) ON DELETE SET NULL, vehicle_title text, desired_vehicle text NOT NULL, budget text, message text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT INSERT ON public.vehicle_enquiries TO anon, authenticated;
GRANT SELECT ON public.vehicle_enquiries TO authenticated;
GRANT ALL ON public.vehicle_enquiries TO service_role;
ALTER TABLE public.vehicle_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit vehicle enquiries" ON public.vehicle_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins review vehicle enquiries" ON public.vehicle_enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));