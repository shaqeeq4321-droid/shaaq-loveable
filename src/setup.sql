-- Shaaq Trading database setup. Paste this whole file into Supabase -> SQL Editor -> New query -> Run.
-- Run it once on a fresh project.

-- ===== 20260920193945_67a08125-9934-4629-a2bd-ff159c38578c.sql =====
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  interests TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'requested',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.appointments TO anon;
GRANT INSERT ON public.appointments TO authenticated;
GRANT ALL ON public.appointments TO service_role;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can request an appointment" ON public.appointments FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.quote_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  garment_type TEXT NOT NULL,
  specification JSONB NOT NULL DEFAULT '{}'::jsonb,
  quantity INTEGER,
  sizes TEXT,
  fabric_notes TEXT,
  stitching_notes TEXT,
  logo_url TEXT,
  logo_placement TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quote_requests TO anon;
GRANT INSERT ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a quote request" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
-- ===== 20260920194026_d32c72f9-2da9-4544-b5b0-43bbd6a04a93.sql =====
CREATE POLICY "Anyone can upload a customer logo"
ON storage.objects FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'customer-logos');
-- ===== 20261001211945_6e2da4a1-2fe8-4770-b1ad-7541341b03e3.sql =====
create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public
as $$ begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return public.has_role(auth.uid(), 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
  return true;
end $$;
revoke execute on function public.claim_first_admin() from public, anon;
grant execute on function public.claim_first_admin() to authenticated;

create table public.cars (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  make text not null,
  model text not null,
  year int,
  price numeric,
  mileage int,
  fuel text,
  transmission text,
  body_type text,
  colour text,
  engine text,
  doors int,
  description text,
  features text[] not null default '{}',
  photos text[] not null default '{}',
  status text not null default 'available',
  published boolean not null default true,
  created_at timestamptz not null default now()
);
grant select on public.cars to anon;
grant select, insert, update, delete on public.cars to authenticated;
grant all on public.cars to service_role;
alter table public.cars enable row level security;
create policy "Public view published cars" on public.cars for select to anon, authenticated using (published = true);
create policy "Admins view all cars" on public.cars for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins insert cars" on public.cars for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins update cars" on public.cars for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete cars" on public.cars for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Public read car photos" on storage.objects for select using (bucket_id = 'car-photos');
create policy "Admins upload car photos" on storage.objects for insert to authenticated with check (bucket_id = 'car-photos' and public.has_role(auth.uid(), 'admin'));
create policy "Admins delete car photos" on storage.objects for delete to authenticated using (bucket_id = 'car-photos' and public.has_role(auth.uid(), 'admin'));
-- ===== 20261004105251_152e5ed3-7c67-455b-b669-152529e80e26.sql =====
ALTER TABLE public.appointments ADD COLUMN visit_address text;
GRANT INSERT ON public.appointments TO anon, authenticated;
GRANT ALL ON public.appointments TO service_role;
-- ===== 20261005202453_b0ed8b72-5ba1-47f0-9680-a00d483808d2.sql =====
CREATE TABLE public.vehicle_enquiries (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, email text NOT NULL, phone text, vehicle_id uuid REFERENCES public.cars(id) ON DELETE SET NULL, vehicle_title text, desired_vehicle text NOT NULL, budget text, message text NOT NULL, created_at timestamptz NOT NULL DEFAULT now());
GRANT INSERT ON public.vehicle_enquiries TO anon, authenticated;
GRANT SELECT ON public.vehicle_enquiries TO authenticated;
GRANT ALL ON public.vehicle_enquiries TO service_role;
ALTER TABLE public.vehicle_enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors submit vehicle enquiries" ON public.vehicle_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins review vehicle enquiries" ON public.vehicle_enquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- ===== Storage buckets (private; the site uses signed links for car photos) =====
insert into storage.buckets (id, name, public) values ('car-photos','car-photos',false), ('customer-logos','customer-logos',false) on conflict (id) do nothing;
