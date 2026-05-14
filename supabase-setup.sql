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

create table if not exists public.bank_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  aggregator text not null default 'gocardless-bank-account-data',
  institution_id text,
  institution_name text,
  requisition_id text,
  agreement_id text,
  account_ids jsonb not null default '[]'::jsonb,
  status text not null default 'draft',
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bank_sync_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bank_connection_id uuid not null references public.bank_connections(id) on delete cascade,
  status text not null default 'pending',
  imported_count integer not null default 0,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.bank_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bank_connection_id uuid not null references public.bank_connections(id) on delete cascade,
  external_transaction_id text not null,
  booking_date date not null,
  booking_datetime timestamptz,
  amount numeric(14,2) not null,
  currency text not null default 'EUR',
  direction text not null,
  description text,
  merchant_name text,
  balance_after numeric(14,2),
  planner_transaction_id text,
  planner_category text,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique(user_id, external_transaction_id)
);

drop trigger if exists trg_bank_connections_updated_at on public.bank_connections;
create trigger trg_bank_connections_updated_at
before update on public.bank_connections
for each row
execute function public.set_planner_states_updated_at();

alter table public.bank_connections enable row level security;
alter table public.bank_sync_runs enable row level security;
alter table public.bank_transactions enable row level security;

drop policy if exists "bank_connections_select_own" on public.bank_connections;
create policy "bank_connections_select_own"
on public.bank_connections
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "bank_connections_insert_own" on public.bank_connections;
create policy "bank_connections_insert_own"
on public.bank_connections
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "bank_connections_update_own" on public.bank_connections;
create policy "bank_connections_update_own"
on public.bank_connections
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "bank_connections_delete_own" on public.bank_connections;
create policy "bank_connections_delete_own"
on public.bank_connections
for delete
to authenticated
using (auth.uid() = user_id);

drop policy if exists "bank_sync_runs_select_own" on public.bank_sync_runs;
create policy "bank_sync_runs_select_own"
on public.bank_sync_runs
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "bank_sync_runs_insert_own" on public.bank_sync_runs;
create policy "bank_sync_runs_insert_own"
on public.bank_sync_runs
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "bank_sync_runs_update_own" on public.bank_sync_runs;
create policy "bank_sync_runs_update_own"
on public.bank_sync_runs
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "bank_transactions_select_own" on public.bank_transactions;
create policy "bank_transactions_select_own"
on public.bank_transactions
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "bank_transactions_insert_own" on public.bank_transactions;
create policy "bank_transactions_insert_own"
on public.bank_transactions
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "bank_transactions_update_own" on public.bank_transactions;
create policy "bank_transactions_update_own"
on public.bank_transactions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
