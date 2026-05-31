-- ============================================================
--  NOVO ACADEMY — Admin & Profiles schema
--  Run this in: Supabase Dashboard → SQL Editor → New query → paste → Run
-- ============================================================

-- 1) Profiles table — mirrors auth.users + adds app fields
create table if not exists public.profiles (
  id            uuid primary key references auth.users on delete cascade,
  email         text,
  name          text,
  lang          text default 'de',
  is_admin      boolean default false,
  created_at    timestamptz default now(),
  last_seen_at  timestamptz default now()
);

-- 2) Auto-create profile when a new auth.users row appears
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name',
             new.raw_user_meta_data->>'full_name',
             new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 3) Backfill profiles for users who signed up before this trigger existed
insert into public.profiles (id, email, name, created_at)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name',
           raw_user_meta_data->>'full_name',
           email),
  created_at
from auth.users
on conflict (id) do nothing;

-- 4) is_admin() helper — used by RLS policies and React app
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 5) Enable RLS on profiles
alter table public.profiles enable row level security;

-- Drop old policies if re-running
drop policy if exists "users read own profile"   on public.profiles;
drop policy if exists "users update own profile" on public.profiles;
drop policy if exists "admins read all profiles" on public.profiles;
drop policy if exists "admins update all profiles" on public.profiles;

create policy "users read own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "users update own profile" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "admins read all profiles" on public.profiles
  for select using (public.is_admin());

create policy "admins update all profiles" on public.profiles
  for update using (public.is_admin()) with check (true);

-- 6) Admin policies on user_progress (allow admins to read + write any row)
drop policy if exists "admins read all progress" on public.user_progress;
drop policy if exists "admins write all progress" on public.user_progress;

create policy "admins read all progress" on public.user_progress
  for select using (public.is_admin());

create policy "admins write all progress" on public.user_progress
  for all using (public.is_admin()) with check (true);

-- 7) Designate the first admin — REPLACE THE EMAIL BELOW with your own
update public.profiles
set    is_admin = true
where  email = 'evolutionnext696@gmail.com';

-- Sanity: show admins after running
select id, email, name, is_admin, lang, created_at
from   public.profiles
where  is_admin = true;
