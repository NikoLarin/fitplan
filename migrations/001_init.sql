create extension if not exists "pgcrypto";

create table if not exists plan_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  payload jsonb not null,
  plan_json jsonb,
  status text not null default 'pending'
);

create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  stripe_session_id text not null,
  plan_json jsonb not null,
  status text not null default 'paid'
);

create index if not exists idx_plans_email on plans(email);
