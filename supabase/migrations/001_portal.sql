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

alter table public.profiles add column if not exists discord_id text;
alter table public.profiles add column if not exists discord_username text;
alter table public.profiles add column if not exists discord_global_name text;
alter table public.profiles add column if not exists discord_avatar_url text;
alter table public.profiles add column if not exists discord_synced_at timestamptz;
create unique index if not exists profiles_discord_id_key on public.profiles (discord_id) where discord_id is not null;

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

create table if not exists public.discord_memberships (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  discord_user_id text not null,
  guild_id text not null,
  username text not null default '',
  global_name text not null default '',
  avatar_url text,
  role_ids text[] not null default '{}',
  is_member boolean not null default false,
  synced_at timestamptz not null default now()
);

create table if not exists public.product_role_access (
  product_id text not null,
  discord_role_id text not null,
  label text not null default '',
  created_at timestamptz not null default now(),
  primary key (product_id, discord_role_id)
);

create table if not exists public.user_product_access (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id text not null,
  granted_via_role_id text not null,
  granted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, product_id)
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
  insert into public.profiles (id, display_name, discord_id, discord_username, discord_global_name, discord_avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'global_name', new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(new.raw_user_meta_data ->> 'provider_id', new.raw_user_meta_data ->> 'sub'),
    coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'username', ''),
    coalesce(new.raw_user_meta_data ->> 'global_name', ''),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update set
    display_name = case when public.profiles.display_name = '' then excluded.display_name else public.profiles.display_name end,
    discord_id = coalesce(excluded.discord_id, public.profiles.discord_id),
    discord_username = coalesce(nullif(excluded.discord_username, ''), public.profiles.discord_username),
    discord_global_name = coalesce(nullif(excluded.discord_global_name, ''), public.profiles.discord_global_name),
    discord_avatar_url = coalesce(excluded.discord_avatar_url, public.profiles.discord_avatar_url);
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
alter table public.discord_memberships enable row level security;
alter table public.product_role_access enable row level security;
alter table public.user_product_access enable row level security;
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

drop policy if exists "discord_memberships_select_own_or_staff" on public.discord_memberships;
create policy "discord_memberships_select_own_or_staff" on public.discord_memberships
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

drop policy if exists "product_role_access_select_staff" on public.product_role_access;
create policy "product_role_access_select_staff" on public.product_role_access
  for select to authenticated using (public.is_staff());

drop policy if exists "product_role_access_admin_write" on public.product_role_access;
create policy "product_role_access_admin_write" on public.product_role_access
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "user_product_access_select_own_or_staff" on public.user_product_access;
create policy "user_product_access_select_own_or_staff" on public.user_product_access
  for select to authenticated using (user_id = auth.uid() or public.is_staff());

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
