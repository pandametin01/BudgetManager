create extension if not exists pgcrypto;

create table if not exists public.planner_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text,
  planner_state jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_planner_states_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_planner_states_updated_at on public.planner_states;
create trigger trg_planner_states_updated_at
before update on public.planner_states
for each row
execute function public.set_planner_states_updated_at();

alter table public.planner_states enable row level security;

drop policy if exists "planner_states_select_own" on public.planner_states;
create policy "planner_states_select_own"
on public.planner_states
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "planner_states_insert_own" on public.planner_states;
create policy "planner_states_insert_own"
on public.planner_states
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "planner_states_update_own" on public.planner_states;
create policy "planner_states_update_own"
on public.planner_states
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "planner_states_delete_own" on public.planner_states;
create policy "planner_states_delete_own"
on public.planner_states
for delete
to authenticated
using (auth.uid() = user_id);
