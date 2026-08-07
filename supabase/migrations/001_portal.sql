-- DuoNerds customer portal
-- Run this migration in the Supabase SQL editor before adding real users.

create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('customer', 'support', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.system_status as enum ('pending', 'active', 'paused', 'revoked');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ticket_status as enum ('open', 'in_progress', 'waiting', 'closed');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

create table if not exists public.systems (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_systems (
  user_id uuid not null references public.profiles(id) on delete cascade,
  system_id uuid not null references public.systems(id) on delete cascade,
  status public.system_status not null default 'pending',
  granted_at timestamptz,
  revoked_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, system_id)
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  subject text not null,
  description text not null default '',
  status public.ticket_status not null default 'open',
  priority text not null default 'normal' check (priority in ('normal', 'high', 'urgent')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'support')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.systems enable row level security;
alter table public.user_systems enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.audit_log enable row level security;

drop policy if exists "profiles_select_self_or_staff" on public.profiles;
create policy "profiles_select_self_or_staff" on public.profiles
  for select to authenticated using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles_update_staff" on public.profiles;
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "systems_select_active_or_staff" on public.systems;
create policy "systems_select_active_or_staff" on public.systems
  for select to authenticated using (active or public.is_staff());

drop policy if exists "systems_staff_write" on public.systems;
create policy "systems_staff_write" on public.systems
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "user_systems_select_own_or_staff" on public.user_systems;
create policy "user_systems_select_own_or_staff" on public.user_systems
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

drop policy if exists "user_systems_staff_write" on public.user_systems;
create policy "user_systems_staff_write" on public.user_systems
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "tickets_select_own_or_staff" on public.tickets;
create policy "tickets_select_own_or_staff" on public.tickets
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

drop policy if exists "tickets_insert_own" on public.tickets;
create policy "tickets_insert_own" on public.tickets
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "tickets_update_staff" on public.tickets;
create policy "tickets_update_staff" on public.tickets
  for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "ticket_messages_select_related" on public.ticket_messages;
create policy "ticket_messages_select_related" on public.ticket_messages
  for select to authenticated using (
    exists (select 1 from public.tickets t where t.id = ticket_id and (t.user_id = auth.uid() or public.is_staff()))
  );

drop policy if exists "ticket_messages_insert_related" on public.ticket_messages;
create policy "ticket_messages_insert_related" on public.ticket_messages
  for insert to authenticated with check (
    author_id = auth.uid() and exists (
      select 1 from public.tickets t where t.id = ticket_id and (t.user_id = auth.uid() or public.is_staff())
    )
  );

drop policy if exists "audit_staff_only" on public.audit_log;
create policy "audit_staff_only" on public.audit_log
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

create or replace function public.set_system_access(
  p_user_id uuid,
  p_system_id uuid,
  p_status public.system_status
)
returns public.user_systems
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_access public.user_systems;
begin
  if not public.is_admin() then
    raise exception 'Only admins can change system access';
  end if;

  update public.user_systems
  set
    status = p_status,
    granted_at = case when p_status = 'active' then coalesce(granted_at, now()) else granted_at end,
    revoked_at = case when p_status = 'revoked' then now() else null end,
    updated_at = now()
  where user_id = p_user_id and system_id = p_system_id
  returning * into updated_access;

  if not found then
    raise exception 'System access request not found';
  end if;

  insert into public.audit_log (actor_id, action, entity_type, entity_id, metadata)
  values (
    auth.uid(),
    'system_access_' || p_status::text,
    'user_system',
    p_system_id,
    jsonb_build_object('user_id', p_user_id, 'system_id', p_system_id, 'status', p_status::text)
  );

  return updated_access;
end;
$$;

revoke all on function public.set_system_access(uuid, uuid, public.system_status) from public;
grant execute on function public.set_system_access(uuid, uuid, public.system_status) to authenticated;

insert into public.systems (slug, name, category, description)
values
  ('metin2-core', 'Metin2 Core System', 'Metin2', 'Systeme, Erweiterungen und wartbare Core-Anpassungen.'),
  ('palworld-toolkit', 'Palworld Toolkit', 'Palworld', 'Mods, Tools und Server-Workflows für Palworld.'),
  ('minecraft-network', 'Minecraft Network Tools', 'Minecraft', 'Plugins, Netzwerkbausteine und Community-Funktionen.'),
  ('web-operations', 'Web & Operations', 'Web & Tools', 'Dashboards, interne Tools und sichere Betriebsabläufe.')
on conflict (slug) do nothing;
