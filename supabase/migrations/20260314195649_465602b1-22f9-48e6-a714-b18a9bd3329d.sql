
-- Tabela central de tenants
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  waba_id text unique,
  phone_number text,
  plan text default 'pro_300',
  status text default 'active' check (status in ('active', 'no_balance', 'suspended')),
  prompt text,
  company_info jsonb default '{}',
  re_engagement_config jsonb default '{"max_attempts": 3, "interval_hours": 6}',
  created_at timestamptz default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  role text default 'member' check (role in ('super_admin', 'tenant_admin', 'member')),
  name text,
  email text,
  created_at timestamptz default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text,
  phone text not null,
  channel text not null check (channel in ('WhatsApp', 'Instagram', 'Facebook', 'Site', 'Outros')),
  status text not null default 'in_progress' check (status in ('qualified', 'in_progress', 'forwarded', 'disqualified', 'reengagement')),
  interaction_count integer default 0,
  disqualification_reason text,
  last_contact timestamptz default now(),
  created_at timestamptz default now(),
  unique (tenant_id, phone)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  messages jsonb default '[]',
  status text default 'open',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.packages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  type text default 'base' check (type in ('base', 'excess')),
  total_credits integer not null,
  used_credits integer default 0,
  expires_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists public.re_engagement_jobs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  attempt integer default 1,
  max_attempts integer default 3,
  next_run_at timestamptz,
  status text default 'pending' check (status in ('pending', 'sent', 'exhausted')),
  created_at timestamptz default now()
);

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.packages enable row level security;
alter table public.re_engagement_jobs enable row level security;

create or replace function public.get_my_tenant_id()
returns uuid language sql security definer set search_path = public
as $$ select tenant_id from public.profiles where id = auth.uid() $$;

create or replace function public.is_super_admin()
returns boolean language sql security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'super_admin') $$;

create policy "profiles_select_own" on public.profiles for select using (id = auth.uid() or public.is_super_admin());
create policy "profiles_insert_own" on public.profiles for insert with check (id = auth.uid());
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid() or public.is_super_admin());

create policy "tenants_select" on public.tenants for select using (id = public.get_my_tenant_id() or public.is_super_admin());
create policy "tenants_insert_admin" on public.tenants for insert with check (public.is_super_admin());
create policy "tenants_update" on public.tenants for update using (id = public.get_my_tenant_id() or public.is_super_admin());

create policy "leads_select" on public.leads for select using (tenant_id = public.get_my_tenant_id() or public.is_super_admin());
create policy "leads_insert" on public.leads for insert with check (tenant_id = public.get_my_tenant_id());
create policy "leads_update" on public.leads for update using (tenant_id = public.get_my_tenant_id() or public.is_super_admin());

create policy "conversations_select" on public.conversations for select using (tenant_id = public.get_my_tenant_id() or public.is_super_admin());
create policy "conversations_insert" on public.conversations for insert with check (tenant_id = public.get_my_tenant_id());

create policy "packages_select" on public.packages for select using (tenant_id = public.get_my_tenant_id() or public.is_super_admin());
create policy "packages_insert_admin" on public.packages for insert with check (public.is_super_admin());

create policy "reengagement_select" on public.re_engagement_jobs for select using (tenant_id = public.get_my_tenant_id() or public.is_super_admin());

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public
as $$ begin new.updated_at = now(); return new; end; $$;

create trigger conversations_updated_at
  before update on public.conversations
  for each row execute function public.update_updated_at_column();
