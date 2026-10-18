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